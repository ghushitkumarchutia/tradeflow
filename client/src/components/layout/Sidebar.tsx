import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  Package,
  ArrowRightLeft,
  FileText,
  Settings,
  HelpCircle,
} from "lucide-react";
import type { Role } from "../../types";

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"],
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
    roles: ["ADMIN", "SALES"],
  },
  {
    name: "Products",
    path: "/products",
    icon: Package,
    roles: ["ADMIN", "WAREHOUSE", "SALES"],
  },
  {
    name: "Stock Movements",
    path: "/stock-movements",
    icon: ArrowRightLeft,
    roles: ["ADMIN", "WAREHOUSE"],
  },
  {
    name: "Challans",
    path: "/challans",
    icon: FileText,
    roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"],
  },
];

export function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className='w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0'>
      <div className='h-16 flex items-center px-6 border-b border-gray-100'>
        <div className='flex items-center gap-2 text-xl font-bold text-brand-dark'>
          <div className='w-8 h-8 bg-brand-DEFAULT rounded-lg flex items-center justify-center text-white'>
            T
          </div>
          TradeFlow
        </div>
      </div>

      <div className='flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1'>
        <div className='text-xs font-semibold text-gray-400 mb-2 px-2'>
          MENU
        </div>
        {navItems
          .filter((item) => item.roles.includes(user.role))
          .map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive
                    ? "bg-brand-DEFAULT text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon className='w-5 h-5' />
              {item.name}
            </NavLink>
          ))}

        <div className='mt-8 text-xs font-semibold text-gray-400 mb-2 px-2'>
          GENERAL
        </div>
        <button className='flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors'>
          <Settings className='w-5 h-5' />
          Settings
        </button>
        <button className='flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors'>
          <HelpCircle className='w-5 h-5' />
          Help
        </button>
      </div>
    </div>
  );
}
