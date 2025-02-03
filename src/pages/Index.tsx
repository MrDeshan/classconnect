import { Button } from "@/components/ui/button";
import { Video, Users, BookOpen, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeatureCard from "@/components/features/FeatureCard";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Video,
      title: "HD Video Classes",
      description: "Crystal clear video streaming with real-time interaction",
      onClick: () => navigate("/class")
    },
    {
      icon: Users,
      title: "Interactive Sessions",
      description: "Engage with teachers and peers in real-time discussions",
      onClick: () => navigate("/class")
    },
    {
      icon: BookOpen,
      title: "Integrated Quizzes",
      description: "Seamless integration with Moodle quiz system",
      onClick: () => navigate("/class")
    },
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Flexible class scheduling and calendar management",
      onClick: () => navigate("/schedule")
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 gradient-text">
          Interactive Virtual Classroom Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience seamless online learning with high-quality video conferencing, 
          real-time collaboration, and integrated quiz systems
        </p>
        <Button 
          onClick={() => navigate("/class")}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full hover-scale"
        >
          Join Class Now <ArrowRight className="ml-2" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      </section>
    </div>
  );
};

export default Index;