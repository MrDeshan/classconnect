import { Button } from "@/components/ui/button";
import { Video, Users, BookOpen, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeatureCard from "@/components/features/FeatureCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();

  // State for meeting ID and passcode
  const [meetingId, setMeetingId] = useState("");
  const [passcode, setPasscode] = useState("");

  const features = [
    {
      icon: Video,
      title: "HD Video Classes",
      description: "Crystal clear video streaming with real-time interaction",
    },
    {
      icon: Users,
      title: "Interactive Sessions",
      description: "Engage with teachers and peers in real-time discussions",
    },
    {
      icon: BookOpen,
      title: "Integrated Quizzes",
      description: "Seamless integration with Moodle quiz system",
    },
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Flexible class scheduling and calendar management",
    }
  ];

  const handleJoinClass = () => {
    if (meetingId && passcode) {
      // Navigate to the class page with meeting ID and passcode
      navigate(`/class/${meetingId}/${passcode}`);
    } else {
      alert("Please enter both Meeting ID and Passcode.");
    }
  };

  return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow pt-16">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-5xl font-bold mb-6 gradient-text">
              Interactive Virtual Classroom Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience seamless online learning with high-quality video conferencing,
              real-time collaboration, and integrated quiz systems.
            </p>
          </section>

          {/* Meeting Join Section */}
          <section className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Join a Meeting</h2>
            <p className="text-lg text-gray-600 mb-6">
              Enter the Meeting ID and Passcode to join your class.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center mb-4">
              <input
                  type="text"
                  placeholder="Meeting ID"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  className="border border-gray-300 rounded p-2 mr-2 mb-2 sm:mb-0"
              />
              <input
                  type="password"
                  placeholder="Passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="border border-gray-300 rounded p-2 mr-2 mb-2 sm:mb-0"
              />
              <Button onClick={handleJoinClass} className="bg-primary text-white rounded px-6 py-2">
                Join
              </Button>
            </div>
          </section>

          {/* Features Section */}
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-4 text-center">Our Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                  <FeatureCard
                      key={index}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                  />
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
  );
};

export default Index;