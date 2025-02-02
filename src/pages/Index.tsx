import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Users, BookOpen, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 gradient-text">
          Interactive Online Learning Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience seamless virtual classrooms with integrated quizzes and real-time collaboration
        </p>
        <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full hover-scale">
          Start Learning Now
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Video className="w-8 h-8 text-primary" />}
            title="Live Classes"
            description="High-quality video streaming with real-time interaction"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-primary" />}
            title="Interactive Sessions"
            description="Engage with teachers and peers in real-time discussions"
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-primary" />}
            title="Integrated Quizzes"
            description="Seamless integration with Moodle quiz system"
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8 text-primary" />}
            title="Easy Scheduling"
            description="Flexible class scheduling and calendar management"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="glass-card p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 gradient-text">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students already learning on our platform
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-5 text-lg">
            Get Started
          </Button>
        </Card>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="glass-card p-6 hover-scale">
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </Card>
);

export default Index;