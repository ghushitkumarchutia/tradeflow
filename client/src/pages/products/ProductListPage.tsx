import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProducts,
  createProduct,
  updateProduct,
} from "../../api/products.api";
import { useAuth } from "../../hooks/useAuth";
import { Table } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import type { Product } from "../../types";
import { Search, Plus, Loader2, Edit2, AlertTriangle } from "lucide-react";
import type { AxiosError } from "axios";

export function ProductListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [debouncedCategory, setDebouncedCategory] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedCategory(category);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, category]);

  const { data, isLoading } = useQuery({
    queryKey: [
      "products",
      { page, limit: 10, search: debouncedSearch, category: debouncedCategory },
    ],
    queryFn: () =>
      listProducts({
        page,
        limit: 10,
        search: debouncedSearch,
        category: debouncedCategory,
      }),
  });

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    category: "",
    unitPrice: "",
    minStockLevel: "",
  });

  const [formError, setFormError] = useState("");

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        sku: product.sku,
        name: product.name,
        description: product.description || "",
        category: product.category,
        unitPrice: product.unitPrice.toString(),
        minStockLevel: product.minStockLevel.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        sku: "",
        name: "",
        description: "",
        category: "",
        unitPrice: "",
        minStockLevel: "",
      });
    }
    setFormError("");
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: (input: typeof formData) => {
      const payload = {
        ...input,
        unitPrice: parseFloat(input.unitPrice),
        minStockLevel: parseInt(input.minStockLevel, 10),
      };
      if (editingProduct) {
        return updateProduct(editingProduct.id, payload);
      }
      return createProduct(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setFormError(error.response?.data?.message || "Failed to save product");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    saveMutation.mutate(formData);
  };

  const canEdit = user?.role === "ADMIN" || user?.role === "WAREHOUSE";

  const columns = [
    {
      key: "sku",
      header: "SKU",
      render: (p: Product) => (
        <span className='font-mono text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-700'>
          {p.sku}
        </span>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (p: Product) => <span className='font-semibold'>{p.name}</span>,
    },
    { key: "category", header: "Category" },
    {
      key: "unitPrice",
      header: "Price",
      render: (p: Product) => `$${p.unitPrice.toFixed(2)}`,
    },
    {
      key: "currentStock",
      header: "Stock",
      render: (p: Product) => {
        const isLowStock = p.currentStock <= p.minStockLevel;
        return (
          <div className='flex items-center gap-2'>
            <span
              className={`font-semibold ${isLowStock ? "text-red-600" : "text-green-600"}`}
            >
              {p.currentStock}
            </span>
            {isLowStock && (
              <AlertTriangle
                className='w-4 h-4 text-red-500'
                title='Low Stock Warning'
              />
            )}
          </div>
        );
      },
    },
    ...(canEdit
      ? [
          {
            key: "actions",
            header: "Actions",
            render: (p: Product) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(p);
                }}
                className='p-2 text-gray-400 hover:text-brand-DEFAULT transition-colors rounded-full hover:bg-brand-light'
              >
                <Edit2 className='w-4 h-4' />
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>Products Inventory</h1>
        {canEdit && (
          <Button onClick={() => handleOpenModal()} className='gap-2'>
            <Plus className='w-4 h-4' /> Add Product
          </Button>
        )}
      </div>

      <div className='bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6'>
        <div className='flex flex-col sm:flex-row items-center gap-4'>
          <div className='relative flex-1 w-full'>
            <Search className='w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Search products by name or SKU...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-11'
            />
          </div>
          <div className='w-full sm:w-64'>
            <Input
              type='text'
              placeholder='Filter by category...'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className='flex justify-center p-12'>
            <Loader2 className='w-8 h-8 text-brand-DEFAULT animate-spin' />
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            <Table
              columns={columns}
              data={data?.items || []}
              keyExtractor={(item) => item.id}
              emptyMessage='No products found.'
            />

            {data && data.total > 10 && (
              <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
                <span className='text-sm text-gray-500'>
                  Showing {(page - 1) * 10 + 1} to{" "}
                  {Math.min(page * 10, data.total)} of {data.total}
                </span>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page * 10 >= data.total}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <form
          id='product-form'
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          {formError && (
            <div className='p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium'>
              {formError}
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='SKU *'
              required
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
            />
            <Input
              label='Name *'
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <Input
            label='Category *'
            required
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />

          <div className='flex flex-col gap-1.5 w-full'>
            <label className='text-sm font-medium text-gray-700'>
              Description
            </label>
            <textarea
              className='px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-DEFAULT min-h-25 resize-y'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Unit Price ($) *'
              type='number'
              step='0.01'
              min='0'
              required
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData({ ...formData, unitPrice: e.target.value })
              }
            />
            <Input
              label='Min. Stock Level *'
              type='number'
              min='0'
              required
              value={formData.minStockLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minStockLevel: e.target.value,
                })
              }
            />
          </div>
        </form>

        <div className='mt-6 flex justify-end gap-3'>
          <Button
            variant='ghost'
            onClick={() => setIsModalOpen(false)}
            type='button'
          >
            Cancel
          </Button>
          <Button
            form='product-form'
            type='submit'
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
