
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { saveUserToFirestore } from "@/lib/auth-utils";
import { useNavigate } from "react-router-dom";

interface TeacherVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeacherVerificationDialog = ({ open, onOpenChange }: TeacherVerificationDialogProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

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
      onOpenChange(false);
      navigate('/teacher-dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default TeacherVerificationDialog;
