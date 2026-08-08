import { useAuth } from "../hooks/useAuth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className='flex flex-col gap-8'>
      <div className='bg-brand-dark rounded-3xl p-8 text-white shadow-lg relative overflow-hidden'>
        <div className='relative z-10'>
          <h1 className='text-3xl font-bold mb-2'>
            Welcome back, {user?.name}!
          </h1>
          <p className='text-brand-light text-sm font-medium'>
            Role: <span className='uppercase'>{user?.role}</span>
          </p>
          <p className='text-white/80 mt-4 max-w-xl text-sm leading-relaxed'>
            Manage your customers, track inventory, and generate challans
            efficiently. Use the sidebar to navigate through your authorized
            modules.
          </p>
        </div>

        <div className='absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3'></div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-2'>
          <h3 className='text-gray-500 font-medium text-sm'>Quick Action</h3>
          <p className='text-xl font-bold text-gray-900'>Create New Challan</p>
          <div className='mt-4'>
            <button className='text-sm font-semibold text-brand-DEFAULT hover:text-brand-dark transition-colors'>
              Get Started &rarr;
            </button>
          </div>
        </div>

        <div className='bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-2'>
          <h3 className='text-gray-500 font-medium text-sm'>Quick Action</h3>
          <p className='text-xl font-bold text-gray-900'>View Inventory</p>
          <div className='mt-4'>
            <button className='text-sm font-semibold text-brand-DEFAULT hover:text-brand-dark transition-colors'>
              Check Stock &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
