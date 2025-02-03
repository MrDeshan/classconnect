import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Settings, UserPlus, Users } from "lucide-react";
import { Button } from "./ui/button";
import VideoControls from "./video-call/VideoControls";
import ChatPanel from "./video-call/ChatPanel";
import Quiz from "./Quiz";
import ParticipantsList from "./video-call/ParticipantsList";
import SettingsPanel from "./video-call/SettingsPanel";

const VideoCall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: string }[]>([]);
  const [participants] = useState([
    { id: 1, name: "John Smith", role: "Teacher", handRaised: false },
    { id: 2, name: "Alice Johnson", role: "Student", handRaised: false },
    { id: 3, name: "Bob Wilson", role: "Student", handRaised: false },
    { id: 4, name: "Emma Davis", role: "Student", handRaised: false },
  ]);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      const newMessage = {
        text: "Welcome to the class! Let's begin our lesson.",
        sender: "John Smith (Teacher)",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, newMessage]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: "You",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
      duration: 2000,
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording stopped" : "Recording started",
      description: isRecording ? "Your recording has been saved" : "Recording this session...",
      duration: 2000,
    });
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    toast({
      title: isHandRaised ? "Hand lowered" : "Hand raised",
      description: isHandRaised ? "" : "The teacher will be notified",
      duration: 2000,
    });
  };

  const handleEndCall = () => {
    toast({
      title: "Call ended",
      description: "You have left the class",
      duration: 2000,
    });
    setTimeout(() => window.location.href = "/", 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              Live Class
            </Badge>
            <h2 className="text-white text-xl">Advanced Mathematics</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-full ${isSettingsOpen ? 'bg-primary text-white' : ''}`}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {participants.map((participant) => (
            <Card key={participant.id} className="glass-card aspect-video relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-800/10 flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm flex items-center gap-2">
                {participant.name}
                {participant.role === "Teacher" && (
                  <Badge variant="secondary" className="text-xs">Teacher</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {isChatOpen && (
          <ChatPanel
            messages={messages}
            message={message}
            onMessageChange={setMessage}
            onSendMessage={handleSendMessage}
            onClose={() => setIsChatOpen(false)}
          />
        )}

        {isQuizOpen && <Quiz onClose={() => setIsQuizOpen(false)} />}

        {isParticipantsOpen && (
          <ParticipantsList
            participants={participants}
            onClose={() => setIsParticipantsOpen(false)}
          />
        )}

        {isSettingsOpen && (
          <SettingsPanel
            onClose={() => setIsSettingsOpen(false)}
          />
        )}

        <VideoControls
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          isScreenSharing={isScreenSharing}
          isChatOpen={isChatOpen}
          isQuizOpen={isQuizOpen}
          isRecording={isRecording}
          isHandRaised={isHandRaised}
          isParticipantsOpen={isParticipantsOpen}
          onToggleMute={() => setIsMuted(!isMuted)}
          onToggleVideo={() => setIsVideoOff(!isVideoOff)}
          onToggleScreenShare={toggleScreenShare}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onToggleQuiz={() => setIsQuizOpen(!isQuizOpen)}
          onToggleRecording={toggleRecording}
          onToggleHandRaise={toggleHandRaise}
          onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
};

export default VideoCall;