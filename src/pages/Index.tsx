
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect from the empty path to the landing page
  return <Navigate to="/" replace />;
};

export default Index;
