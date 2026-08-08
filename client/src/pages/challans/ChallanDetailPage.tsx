import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChallan,
  confirmChallan,
  cancelChallan,
} from "../../api/challans.api";
import { useAuth } from "../../hooks/useAuth";
import { Badge } from "../../components/ui/Badge";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import type { ChallanItem } from "../../types";
import type { AxiosError } from "axios";
import { isAxiosError } from "axios";

export function ChallanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [cancelError, setCancelError] = useState("");

  const {
    data: challan,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["challan", id],
    queryFn: () => getChallan(id!),
    enabled: !!id,
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmChallan(id!),
    onSuccess: () => {
      setConfirmError("");
      queryClient.invalidateQueries({ queryKey: ["challan", id] });
      queryClient.invalidateQueries({ queryKey: ["challans"] });

      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      if (isAxiosError(err)) {
        setConfirmError(
          err.response?.data?.message || "Failed to confirm challan",
        );
      } else {
        setConfirmError("Failed to confirm challan");
      }
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelChallan(id!),
    onSuccess: () => {
      setCancelError("");
      setIsCancelModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["challan", id] });
      queryClient.invalidateQueries({ queryKey: ["challans"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      if (isAxiosError(err)) {
        setCancelError(
          err.response?.data?.message || "Failed to cancel challan",
        );
      } else {
        setCancelError("Failed to cancel challan");
      }
    },
  });

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='w-8 h-8 text-brand-DEFAULT animate-spin' />
      </div>
    );
  }

  if (error || !challan) {
    return (
      <div className='flex flex-col items-center justify-center h-64 gap-4'>
        <p className='text-gray-500 font-medium'>
          Challan not found or failed to load.
        </p>
        <Button variant='outline' onClick={() => navigate("/challans")}>
          Back to Challans
        </Button>
      </div>
    );
  }

  const canAction = user?.role === "ADMIN" || user?.role === "SALES";
  const isDraft = challan.status === "DRAFT";

  const itemColumns = [
    {
      key: "sku",
      header: "SKU",
      render: (item: ChallanItem) => (
        <span className='font-mono text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-700'>
          {item.skuSnapshot}
        </span>
      ),
    },
    {
      key: "product",
      header: "Product",
      render: (item: ChallanItem) => (
        <span className='font-semibold'>{item.productNameSnapshot}</span>
      ),
    },
    {
      key: "unitPrice",
      header: "Unit Price",
      render: (item: ChallanItem) => `$${item.unitPriceSnapshot.toFixed(2)}`,
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: ChallanItem) => (
        <span className='font-semibold text-gray-900'>{item.quantity}</span>
      ),
    },
    {
      key: "total",
      header: "Total Value",
      render: (item: ChallanItem) =>
        `$${(item.unitPriceSnapshot * item.quantity).toFixed(2)}`,
    },
  ];

  return (
    <div className='flex flex-col gap-6 max-w-5xl'>
      <div className='flex items-center justify-between'>
        <button
          onClick={() => navigate("/challans")}
          className='flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' /> Back to Challans
        </button>
      </div>

      {confirmError && (
        <div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3'>
          <AlertTriangle className='w-5 h-5 text-red-500 shrink-0' />
          <p className='font-medium text-sm'>{confirmError}</p>
        </div>
      )}

      <div className='bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col gap-8'>
        <div className='flex flex-col md:flex-row md:items-start justify-between gap-6'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <h1 className='text-3xl font-bold text-gray-900'>
                Challan{" "}
                <span className='text-brand-DEFAULT'>
                  #{challan.challanNumber}
                </span>
              </h1>
              <Badge status={challan.status} />
            </div>
            <p className='text-sm font-medium text-gray-500'>
              Created on {new Date(challan.createdAt).toLocaleString()} by{" "}
              {challan.createdBy.name}
            </p>
          </div>

          {canAction && isDraft && (
            <div className='flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100'>
              <Button
                variant='ghost'
                onClick={() => setIsCancelModalOpen(true)}
                className='text-red-600 hover:text-red-700 hover:bg-red-50 gap-2'
                disabled={cancelMutation.isPending || confirmMutation.isPending}
              >
                <XCircle className='w-4 h-4' /> Cancel Draft
              </Button>
              <Button
                onClick={() => confirmMutation.mutate()}
                disabled={confirmMutation.isPending || cancelMutation.isPending}
                className='gap-2 bg-green-600 hover:bg-green-700 focus:ring-green-500 shadow-sm'
              >
                {confirmMutation.isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <CheckCircle className='w-4 h-4' />
                )}
                Confirm Challan
              </Button>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>
              Customer Details
            </h3>
            <p className='font-semibold text-gray-900 text-lg'>
              {challan.customer.name}
            </p>
            <p className='text-gray-600 text-sm'>{challan.customer.email}</p>
            <p className='text-gray-600 text-sm'>{challan.customer.phone}</p>
          </div>
          <div className='flex flex-col gap-1'>
            <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>
              Delivery Address
            </h3>
            <p className='text-gray-600 text-sm whitespace-pre-wrap'>
              {challan.customer.address}
            </p>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <h3 className='text-lg font-bold text-gray-900'>Line Items</h3>
          <Table
            columns={itemColumns}
            data={challan.items}
            keyExtractor={(item) => item.id}
          />
          <div className='flex justify-end pt-4'>
            <div className='bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 flex items-center gap-8'>
              <div className='flex flex-col items-end'>
                <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                  Total Quantity
                </span>
                <span className='text-xl font-bold text-gray-900'>
                  {challan.totalQuantity} items
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => {
          if (!cancelMutation.isPending) {
            setIsCancelModalOpen(false);
            setCancelError("");
          }
        }}
        title='Cancel Challan'
      >
        <div className='flex flex-col gap-4'>
          <p className='text-gray-600'>
            Are you sure you want to cancel this draft challan? This action
            cannot be undone.
          </p>

          {cancelError && (
            <div className='p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium'>
              {cancelError}
            </div>
          )}

          <div className='mt-4 flex justify-end gap-3'>
            <Button
              variant='ghost'
              onClick={() => setIsCancelModalOpen(false)}
              disabled={cancelMutation.isPending}
            >
              No, keep it
            </Button>
            <Button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className='bg-red-600 hover:bg-red-700 focus:ring-red-500'
            >
              {cancelMutation.isPending
                ? "Cancelling..."
                : "Yes, cancel challan"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
