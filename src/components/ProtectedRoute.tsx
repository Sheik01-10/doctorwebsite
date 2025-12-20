import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return null; // loader venumna add pannalam

  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
}
