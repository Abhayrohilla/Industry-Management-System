import { Route, Routes, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { IndustryListPage } from "./pages/IndustryListPage";
import { IndustryFormPage } from "./pages/IndustryFormPage";
import { IndustryDetailPage } from "./pages/IndustryDetailPage";
import { useAuth } from "./hooks/useAuth";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage initialMode="login" />} />
      <Route path="/signup" element={<AuthPage initialMode="signup" />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/industries"
        element={
          <PrivateRoute>
            <IndustryListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/industries/new"
        element={
          <PrivateRoute>
            <IndustryFormPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/industries/:id"
        element={
          <PrivateRoute>
            <IndustryDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/industries/:id/edit"
        element={
          <PrivateRoute>
            <IndustryFormPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

