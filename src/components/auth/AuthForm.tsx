import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const AuthForm = ({ mode }: { mode: 'login' | 'signup' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (role === 'teacher' && verificationCode !== '123456') {
          throw new Error('Invalid teacher verification code');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name,
        });
        
        localStorage.setItem('userRole', role);
        
        toast({
          title: "Success!",
          description: "Account created successfully.",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        const userRole = localStorage.getItem('userRole') || 'student';
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
      }
      navigate('/join');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-2">Class Connect</h1>
      <p className="text-white/80 mb-8">Virtual Learning Platform</p>
      
      <Card className="w-full max-w-md p-8 glass-card">
        <div className="space-y-6">
          <Button 
            variant="default" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
            onClick={() => navigate('/join')}
          >
            Join a meeting
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or {mode === 'login' ? 'sign in' : 'sign up'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border-gray-200"
                  required
                />
                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <RadioGroup defaultValue="student" onValueChange={setRole}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="teacher" id="teacher" />
                      <Label htmlFor="teacher">Teacher</Label>
                    </div>
                  </RadioGroup>
                </div>
                {role === 'teacher' && (
                  <Input
                    type="text"
                    placeholder="Teacher Verification Code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full bg-white border-gray-200"
                    required
                  />
                )}
              </>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-gray-200"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-gray-200"
              required
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="text-center text-sm">
            {mode === 'login' ? (
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-semibold">
                  Sign up
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-semibold">
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