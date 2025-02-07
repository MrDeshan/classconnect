import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Users, BookOpen, Calendar, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeatureCard from "@/components/features/FeatureCard";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Teacher';

  const features = [
    {
      icon: Video,
      title: "Create Class",
      description: "Start a new video class session",
      onClick: () => navigate("/class"),
    },
    {
      icon: Users,
      title: "Manage Students",
      description: "View and manage your students",
      onClick: () => navigate("/students"),
    },
    {
      icon: BookOpen,
      title: "Create Quiz",
      description: "Create and manage quizzes",
      onClick: () => navigate("/quizzes"),
    },
    {
      icon: Calendar,
      title: "Schedule Classes",
      description: "Manage your class schedule",
      onClick: () => navigate("/schedule"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Welcome, {userName}!</h1>
            <p className="text-gray-600">Teacher Dashboard</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate("/profile")}
          >
            <Settings className="w-4 h-4" />
            Settings
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
              onClick={() => navigate("/class")}
            >
              Start New Class
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
              Create Quiz
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
