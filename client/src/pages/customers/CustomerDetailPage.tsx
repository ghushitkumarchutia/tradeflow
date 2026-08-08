import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomer, updateCustomer } from "../../api/customers.api";
import { useAuth } from "../../hooks/useAuth";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ArrowLeft, Edit2, Loader2, Save, X } from "lucide-react";
import type { CustomerType, CustomerStatus } from "../../types";
import type { AxiosError } from "axios";

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    data: customer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomer(id!),
    enabled: !!id,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    taxId: "",
    type: "RETAIL" as CustomerType,
    status: "ACTIVE" as CustomerStatus,
  });

  const updateMutation = useMutation({
    mutationFn: (input: typeof formData) => updateCustomer(id!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", id] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsEditing(false);
      setFormError("");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setFormError(
        error.response?.data?.message || "Failed to update customer",
      );
    },
  });

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='w-8 h-8 text-brand-DEFAULT animate-spin' />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className='flex flex-col items-center justify-center h-64 gap-4'>
        <p className='text-gray-500 font-medium'>
          Customer not found or failed to load.
        </p>
        <Button variant='outline' onClick={() => navigate("/customers")}>
          Back to Customers
        </Button>
      </div>
    );
  }

  const canEdit = user?.role === "ADMIN" || user?.role === "SALES";

  return (
    <div className='flex flex-col gap-6 max-w-4xl'>
      <div className='flex items-center justify-between'>
        <button
          onClick={() => navigate("/customers")}
          className='flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' /> Back to Customers
        </button>
        {canEdit && !isEditing && (
          <Button
            variant='outline'
            onClick={() => {
              setFormData({
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                taxId: customer.taxId || "",
                type: customer.type,
                status: customer.status,
              });
              setIsEditing(true);
            }}
            className='gap-2'
          >
            <Edit2 className='w-4 h-4' /> Edit Customer
          </Button>
        )}
      </div>

      <div className='bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden'>
        <div className='absolute top-0 left-0 w-full h-32 bg-linear-to-r from-brand-muted to-white opacity-50 pointer-events-none'></div>

        <div className='relative z-10 flex flex-col gap-8'>
          <div className='flex items-start justify-between'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-3xl font-bold text-gray-900'>
                {customer.name}
              </h1>
              <div className='flex items-center gap-3'>
                <Badge status={customer.status} />
                <span className='px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium capitalize border border-gray-200'>
                  {customer.type.toLowerCase()}
                </span>
                <span className='text-sm text-gray-400'>ID: {customer.id}</span>
              </div>
            </div>
            <div className='w-16 h-16 bg-brand-light text-brand-dark rounded-2xl flex items-center justify-center font-bold text-2xl shadow-sm border border-brand-DEFAULT/20'>
              {customer.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMutation.mutate(formData);
              }}
              className='flex flex-col gap-6 mt-4 border-t border-gray-100 pt-8'
            >
              {formError && (
                <div className='p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium'>
                  {formError}
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Input
                  label='Company/Individual Name *'
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <Input
                  label='Tax ID'
                  value={formData.taxId}
                  onChange={(e) =>
                    setFormData({ ...formData, taxId: e.target.value })
                  }
                />
                <Input
                  label='Email *'
                  type='email'
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <Input
                  label='Phone *'
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <div className='md:col-span-2'>
                  <Input
                    label='Address *'
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                <div className='flex flex-col gap-1.5 w-full'>
                  <label className='text-sm font-medium text-gray-700'>
                    Type *
                  </label>
                  <select
                    className='px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-DEFAULT'
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as CustomerType,
                      })
                    }
                  >
                    <option value='RETAIL'>Retail</option>
                    <option value='WHOLESALE'>Wholesale</option>
                    <option value='DISTRIBUTOR'>Distributor</option>
                  </select>
                </div>

                <div className='flex flex-col gap-1.5 w-full'>
                  <label className='text-sm font-medium text-gray-700'>
                    Status *
                  </label>
                  <select
                    className='px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-DEFAULT'
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as CustomerStatus,
                      })
                    }
                  >
                    <option value='ACTIVE'>Active</option>
                    <option value='INACTIVE'>Inactive</option>
                    <option value='SUSPENDED'>Suspended</option>
                  </select>
                </div>
              </div>

              <div className='flex items-center justify-end gap-3 mt-4 pt-6 border-t border-gray-100'>
                <Button
                  variant='ghost'
                  onClick={() => {
                    setIsEditing(false);
                    setFormError("");
                  }}
                  type='button'
                  className='gap-2'
                >
                  <X className='w-4 h-4' /> Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={updateMutation.isPending}
                  className='gap-2'
                >
                  {updateMutation.isPending ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <Save className='w-4 h-4' />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-4 border-t border-gray-100 pt-8'>
              <div>
                <p className='text-sm font-medium text-gray-400 mb-1'>
                  Contact Email
                </p>
                <p className='text-gray-900 font-medium'>{customer.email}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-400 mb-1'>
                  Phone Number
                </p>
                <p className='text-gray-900 font-medium'>{customer.phone}</p>
              </div>
              <div className='md:col-span-2'>
                <p className='text-sm font-medium text-gray-400 mb-1'>
                  Billing/Shipping Address
                </p>
                <p className='text-gray-900 font-medium whitespace-pre-wrap'>
                  {customer.address}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-400 mb-1'>Tax ID</p>
                <p className='text-gray-900 font-medium'>
                  {customer.taxId || (
                    <span className='text-gray-400 italic'>Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-400 mb-1'>
                  Customer Since
                </p>
                <p className='text-gray-900 font-medium'>
                  {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
