import { useEffect } from "react";
import type { ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity'
        onClick={onClose}
      />

      <div className='relative bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]'>
        <div className='px-6 py-5 border-b border-gray-100 flex items-center justify-between'>
          <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path d='M6 18L18 6M6 6l12 12'></path>
            </svg>
          </button>
        </div>

        <div className='px-6 py-5 overflow-y-auto flex-1'>{children}</div>

        {footer && (
          <div className='px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
