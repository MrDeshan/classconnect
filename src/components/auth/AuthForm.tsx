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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AuthForm = ({ mode }: { mode: 'login' | 'signup' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateVerificationCode = () => {
    return 'Teacher1234'; // Fixed verification code as requested
  };

  const saveUserToFirestore = async (uid: string, userData: any) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, userData);
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      throw error;
    }
  };

  const getUserFromFirestore = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
      console.error("Error getting user from Firestore:", error);
      return null;
    }
  };

  const handleVerificationSubmit = async () => {
    if (verificationCode !== 'Teacher1234') {
      toast({
        title: "Invalid Code",
        description: "Please enter the correct teacher verification code.",
        variant: "destructive",
      });
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found");
      }

      await saveUserToFirestore(user.uid, {
        name: localStorage.getItem('userName'),
        email: user.email,
        role: 'teacher',
        verified: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });

      localStorage.setItem('userRole', 'teacher');
      setShowVerificationDialog(false);
      navigate('/teacher-dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name,
        });

        // Save user data to Firestore
        const userData = {
          name,
          email,
          role,
          verified: role === 'student',
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
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userData = await getUserFromFirestore(userCredential.user.uid);
        
        if (!userData) {
          throw new Error("User data not found");
        }

        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);

        if (userData.role === 'teacher' && !userData.verified) {
          setShowVerificationDialog(true);
          return;
        }
        
        // Update last login
        await saveUserToFirestore(userCredential.user.uid, {
          ...userData,
          lastLogin: new Date().toISOString(),
        });

        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        
        navigate(userData.role === 'teacher' ? '/teacher-dashboard' : '/dashboard');
      }
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already registered. Please try logging in instead.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Please sign up first.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] p-4">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
        Class Connect
      </h1>
      <p className="text-[#2D3748] mt-2">
        {mode === 'login' ? 'Welcome back!' : 'Create your account to get started'}
      </p>
      
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-lg shadow-xl rounded-xl mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-[#D6BCFA] focus:ring-[#9b87f5]"
                required
              />
              <div className="space-y-3">
                <Label className="text-[#2D3748]">I am a:</Label>
                <RadioGroup defaultValue="student" onValueChange={setRole} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" className="border-[#9b87f5]" />
                    <Label htmlFor="student" className="text-[#2D3748]">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="teacher" className="border-[#9b87f5]" />
                    <Label htmlFor="teacher" className="text-[#2D3748]">Teacher</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-[#D6BCFA] focus:ring-[#9b87f5]"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-[#D6BCFA] focus:ring-[#9b87f5]"
            required
          />
          <Button
            type="submit"
            className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] transition-colors duration-300"
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'login' ? (
            <p className="text-[#2D3748]">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-[#9b87f5] hover:text-[#7E69AB] transition-colors duration-300"
              >
                Sign up
              </Link>
            </p>
          ) : (
            <p className="text-[#2D3748]">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-[#9b87f5] hover:text-[#7E69AB] transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </Card>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teacher Verification Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <Input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full border-[#D6BCFA] focus:ring-[#9b87f5]"
            />
            <Button 
              onClick={handleVerificationSubmit}
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
            >
              Verify
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthForm;
