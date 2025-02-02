import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, Mic, Share, MessageSquare, Users, X, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const VideoCall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "You" }]);
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <Card key={id} className="glass-card aspect-video relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-800/10 flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                Participant {id}
              </div>
            </Card>
          ))}
        </div>

        {/* Chat Sidebar */}
        {isChatOpen && (
          <Card className="glass-card fixed right-4 top-4 bottom-20 w-80 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Chat</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 mb-4">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold">{msg.sender}: </span>
                  <span>{msg.text}</span>
                </div>
              ))}
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Controls */}
        <Card className="glass-card p-4 fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
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
          <Button variant="destructive" className="rounded-full px-6">
            End Call
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default VideoCall;