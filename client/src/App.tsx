import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CustomerListPage } from "./pages/customers/CustomerListPage";
import { CustomerDetailPage } from "./pages/customers/CustomerDetailPage";
import { ProductListPage } from "./pages/products/ProductListPage";
import { StockMovementsPage } from "./pages/products/StockMovementsPage";
import { ChallanListPage } from "./pages/challans/ChallanListPage";
import { ChallanCreatePage } from "./pages/challans/ChallanCreatePage";
import { ChallanDetailPage } from "./pages/challans/ChallanDetailPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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

                <Route path='/customers' element={<CustomerListPage />} />
                <Route path='/customers/:id' element={<CustomerDetailPage />} />

                <Route path='/products' element={<ProductListPage />} />
                <Route
                  path='/stock-movements'
                  element={<StockMovementsPage />}
                />

                <Route path='/challans' element={<ChallanListPage />} />
                <Route path='/challans/new' element={<ChallanCreatePage />} />
                <Route path='/challans/:id' element={<ChallanDetailPage />} />
              </Route>
            </Route>

            <Route path='*' element={<Navigate to='/dashboard' replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
