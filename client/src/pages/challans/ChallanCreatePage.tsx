import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createChallan } from "../../api/challans.api";
import { listCustomers } from "../../api/customers.api";
import { listProducts } from "../../api/products.api";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import type { AxiosError } from "axios";
import { isAxiosError } from "axios";

export function ChallanCreatePage() {
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<{ productId: string; quantity: string }[]>(
    [{ productId: "", quantity: "1" }],
  );
  const [formError, setFormError] = useState("");

  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers-active"],
    queryFn: () => listCustomers({ page: 1, limit: 500 }),
  });

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products-active"],
    queryFn: () => listProducts({ page: 1, limit: 1000 }),
  });

  const createMutation = useMutation({
    mutationFn: (input: {
      customerId: string;
      items: { productId: string; quantity: number }[];
    }) => createChallan(input),
    onSuccess: (data) => {
      navigate(`/challans/${data.id}`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (isAxiosError(error)) {
        setFormError(
          error.response?.data?.message || "Failed to create challan",
        );
      } else {
        setFormError("Failed to create challan");
      }
    },
  });

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: "1" }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (
    index: number,
    field: "productId" | "quantity",
    value: string,
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!customerId) {
      setFormError("Please select a customer.");
      return;
    }

    if (items.length === 0) {
      setFormError("Please add at least one product.");
      return;
    }

    if (
      items.some(
        (i) => !i.productId || !i.quantity || parseInt(i.quantity, 10) <= 0,
      )
    ) {
      setFormError(
        "Please fill out all product fields correctly. Quantity must be > 0.",
      );
      return;
    }

    createMutation.mutate({
      customerId,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: parseInt(i.quantity, 10),
      })),
    });
  };

  if (isLoadingCustomers || isLoadingProducts) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='w-8 h-8 text-brand-DEFAULT animate-spin' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 max-w-4xl'>
      <div className='flex items-center justify-between'>
        <button
          onClick={() => navigate("/challans")}
          className='flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' /> Back to Challans
        </button>
      </div>

      <div className='bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col gap-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Create New Challan
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Build a new draft challan. Products will be verified upon
            confirmation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          {formError && (
            <div className='p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100'>
              {formError}
            </div>
          )}

          <div className='flex flex-col gap-1.5 w-full md:w-1/2'>
            <label className='text-sm font-medium text-gray-700'>
              Select Customer *
            </label>
            <select
              required
              className='px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-DEFAULT'
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value='' disabled>
                Choose a customer...
              </option>
              {customersData?.items
                .filter((c) => c.status === "ACTIVE")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.phone}
                  </option>
                ))}
            </select>
          </div>

          <div className='flex flex-col gap-4 border-t border-gray-100 pt-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Line Items
              </h3>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleAddItem}
                className='gap-2'
              >
                <Plus className='w-4 h-4' /> Add Product
              </Button>
            </div>

            <div className='flex flex-col gap-4'>
              {items.map((item, index) => (
                <div
                  key={index}
                  className='flex flex-col sm:flex-row gap-4 items-start sm:items-end p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group'
                >
                  <div className='flex flex-col gap-1.5 w-full sm:flex-1'>
                    <label className='text-sm font-medium text-gray-700'>
                      Product *
                    </label>
                    <select
                      required
                      className='px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-DEFAULT'
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(index, "productId", e.target.value)
                      }
                    >
                      <option value='' disabled>
                        Select a product...
                      </option>
                      {productsData?.items.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.sku} - {p.name} (Stock: {p.currentStock})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='w-full sm:w-32'>
                    <Input
                      label='Quantity *'
                      type='number'
                      min='1'
                      required
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                    />
                  </div>

                  {items.length > 1 && (
                    <button
                      type='button'
                      onClick={() => handleRemoveItem(index)}
                      className='p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-6 sm:mt-0'
                      title='Remove product'
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='flex justify-end pt-6 border-t border-gray-100'>
            <Button
              type='submit'
              disabled={createMutation.isPending}
              className='px-8'
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Saving
                  Draft...
                </>
              ) : (
                "Create Draft Challan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
