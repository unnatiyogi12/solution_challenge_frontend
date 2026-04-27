const ProtectedRoute = ({ children }) => {
  // Guest-friendly mode: allow direct access without login
  return children;
};

export default ProtectedRoute;
