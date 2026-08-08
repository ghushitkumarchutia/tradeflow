import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCustomers, createCustomer } from "../../api/customers.api";
import { useAuth } from "../../hooks/useAuth";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import type { Customer, CustomerType, CustomerStatus } from "../../types";
import { Search, Plus, Loader2 } from "lucide-react";
import type { AxiosError } from "axios";

export function CustomerListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["customers", { page, limit: 10, search: debouncedSearch }],
    queryFn: () => listCustomers({ page, limit: 10, search: debouncedSearch }),
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

  const [formError, setFormError] = useState("");

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        taxId: "",
        type: "RETAIL",
        status: "ACTIVE",
      });
      setFormError("");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setFormError(
        error.response?.data?.message || "Failed to create customer",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    createMutation.mutate(formData);
  };

  const columns = [
    { key: "name", header: "Name" },
    {
      key: "type",
      header: "Type",
      render: (c: Customer) => (
        <span className='capitalize'>{c.type.toLowerCase()}</span>
      ),
    },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email" },
    {
      key: "status",
      header: "Status",
      render: (c: Customer) => <Badge status={c.status} />,
    },
  ];

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>Customers</h1>
        {(user?.role === "ADMIN" || user?.role === "SALES") && (
          <Button onClick={() => setIsModalOpen(true)} className='gap-2'>
            <Plus className='w-4 h-4' /> Add Customer
          </Button>
        )}
      </div>

      <div className='bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6'>
        <div className='flex items-center gap-4 max-w-md'>
          <div className='relative flex-1'>
            <Search className='w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Search customers...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-11'
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
              onRowClick={(item) => navigate(`/customers/${item.id}`)}
              emptyMessage='No customers found.'
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
        onClose={() => {
          setIsModalOpen(false);
          setFormError("");
        }}
        title='Add New Customer'
      >
        <form
          id='create-customer-form'
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          {formError && (
            <div className='p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium'>
              {formError}
            </div>
          )}
          <Input
            label='Company/Individual Name *'
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className='grid grid-cols-2 gap-4'>
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
          </div>
          <Input
            label='Address *'
            required
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
          <Input
            label='Tax ID'
            value={formData.taxId}
            onChange={(e) =>
              setFormData({ ...formData, taxId: e.target.value })
            }
          />
          <div className='grid grid-cols-2 gap-4'>
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
            form='create-customer-form'
            type='submit'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Customer"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
