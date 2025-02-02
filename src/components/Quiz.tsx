import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Check, X } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const mockQuiz: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
];

const Quiz = ({ onClose }: { onClose: () => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const form = useForm();
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    const answer = parseInt(data[`question-${currentQuestion}`]);
    if (answer === mockQuiz[currentQuestion].correctAnswer) {
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

  return (
    <Card className="glass-card fixed right-4 top-4 bottom-20 w-96 p-4 flex flex-col bg-gray-900/90 border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">Class Quiz</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
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

              <FormField
                control={form.control}
                name={`question-${currentQuestion}`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        {mockQuiz[currentQuestion].options.map((option, index) => (
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
                    </FormControl>
                  </FormItem>
                )}
              />

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