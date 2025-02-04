import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Settings, UserPlus, Users, BookOpen, Video } from "lucide-react";
import { Button } from "./ui/button";
import VideoControls from "./video-call/VideoControls";
import ChatPanel from "./video-call/ChatPanel";
import Quiz from "./Quiz";
import ParticipantsList from "./video-call/ParticipantsList";
import SettingsPanel from "./video-call/SettingsPanel";
import { useSearchParams } from 'react-router-dom';

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const localVideoRef = useRef<HTMLVideoElement>(null);
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
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [participants] = useState([
    { id: 1, name: "John Smith", role: "Teacher", handRaised: false },
    { id: 2, name: "Alice Johnson", role: "Student", handRaised: false },
    { id: 3, name: "Bob Wilson", role: "Student", handRaised: false },
    { id: 4, name: "Emma Davis", role: "Student", handRaised: false },
  ]);
  const { toast } = useToast();

  // Initialize media devices on component mount
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: !isVideoOff,
          audio: !isMuted
        });
        setMediaStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast({
          title: "Error",
          description: "Could not access camera or microphone",
          variant: "destructive"
        });
      }
    };

    initializeMedia();

    // Cleanup function
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
        
        // Listen for when user stops screen sharing through browser controls
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (localVideoRef.current && mediaStream) {
            localVideoRef.current.srcObject = mediaStream;
          }
        };
      } else {
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
        }
        if (localVideoRef.current && mediaStream) {
          localVideoRef.current.srcObject = mediaStream;
        }
        setIsScreenSharing(false);
      }
      
      toast({
        title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error sharing screen:', error);
      toast({
        title: "Error",
        description: "Could not share screen",
        variant: "destructive"
      });
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      const stream = localVideoRef.current?.srcObject as MediaStream;
      if (!stream) return;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      setRecordedChunks([]);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = 'class-recording.webm';
        a.click();
        window.URL.revokeObjectURL(url);
        setRecordedChunks([]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }

    toast({
      title: isRecording ? "Recording stopped" : "Recording started",
      description: isRecording ? "Your recording has been saved" : "Recording this session...",
      duration: 2000,
    });
  };

  const toggleMute = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleEndCall = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    toast({
      title: "Call ended",
      description: "You have left the class",
      duration: 2000,
    });
    setTimeout(() => window.location.href = "/", 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="max-w-[1800px] mx-auto p-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-lg rounded-lg p-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              Live Class
            </Badge>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Advanced Mathematics</h2>
              <p className="text-gray-600">Prof. John Smith • Room 101</p>
            </div>
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          {/* Main Video Section */}
          <Card className="glass-card lg:col-span-2 xl:col-span-3 aspect-video relative overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
              <Video className="w-4 h-4" />
              You (Host)
            </div>
          </Card>

          {/* Participants Grid */}
          <div className="space-y-4">
            {participants.slice(1).map((participant) => (
              <Card key={participant.id} className="glass-card aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-800/10 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                  {participant.name}
                  {participant.role === "Teacher" && (
                    <Badge variant="secondary" className="text-xs">Teacher</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Interactive Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card p-4 hover:bg-white/90 transition-colors cursor-pointer" onClick={() => setIsChatOpen(!isChatOpen)}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Class Chat
            </h3>
            <p className="text-sm text-gray-600">Interact with your classmates in real-time</p>
          </Card>
          
          <Card className="glass-card p-4 hover:bg-white/90 transition-colors cursor-pointer" onClick={() => setIsQuizOpen(!isQuizOpen)}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Active Quiz
            </h3>
            <p className="text-sm text-gray-600">Participate in ongoing assessments</p>
          </Card>
          
          <Card className="glass-card p-4 hover:bg-white/90 transition-colors cursor-pointer" onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Participants
            </h3>
            <p className="text-sm text-gray-600">View all class participants</p>
          </Card>
          
          <Card className="glass-card p-4 hover:bg-white/90 transition-colors cursor-pointer" onClick={() => setIsHandRaised(!isHandRaised)}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Recording
            </h3>
            <p className="text-sm text-gray-600">{isRecording ? 'Stop Recording' : 'Start Recording'}</p>
          </Card>
        </div>

        {/* Panels */}
        {isChatOpen && (
          <ChatPanel
            messages={messages}
            message={message}
            onMessageChange={setMessage}
            onSendMessage={() => {
              if (message.trim()) {
                const newMessage = {
                  text: message,
                  sender: "You",
                  timestamp: new Date().toLocaleTimeString(),
                };
                setMessages((prev) => [...prev, newMessage]);
                setMessage("");
              }
            }}
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

        {/* Video Controls */}
        <VideoControls
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          isScreenSharing={isScreenSharing}
          isChatOpen={isChatOpen}
          isQuizOpen={isQuizOpen}
          isRecording={isRecording}
          isHandRaised={isHandRaised}
          isParticipantsOpen={isParticipantsOpen}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          onToggleScreenShare={toggleScreenShare}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onToggleQuiz={() => setIsQuizOpen(!isQuizOpen)}
          onToggleRecording={toggleRecording}
          onToggleHandRaise={() => {
            setIsHandRaised(!isHandRaised);
            toast({
              title: isHandRaised ? "Hand lowered" : "Hand raised",
              description: isHandRaised ? "" : "The teacher will be notified",
              duration: 2000,
            });
          }}
          onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
};

export default VideoCall;