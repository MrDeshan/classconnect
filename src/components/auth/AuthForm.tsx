import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
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
        navigate('/');
      }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md p-6 bg-gray-900/90 border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AuthForm;