import { Navigate, Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ModuleListPage } from './pages/ModuleListPage';
import { RegisterPage } from './pages/RegisterPage';

function PrivateLayout({ children }: { children: JSX.Element }): JSX.Element {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Nav />
      {children}
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<PrivateLayout><DashboardPage /></PrivateLayout>} />
      <Route path="/items" element={<PrivateLayout><ModuleListPage title="Items" endpoint="items" /></PrivateLayout>} />
      <Route path="/vendors" element={<PrivateLayout><ModuleListPage title="Vendors" endpoint="vendors" /></PrivateLayout>} />
      <Route path="/indents" element={<PrivateLayout><ModuleListPage title="Indents" endpoint="indents" /></PrivateLayout>} />
      <Route path="/mis" element={<PrivateLayout><ModuleListPage title="MI" endpoint="mis" /></PrivateLayout>} />
      <Route path="/rfqs" element={<PrivateLayout><ModuleListPage title="RFQ" endpoint="rfqs" /></PrivateLayout>} />
      <Route path="/admin/users" element={<PrivateLayout><AdminUsersPage /></PrivateLayout>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
