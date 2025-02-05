import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
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

  const saveUserToFirestore = async (uid: string, userData: any) => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, userData);
  };

  const getUserFromFirestore = async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (role === 'teacher' && verificationCode !== '123456') {
          throw new Error('Invalid teacher verification code');
        }

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, {
            displayName: name,
          });

          // Save user data to Firestore
          const userData = {
            name,
            email,
            role,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };
          
          await saveUserToFirestore(userCredential.user.uid, userData);
          
          localStorage.setItem('userRole', role);
          localStorage.setItem('userName', name);
          localStorage.setItem('userEmail', email);
          
          toast({
            title: "Success!",
            description: "Account created successfully.",
          });
          
          navigate(role === 'teacher' ? '/teacher-dashboard' : '/dashboard');
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            toast({
              title: "Email Already Registered",
              description: "This email address is already registered. Please try logging in instead.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Get user data from Firestore
        const userData = await getUserFromFirestore(userCredential.user.uid);
        
        if (userData) {
          localStorage.setItem('userRole', userData.role);
          localStorage.setItem('userName', userData.name);
          localStorage.setItem('userEmail', userData.email);
          
          // Update last login
          await saveUserToFirestore(userCredential.user.uid, {
            ...userData,
            lastLogin: new Date().toISOString(),
          });
        }
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        
        // Navigate based on role from Firestore
        navigate(userData?.role === 'teacher' ? '/teacher-dashboard' : '/dashboard');
      }
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4">
      <h1 className="text-4xl font-bold text-white mb-2">Class Connect</h1>
      <p className="text-white/80 mb-8">Virtual Learning Platform</p>
      
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
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
                  className="w-full"
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

        <div className="text-center text-sm mt-4">
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
      </Card>
    </div>
  );
};

export default AuthForm;