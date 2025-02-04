import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Quizzes = () => {
  const navigate = useNavigate();
  const [quizzes] = useState([
    {
      id: 1,
      title: "Mathematics Quiz",
      subject: "Mathematics",
      duration: "30 mins",
      questions: 10,
      status: "available",
    },
    {
      id: 2,
      title: "Science Quiz",
      subject: "Science",
      duration: "45 mins",
      questions: 15,
      status: "completed",
    },
    {
      id: 3,
      title: "History Quiz",
      subject: "History",
      duration: "20 mins",
      questions: 8,
      status: "upcoming",
    },
  ]);

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

        <h1 className="text-3xl font-bold gradient-text mb-8">Quizzes & Assignments</h1>

        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="p-6 glass-card hover:bg-white/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold">{quiz.title}</h3>
                    <p className="text-gray-600">
                      {quiz.subject} • {quiz.duration} • {quiz.questions} questions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={
                    quiz.status === "available" ? "default" :
                    quiz.status === "completed" ? "secondary" : "outline"
                  }>
                    {quiz.status}
                  </Badge>
                  <Button 
                    variant="outline"
                    disabled={quiz.status !== "available"}
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                  >
                    {quiz.status === "completed" ? "View Results" : "Start Quiz"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;