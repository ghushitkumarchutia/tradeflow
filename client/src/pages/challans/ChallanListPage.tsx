import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listChallans } from "../../api/challans.api";
import { listCustomers } from "../../api/customers.api";
import { useAuth } from "../../hooks/useAuth";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import type { Challan, ChallanStatus } from "../../types";
import { Plus, Loader2 } from "lucide-react";

export function ChallanListPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ChallanStatus | "ALL">(
    "ALL",
  );
  const [customerIdFilter, setCustomerIdFilter] = useState<string>("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: challansData, isLoading } = useQuery({
    queryKey: [
      "challans",
      {
        page,
        limit: 10,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        customerId: customerIdFilter || undefined,
      },
    ],
    queryFn: () =>
      listChallans({
        page,
        limit: 10,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        customerId: customerIdFilter || undefined,
      }),
  });

  const { data: customersData } = useQuery({
    queryKey: ["customers-for-dropdown"],
    queryFn: () => listCustomers({ page: 1, limit: 100 }),
  });

  const canCreate = user?.role === "ADMIN" || user?.role === "SALES";

  const columns = [
    {
      key: "challanNo",
      header: "Challan #",
      render: (c: Challan) => (
        <span className='font-mono font-bold text-brand-DEFAULT'>
          {c.challanNumber}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (c: Challan) => (
        <span className='font-semibold text-gray-900'>{c.customer.name}</span>
      ),
    },
    {
      key: "date",
      header: "Created Date",
      render: (c: Challan) => new Date(c.createdAt).toLocaleDateString(),
    },
    {
      key: "totalQuantity",
      header: "Total Qty",
      render: (c: Challan) => (
        <span className='font-medium text-gray-700'>{c.totalQuantity}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c: Challan) => <Badge status={c.status} />,
    },
  ];

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>Delivery Challans</h1>
        {canCreate && (
          <Link to='/challans/new'>
            <Button className='gap-2'>
              <Plus className='w-4 h-4' /> New Challan
            </Button>
          </Link>
        )}
      </div>

      <div className='bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6'>
        <div className='flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-6'>
          <div className='flex flex-col gap-1.5 w-full sm:w-64'>
            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Filter by Customer
            </label>
            <select
              className='px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light'
              value={customerIdFilter}
              onChange={(e) => {
                setCustomerIdFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value=''>All Customers</option>
              {customersData?.items.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-1.5 w-full sm:w-48'>
            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Filter by Status
            </label>
            <select
              className='px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light'
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ChallanStatus | "ALL");
                setPage(1);
              }}
            >
              <option value='ALL'>All Statuses</option>
              <option value='DRAFT'>Draft</option>
              <option value='CONFIRMED'>Confirmed</option>
              <option value='CANCELLED'>Cancelled</option>
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
              data={challansData?.items || []}
              keyExtractor={(item) => item.id}
              onRowClick={(item) => navigate(`/challans/${item.id}`)}
              emptyMessage='No challans found matching these filters.'
            />

            {challansData && challansData.total > 10 && (
              <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
                <span className='text-sm text-gray-500'>
                  Showing {(page - 1) * 10 + 1} to{" "}
                  {Math.min(page * 10, challansData.total)} of{" "}
                  {challansData.total}
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
                    disabled={page * 10 >= challansData.total}
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
    </div>
  );
}
