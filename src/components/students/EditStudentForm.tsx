
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Student {
  uid: string;
  name: string;
  email: string;
  verified: boolean;
}

interface EditStudentFormProps {
  student: Student;
  onSuccess: () => void;
}

const EditStudentForm = ({ student, onSuccess }: EditStudentFormProps) => {
  const [name, setName] = useState(student.name);
  const [verified, setVerified] = useState(student.verified);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRef = doc(db, "users", student.uid);
      await updateDoc(userRef, {
        name,
        verified,
      });
      
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="email"
          value={student.email}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="verified"
          checked={verified}
          onCheckedChange={setVerified}
        />
        <Label htmlFor="verified">Verified Student</Label>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Student"}
      </Button>
    </form>
  );
};

export default EditStudentForm;
