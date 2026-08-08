import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Placeholder = ({ title }: { title: string }) => (
  <div className='flex items-center justify-center h-full text-gray-400 font-medium'>
    {title} Module (Coming Soon)
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route
                  path='/'
                  element={<Navigate to='/dashboard' replace />}
                />
                <Route path='/dashboard' element={<DashboardPage />} />

                <Route
                  path='/customers'
                  element={<Placeholder title='Customers' />}
                />
                <Route
                  path='/customers/:id'
                  element={<Placeholder title='Customer Details' />}
                />

                <Route
                  path='/products'
                  element={<Placeholder title='Products' />}
                />
                <Route
                  path='/stock-movements'
                  element={<Placeholder title='Stock Movements' />}
                />

                <Route
                  path='/challans'
                  element={<Placeholder title='Challans' />}
                />
                <Route
                  path='/challans/new'
                  element={<Placeholder title='New Challan' />}
                />
                <Route
                  path='/challans/:id'
                  element={<Placeholder title='Challan Details' />}
                />
              </Route>
            </Route>

            <Route path='*' element={<Navigate to='/dashboard' replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
