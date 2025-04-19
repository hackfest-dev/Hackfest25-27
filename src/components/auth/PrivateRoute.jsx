import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import LoadingSpinner from '../common/LoadingSpinner';

const PrivateRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          // Check if requiredRole is an array or single role
          const hasRequiredRole = Array.isArray(requiredRole)
            ? requiredRole.includes(userRole)
            : userRole === requiredRole;
            
          if (hasRequiredRole) {
            setHasAccess(true);
          }
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!auth.currentUser) {
    return <Navigate to="/login" />;
  }

  if (!hasAccess) {
    return <Navigate to="/not-authorized" />;
  }

  return children;
};

export default PrivateRoute; 