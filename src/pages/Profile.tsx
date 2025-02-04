import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Book, Calendar, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Student';
  const email = localStorage.getItem('email') || 'student@example.com';

  const stats = [
    { icon: Book, label: "Classes Attended", value: "24" },
    { icon: Calendar, label: "Hours Learned", value: "48" },
    { icon: Award, label: "Quizzes Completed", value: "12" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <Card className="p-8 glass-card">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">{username}</h1>
              <p className="text-gray-600">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 text-center glass-card">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </Card>
              );
            })}
          </div>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/schedule")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/quizzes")}
            >
              <Book className="mr-2 h-4 w-4" />
              View Quizzes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;