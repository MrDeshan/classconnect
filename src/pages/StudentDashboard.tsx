import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, MessageSquare, BookOpen, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import FeatureCard from "@/components/features/FeatureCard";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.data());
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const features = [
    {
      icon: Video,
      title: "HD Video Classes",
      description: "Crystal clear video streaming with real-time interaction",
      onClick: () => navigate("/join"),
    },
    {
      icon: MessageSquare,
      title: "Chat with Teacher",
      description: "Direct communication with your instructors",
      onClick: () => navigate("/chat"),
    },
    {
      icon: BookOpen,
      title: "Quizzes & Assignments",
      description: "Access and complete your assessments",
      onClick: () => navigate("/quizzes"),
    },
    {
      icon: Calendar,
      title: "Class Schedule",
      description: "View and manage your class timings",
      onClick: () => navigate("/schedule"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              Welcome, {userData?.name || 'Student'}!
            </h1>
            <p className="text-gray-600">Your Learning Dashboard</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate("/profile")}
          >
            <User className="w-4 h-4" />
            Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onClick={feature.onClick}
            />
          ))}
        </div>

        <Card className="mt-8 p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/join")}
            >
              Join Next Class
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/schedule")}
            >
              View Schedule
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/quizzes")}
            >
              Take Quiz
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;