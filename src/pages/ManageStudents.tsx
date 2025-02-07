
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Users, UserPlus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import AddStudentForm from "@/components/students/AddStudentForm";
import EditStudentForm from "@/components/students/EditStudentForm";

interface Student {
  uid: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
}

const ManageStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "student")
      );
      const querySnapshot = await getDocs(q);
      const studentData: Student[] = [];
      querySnapshot.forEach((doc) => {
        studentData.push({ uid: doc.id, ...doc.data() } as Student);
      });
      setStudents(studentData);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (uid: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteDoc(doc(db, "users", uid));
        toast({
          title: "Success",
          description: "Student deleted successfully",
        });
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        toast({
          title: "Error",
          description: "Failed to delete student",
          variant: "destructive",
        });
      }
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Manage Students</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <AddStudentForm 
                  onSuccess={() => {
                    setIsAddDialogOpen(false);
                    fetchStudents();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.uid}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      student.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.verified ? 'Verified' : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={isEditDialogOpen && selectedStudent?.uid === student.uid} 
                             onOpenChange={(open) => {
                               setIsEditDialogOpen(open);
                               if (!open) setSelectedStudent(null);
                             }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Student</DialogTitle>
                          </DialogHeader>
                          <EditStudentForm
                            student={selectedStudent!}
                            onSuccess={() => {
                              setIsEditDialogOpen(false);
                              setSelectedStudent(null);
                              fetchStudents();
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.uid)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default ManageStudents;
