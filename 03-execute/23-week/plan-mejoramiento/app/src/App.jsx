import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ItemsPage from './pages/ItemsPage.jsx';
import RentalFormPage from './pages/RentalFormPage.jsx';
import OverduePage from './pages/OverduePage.jsx';
import ReportPage from './pages/ReportPage.jsx';

const STAFF = ['admin', 'advisor'];

export default function App() {
  const { session, logout } = useAuth();

  return (
    <div className="layout">
      {session && (
        <nav className="topbar" aria-label="Menú principal">
          <strong>⛺ Camping Rental</strong>
          <Link to="/items">Catálogo</Link>
          <Link to="/rentals/new">Alquilar</Link>
          <Link to="/overdue">Vencidos</Link>
          {session.role === 'admin' && <Link to="/report">Más solicitados</Link>}
          <button type="button" onClick={logout}>Salir</button>
        </nav>
      )}
      <main className="content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/items" element={<ProtectedRoute roles={STAFF}><ItemsPage /></ProtectedRoute>} />
          <Route path="/rentals/new" element={<ProtectedRoute roles={STAFF}><RentalFormPage /></ProtectedRoute>} />
          <Route path="/overdue" element={<ProtectedRoute roles={STAFF}><OverduePage /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute roles={['admin']}><ReportPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={session ? '/items' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
}
