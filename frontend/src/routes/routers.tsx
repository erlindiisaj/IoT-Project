import type { JSX } from "react";
import { useRoutes, Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { AuthLayout } from "@layouts/auth";
import { DashboardLayout } from "@layouts/dashboard";
import { useAuthStore } from "src/store/authStore";

import { SignInPage } from "@pages/auth";
import { Dashboard } from "@pages/dashboard";

// Route guards
function PrivateRoute({ element }: { element: JSX.Element }) {
  const { isAuthenticated } = useAuthStore();
  console.log("isAuthenticated", isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/sign-in" replace />;
}

function PublicRoute({ element }: { element: JSX.Element }) {
  const { isAuthenticated } = useAuthStore();
  console.log("isAuthenticated", isAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : element;
}

export function Router() {
  return useRoutes([
    {
      element: (
        <PrivateRoute
          element={
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          }
        />
      ),
      children: [{ index: true, element: <Dashboard /> }],
    },

    // Public routes
    {
      path: "sign-in",
      element: (
        <PublicRoute
          element={
            <AuthLayout>
              <SignInPage />
            </AuthLayout>
          }
        />
      ),
    },
  ]);
}
