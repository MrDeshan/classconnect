import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data from Firestore
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        
        navigate(userData.role === 'teacher' ? '/teacher-dashboard' : '/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-[#2D3748] mt-2">Sign in to continue learning</p>
      </div>
      
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-lg shadow-xl rounded-xl">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-[#D6BCFA] focus:ring-[#9b87f5]"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-[#D6BCFA] focus:ring-[#9b87f5]"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] transition-colors duration-300"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#2D3748]">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-[#9b87f5] hover:text-[#7E69AB] transition-colors duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;