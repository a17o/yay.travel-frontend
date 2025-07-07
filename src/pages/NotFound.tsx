import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center p-8 space-y-8 bg-white/90 backdrop-blur-xl rounded-lg shadow-2xl">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Oops! Page not found</h2>
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Button
          className="glassmorphic-btn bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-blue-700"
          onClick={() => window.location.href = '/'}
          aria-label="Return to home page"
        >
          <Home className="w-4 h-4 mr-2" aria-hidden="true" />
          Return to Home
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
