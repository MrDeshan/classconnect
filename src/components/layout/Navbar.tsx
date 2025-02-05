import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Calendar, User, LogIn } from "lucide-react";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem('username');

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
            <Link to="/quizzes" className="flex items-center text-gray-600 hover:text-primary">
              <BookOpen className="h-5 w-5" />
              <span className="ml-2">Quizzes</span>
            </Link>
            <Link to="/schedule" className="flex items-center text-gray-600 hover:text-primary">
              <Calendar className="h-5 w-5" />
              <span className="ml-2">Schedule</span>
            </Link>
            {isLoggedIn ? (
              <Link to="/profile">
                <Button variant="ghost" className="flex items-center">
                  <User className="h-5 w-5" />
                  <span className="ml-2">Profile</span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="default" className="flex items-center">
                  <LogIn className="h-5 w-5" />
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