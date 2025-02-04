import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from "firebase/auth";

const AuthForm = ({ mode }: { mode: 'login' | 'signup' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getErrorMessage = (error: AuthError) => {
    switch (error.code) {
      case 'auth/configuration-not-found':
        return "Authentication is not properly configured. Please ensure Firebase Authentication is enabled.";
      case 'auth/invalid-email':
        return "Invalid email address format.";
      case 'auth/user-disabled':
        return "This account has been disabled.";
      case 'auth/user-not-found':
        return "No account found with this email.";
      case 'auth/wrong-password':
        return "Incorrect password.";
      case 'auth/email-already-in-use':
        return "An account already exists with this email.";
      case 'auth/weak-password':
        return "Password should be at least 6 characters.";
      case 'auth/invalid-credential':
        return mode === 'login'
          ? "Invalid email or password. Please try again or sign up if you don't have an account."
          : "Invalid credentials. Please try again.";
      default:
        return error.message;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Success!",
          description: "Account created successfully.",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
      }
      navigate('/join');
    } catch (error: any) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-600 p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Class Connect</h1>
      <Card className="w-full max-w-md p-8 bg-white">
        <div className="space-y-6">
          <Button 
            variant="default" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/join')}
          >
            Join a meeting
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or {mode === 'login' ? 'sign in' : 'sign up'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="text-center text-sm">
            {mode === 'login' ? (
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;