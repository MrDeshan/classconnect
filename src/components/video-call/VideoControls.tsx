import { Button } from "@/components/ui/button";
import { 
  Video, 
  Mic, 
  Share, 
  MessageSquare, 
  PhoneOff,
  BookOpen 
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface VideoControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  isQuizOpen: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onToggleQuiz: () => void;
  onEndCall: () => void;
}

const VideoControls = ({
  isMuted,
  isVideoOff,
  isScreenSharing,
  isChatOpen,
  isQuizOpen,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onToggleQuiz,
  onEndCall,
}: VideoControlsProps) => {
  return (
    <Card className="glass-card p-4 fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/90 border-gray-700">
      <Button
        variant="outline"
        className={`rounded-full p-4 ${isMuted ? "bg-red-500 text-white" : ""}`}
        onClick={onToggleMute}
      >
        <Mic className="w-6 h-6" />
      </Button>
      <Button
        variant="outline"
        className={`rounded-full p-4 ${isVideoOff ? "bg-red-500 text-white" : ""}`}
        onClick={onToggleVideo}
      >
        <Video className="w-6 h-6" />
      </Button>
      <Button
        variant="outline"
        className={`rounded-full p-4 ${isScreenSharing ? "bg-green-500 text-white" : ""}`}
        onClick={onToggleScreenShare}
      >
        <Share className="w-6 h-6" />
      </Button>
      <Button
        variant="outline"
        className={`rounded-full p-4 ${isChatOpen ? "bg-primary text-white" : ""}`}
        onClick={onToggleChat}
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
      <Button
        variant="outline"
        className={`rounded-full p-4 ${isQuizOpen ? "bg-primary text-white" : ""}`}
        onClick={onToggleQuiz}
      >
        <BookOpen className="w-6 h-6" />
      </Button>
      <Button 
        variant="destructive" 
        className="rounded-full px-6 flex items-center gap-2"
        onClick={onEndCall}
      >
        <PhoneOff className="w-4 h-4" />
        End Call
      </Button>
    </Card>
  );
};

export default VideoControls;