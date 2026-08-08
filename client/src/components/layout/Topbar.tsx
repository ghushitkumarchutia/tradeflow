import { useAuth } from "../../hooks/useAuth";
import { LogOut, Bell, Search } from "lucide-react";

export function Topbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className='h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30'>
      <div className='flex items-center gap-4 flex-1'>
        <div className='relative w-96 hidden md:block'>
          <Search className='w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
          <input
            type='text'
            placeholder='Search...'
            className='w-full bg-gray-50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light'
          />
        </div>
      </div>

      <div className='flex items-center gap-6'>
        <button className='text-gray-400 hover:text-gray-600 relative'>
          <Bell className='w-5 h-5' />
          <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white'></span>
        </button>

        <div className='flex items-center gap-3 border-l border-gray-100 pl-6'>
          <div className='flex flex-col items-end'>
            <span className='text-sm font-semibold text-gray-900'>
              {user.name}
            </span>
            <span className='text-xs font-medium text-gray-500 capitalize'>
              {user.role.toLowerCase()}
            </span>
          </div>
          <div className='w-10 h-10 bg-brand-light text-brand-dark rounded-full flex items-center justify-center font-bold'>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={logout}
            className='ml-2 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50'
            title='Logout'
          >
            <LogOut className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  );
}
