import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Timer, Award } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface QuizQuestion {
  id: number;
  question: string;
  type: "multiple-choice" | "text" | "true-false";
  options?: string[];
  correctAnswer: string | number;
}

const mockQuiz: QuizQuestion[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    id: 2,
    type: "true-false",
    question: "The Earth is flat.",
    options: ["True", "False"],
    correctAnswer: 1,
  },
  {
    id: 3,
    type: "text",
    question: "What is the chemical symbol for water?",
    correctAnswer: "H2O",
  },
];

const QUIZ_TIME_LIMIT = 300; // 5 minutes in seconds

const Quiz = ({ onClose }: { onClose: () => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT);
  const form = useForm();
  const { toast } = useToast();

  useEffect(() => {
    if (!showResults && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowResults(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, showResults]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (data: any) => {
    const currentQ = mockQuiz[currentQuestion];
    let isCorrect = false;

    if (currentQ.type === "text") {
      isCorrect = data[`question-${currentQuestion}`].toLowerCase() === currentQ.correctAnswer.toString().toLowerCase();
    } else {
      isCorrect = parseInt(data[`question-${currentQuestion}`]) === currentQ.correctAnswer;
    }

    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Well done!",
        duration: 2000,
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Try again next time!",
        variant: "destructive",
        duration: 2000,
      });
    }

    if (currentQuestion < mockQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      form.reset();
    } else {
      setShowResults(true);
    }
  };

  const renderQuestion = () => {
    const question = mockQuiz[currentQuestion];

    return (
      <FormField
        control={form.control}
        name={`question-${currentQuestion}`}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              {question.type === "text" ? (
                <Input
                  {...field}
                  placeholder="Type your answer..."
                  className="bg-gray-800 border-gray-700 text-white"
                />
              ) : (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-2"
                >
                  {question.options?.map((option, index) => (
                    <FormItem
                      key={index}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={index.toString()} />
                      </FormControl>
                      <FormLabel className="text-white font-normal">
                        {option}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              )}
            </FormControl>
          </FormItem>
        )}
      />
    );
  };

  return (
    <Card className="glass-card fixed right-4 top-4 bottom-20 w-96 p-4 flex flex-col bg-gray-900/90 border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">Class Quiz</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-white">
            <Timer className="w-4 h-4 mr-1" />
            {formatTime(timeLeft)}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Award className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 pr-4">
        {!showResults ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="mb-4">
                <h4 className="text-white mb-2">
                  Question {currentQuestion + 1} of {mockQuiz.length}
                </h4>
                <p className="text-white/90">{mockQuiz[currentQuestion].question}</p>
              </div>

              {renderQuestion()}

              <Button type="submit" className="w-full">
                Submit Answer
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center">
            <h4 className="text-white text-xl mb-4">Quiz Complete!</h4>
            <p className="text-white/90 mb-4">
              Your score: {score} out of {mockQuiz.length}
            </p>
            <Button
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setShowResults(false);
                setTimeLeft(QUIZ_TIME_LIMIT);
                form.reset();
              }}
            >
              Retry Quiz
            </Button>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default Quiz;