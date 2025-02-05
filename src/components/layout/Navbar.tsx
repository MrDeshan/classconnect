import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Calendar, User, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Home className="h-6 w-6 text-primary" />
              <span className="ml-2 text-xl font-bold gradient-text">ClassConnect</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {userName ? (
              <>
                <Link to="/quizzes" className="flex items-center text-gray-600 hover:text-primary">
                  <BookOpen className="h-5 w-5" />
                  <span className="ml-2">Quizzes</span>
                </Link>
                <Link to="/schedule" className="flex items-center text-gray-600 hover:text-primary">
                  <Calendar className="h-5 w-5" />
                  <span className="ml-2">Schedule</span>
                </Link>
                <Link to={userRole === 'teacher' ? '/teacher-dashboard' : '/dashboard'}>
                  <Button variant="ghost" className="flex items-center">
                    <User className="h-5 w-5" />
                    <span className="ml-2">{userName}</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2">Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="default" className="flex items-center">
                  <User className="h-5 w-5" />
                  <span className="ml-2">Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;