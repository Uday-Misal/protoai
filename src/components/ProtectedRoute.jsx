import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  // Temporary bypass: allow access without requiring auth
  return children;
}