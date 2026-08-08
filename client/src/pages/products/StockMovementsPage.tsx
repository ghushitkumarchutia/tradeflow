import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listStockMovements, createStockMovement } from "../../api/stock.api";
import { listProducts } from "../../api/products.api";
import { useAuth } from "../../hooks/useAuth";
import { Table } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import type { StockMovement, MovementType } from "../../types";
import { ArrowDownRight, ArrowUpRight, Plus, Loader2 } from "lucide-react";
import type { AxiosError } from "axios";

export function StockMovementsPage() {
  const [page, setPage] = useState(1);
  const [productIdFilter, setProductIdFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<MovementType | "ALL">("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: movements, isLoading } = useQuery({
    queryKey: [
      "stock-movements",
      {
        page,
        limit: 10,
        productId: productIdFilter || undefined,
        type: typeFilter !== "ALL" ? typeFilter : undefined,
      },
    ],
    queryFn: () =>
      listStockMovements({
        page,
        limit: 10,
        productId: productIdFilter || undefined,
        type: typeFilter !== "ALL" ? typeFilter : undefined,
      }),
  });

  const { data: productsData } = useQuery({
    queryKey: ["products-for-dropdown"],
    queryFn: () => listProducts({ page: 1, limit: 100 }),
  });

  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    type: "IN" as MovementType,
    reason: "",
  });

  const [formError, setFormError] = useState("");

  const createMutation = useMutation({
    mutationFn: (input: typeof formData) =>
      createStockMovement({
        productId: input.productId,
        quantity: parseInt(input.quantity, 10),
        type: input.type,
        reason: input.reason || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      setFormData({ productId: "", quantity: "", type: "IN", reason: "" });
      setFormError("");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setFormError(
        error.response?.data?.message || "Failed to record movement",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    createMutation.mutate(formData);
  };

  const canEdit = user?.role === "ADMIN" || user?.role === "WAREHOUSE";

  const columns = [
    {
      key: "type",
      header: "Type",
      render: (m: StockMovement) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
            m.type === "IN"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {m.type === "IN" ? (
            <ArrowDownRight className='w-3 h-3' />
          ) : (
            <ArrowUpRight className='w-3 h-3' />
          )}
          {m.type}
        </span>
      ),
    },
    {
      key: "product",
      header: "Product",
      render: (m: StockMovement) => (
        <span className='font-semibold'>{m.product.name}</span>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (m: StockMovement) => (
        <span
          className={
            m.type === "IN"
              ? "text-green-600 font-medium"
              : "text-orange-600 font-medium"
          }
        >
          {m.type === "IN" ? "+" : "-"}
          {m.quantity}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      render: (m: StockMovement) => (
        <span className='text-gray-500'>{m.reason || "-"}</span>
      ),
    },
    {
      key: "user",
      header: "Recorded By",
      render: (m: StockMovement) => m.user.name,
    },
    {
      key: "date",
      header: "Date",
      render: (m: StockMovement) => new Date(m.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>Stock Movements</h1>
        {canEdit && (
          <Button onClick={() => setIsModalOpen(true)} className='gap-2'>
            <Plus className='w-4 h-4' /> Record Movement
          </Button>
        )}
      </div>

      <div className='bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6'>
        <div className='flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-6'>
          <div className='flex flex-col gap-1.5 w-full sm:w-64'>
            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Filter by Product
            </label>
            <select
              className='px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light'
              value={productIdFilter}
              onChange={(e) => {
                setProductIdFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value=''>All Products</option>
              {productsData?.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-1.5 w-full sm:w-48'>
            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Filter by Type
            </label>
            <select
              className='px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light'
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as MovementType | "ALL");
                setPage(1);
              }}
            >
              <option value='ALL'>All Movements</option>
              <option value='IN'>Stock IN</option>
              <option value='OUT'>Stock OUT</option>
            </select>
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
              data={movements?.items || []}
              keyExtractor={(item) => item.id}
              emptyMessage='No stock movements found matching these filters.'
            />

            {movements && movements.total > 10 && (
              <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
                <span className='text-sm text-gray-500'>
                  Showing {(page - 1) * 10 + 1} to{" "}
                  {Math.min(page * 10, movements.total)} of {movements.total}
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
                    disabled={page * 10 >= movements.total}
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
        onClose={() => {
          setIsModalOpen(false);
          setFormError("");
        }}
        title='Record Manual Stock Movement'
      >
        <form
          id='movement-form'
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          {formError && (
            <div className='p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium'>
              {formError}
            </div>
          )}

          <div className='flex flex-col gap-1.5 w-full'>
            <label className='text-sm font-medium text-gray-700'>
              Product *
            </label>
            <select
              required
              className='px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-DEFAULT'
              value={formData.productId}
              onChange={(e) =>
                setFormData({ ...formData, productId: e.target.value })
              }
            >
              <option value='' disabled>
                Select a product
              </option>
              {productsData?.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.currentStock})
                </option>
              ))}
            </select>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5 w-full'>
              <label className='text-sm font-medium text-gray-700'>
                Movement Type *
              </label>
              <select
                required
                className='px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-DEFAULT'
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as MovementType,
                  })
                }
              >
                <option value='IN'>Stock IN (+)</option>
                <option value='OUT'>Stock OUT (-)</option>
              </select>
            </div>
            <Input
              label='Quantity *'
              type='number'
              min='1'
              required
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
          </div>

          <div className='flex flex-col gap-1.5 w-full'>
            <label className='text-sm font-medium text-gray-700'>
              Reason / Notes
            </label>
            <textarea
              className='px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-DEFAULT min-h-25 resize-y'
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              placeholder='e.g. Audit adjustment, damaged goods...'
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
            form='movement-form'
            type='submit'
            disabled={createMutation.isPending || !formData.productId}
          >
            {createMutation.isPending ? "Recording..." : "Record Movement"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
