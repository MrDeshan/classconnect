import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        
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
          Join Class Connect
        </h1>
        <p className="text-[#2D3748] mt-2">Create your account to get started</p>
      </div>
      
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-lg shadow-xl rounded-xl">
        <form onSubmit={handleSignup} className="space-y-6">
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

          {role === 'teacher' && (
            <Input
              type="text"
              placeholder="Teacher Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full border-[#D6BCFA] focus:ring-[#9b87f5]"
              required
            />
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#2D3748]">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-[#9b87f5] hover:text-[#7E69AB] transition-colors duration-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Signup;