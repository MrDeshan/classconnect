import { Button } from "@/components/ui/button";
import { 
  Video, 
  Mic, 
  Share, 
  MessageSquare, 
  PhoneOff,
  BookOpen,
  Hand,
  Users
} from "lucide-react";
import { Card } from "@/components/ui/card";

export interface VideoControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  isQuizOpen: boolean;
  isRecording: boolean;
  isHandRaised: boolean;
  isParticipantsOpen: boolean;
  isTeacher: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onToggleQuiz: () => void;
  onToggleRecording: () => void;
  onToggleHandRaise: () => void;
  onToggleParticipants: () => void;
  onEndCall: () => void;
}

const VideoControls = ({
  isMuted,
  isVideoOff,
  isScreenSharing,
  isChatOpen,
  isQuizOpen,
  isRecording,
  isHandRaised,
  isParticipantsOpen,
  isTeacher,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onToggleQuiz,
  onToggleRecording,
  onToggleHandRaise,
  onToggleParticipants,
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
      {isTeacher && (
        <Button
          variant="outline"
          className={`rounded-full p-4 ${isRecording ? "bg-red-500 text-white animate-pulse" : ""}`}
          onClick={onToggleRecording}
        >
          <Video className="w-6 h-6" />
        </Button>
      )}
      {!isTeacher && (
        <Button
          variant="outline"
          className={`rounded-full p-4 ${isHandRaised ? "bg-yellow-500 text-white" : ""}`}
          onClick={onToggleHandRaise}
        >
          <Hand className="w-6 h-6" />
        </Button>
      )}
      <Button
        variant="outline"
        className={`rounded-full p-4 ${isChatOpen ? "bg-primary text-white" : ""}`}
        onClick={onToggleChat}
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
      {isTeacher && (
        <Button
          variant="outline"
          className={`rounded-full p-4 ${isQuizOpen ? "bg-primary text-white" : ""}`}
          onClick={onToggleQuiz}
        >
          <BookOpen className="w-6 h-6" />
        </Button>
      )}
      <Button
        variant="outline"
        className={`rounded-full p-4 ${isParticipantsOpen ? "bg-primary text-white" : ""}`}
        onClick={onToggleParticipants}
      >
        <Users className="w-6 h-6" />
      </Button>
      <Button 
        variant="destructive" 
        className="rounded-full px-6 flex items-center gap-2"
        onClick={onEndCall}
      >
        <PhoneOff className="w-4 h-4" />
        {isTeacher ? 'End Meeting' : 'Leave'}
      </Button>
    </Card>
  );
};

export default VideoControls;