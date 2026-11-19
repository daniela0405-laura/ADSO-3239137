import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function ProtectedRoute({ roles, children }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(session.role)) {
    return <p role="alert">No tienes permiso para ver esta pantalla.</p>;
  }
  return children;
}
