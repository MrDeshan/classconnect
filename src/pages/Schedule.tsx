import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>
      
      <Card className="glass-card max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 gradient-text text-center">
          Class Schedule
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border bg-white/50"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Time Slots</h2>
            <div className="space-y-2">
              {["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"].map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {time} - Available
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Schedule;