import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Video, 
  Mic, 
  Share, 
  MessageSquare, 
  Users, 
  X, 
  Send, 
  PhoneOff, 
  Settings, 
  UserPlus,
  BookOpen 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import Quiz from "./Quiz";

const VideoCall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: string }[]>([]);
  const [participants, setParticipants] = useState([
    { id: 1, name: "John Smith", role: "Teacher" },
    { id: 2, name: "Alice Johnson", role: "Student" },
    { id: 3, name: "Bob Wilson", role: "Student" },
    { id: 4, name: "Emma Davis", role: "Student" },
  ]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate receiving a message
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

  const handleEndCall = () => {
    toast({
      title: "Call ended",
      description: "You have left the class",
      duration: 2000,
    });
    // Navigate back to home page after a brief delay
    setTimeout(() => window.location.href = "/", 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              Live Class
            </Badge>
            <h2 className="text-white text-xl">Advanced Mathematics</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Video Grid */}
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

        {/* Chat Sidebar */}
        {isChatOpen && (
          <Card className="glass-card fixed right-4 top-4 bottom-20 w-80 p-4 flex flex-col bg-gray-900/90 border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Class Chat</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 mb-4 pr-4">
              {messages.map((msg, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-primary">{msg.sender}</span>
                    <span className="text-xs text-gray-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-white/90 bg-gray-800/50 rounded-lg p-2">{msg.text}</p>
                </div>
              ))}
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button onClick={handleSendMessage} variant="secondary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Quiz Component */}
        {isQuizOpen && <Quiz onClose={() => setIsQuizOpen(false)} />}

        {/* Controls */}
        <Card className="glass-card p-4 fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/90 border-gray-700">
          <Button
            variant="outline"
            className={`rounded-full p-4 ${isMuted ? "bg-red-500 text-white" : ""}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            <Mic className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            className={`rounded-full p-4 ${isVideoOff ? "bg-red-500 text-white" : ""}`}
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            <Video className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            className={`rounded-full p-4 ${isScreenSharing ? "bg-green-500 text-white" : ""}`}
            onClick={toggleScreenShare}
          >
            <Share className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            className={`rounded-full p-4 ${isChatOpen ? "bg-primary text-white" : ""}`}
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <MessageSquare className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            className={`rounded-full p-4 ${isQuizOpen ? "bg-primary text-white" : ""}`}
            onClick={() => setIsQuizOpen(!isQuizOpen)}
          >
            <BookOpen className="w-6 h-6" />
          </Button>
          <Button 
            variant="destructive" 
            className="rounded-full px-6 flex items-center gap-2"
            onClick={handleEndCall}
          >
            <PhoneOff className="w-4 h-4" />
            End Call
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default VideoCall;