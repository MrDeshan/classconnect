import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Settings, UserPlus, Users, BookOpen, Video, Shield } from "lucide-react";
import { Button } from "./ui/button";
import VideoControls from "./video-call/VideoControls";
import ChatPanel from "./video-call/ChatPanel";
import Quiz from "./Quiz";
import ParticipantsList from "./video-call/ParticipantsList";
import SettingsPanel from "./video-call/SettingsPanel";
import { useSearchParams } from 'react-router-dom';

interface Participant {
  id: number;
  name: string;
  role: string;
  handRaised: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
  stream?: MediaStream | null;
}

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
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { toast } = useToast();

  const [isTeacher] = useState(() => localStorage.getItem('userRole') === 'teacher');
  const [lockedParticipants, setLockedParticipants] = useState<number[]>([]);
  const [mutedParticipants, setMutedParticipants] = useState<number[]>([]);
  const [username] = useState(() => {
    return searchParams.get('name') || 'Anonymous User';
  });

  const teacherVideoRef = useRef<HTMLVideoElement>(null);
  const studentVideoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const mainPresenterRef = useRef<HTMLVideoElement>(null);
  const [activeSpeakerId, setActiveSpeakerId] = useState<number | null>(null);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const videoParam = searchParams.get('video');
        const audioParam = searchParams.get('audio');
        
        const noVideo = videoParam === 'false';
        const noAudio = audioParam === 'false';
        
        setIsVideoOff(noVideo);
        setIsMuted(noAudio);
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: !noVideo,
          audio: !noAudio
        });
        
        setMediaStream(stream);
        
        const initialParticipants: Participant[] = [];
        
        if (isTeacher) {
          initialParticipants.push({
            id: 1,
            name: `${username} (Teacher Host)`,
            role: "Teacher",
            handRaised: false,
            videoRef: teacherVideoRef,
            stream: stream
          });
          
          setActiveSpeakerId(1);
          
          if (teacherVideoRef.current) {
            teacherVideoRef.current.srcObject = stream;
          }
          
          if (mainPresenterRef.current) {
            mainPresenterRef.current.srcObject = stream;
          }
          
          for (let i = 0; i < 3; i++) {
            initialParticipants.push({
              id: i + 2,
              name: `Student ${i + 1}`,
              role: "Student",
              handRaised: false,
              videoRef: studentVideoRefs[i],
              stream: null
            });
          }
          
          setTimeout(async () => {
            try {
              const studentStream = await navigator.mediaDevices.getUserMedia({
                video: true, audio: true
              });
              
              if (studentVideoRefs[0].current) {
                studentVideoRefs[0].current.srcObject = studentStream;
              }
              
              setParticipants(prev => {
                return prev.map((p, index) => {
                  if (p.role === "Student" && index === 1) {
                    return { ...p, stream: studentStream };
                  }
                  return p;
                });
              });
              
              toast({
                title: "Student joined",
                description: "Student 1 has joined the class",
                duration: 2000,
              });
            } catch (error) {
              console.error("Error creating student stream:", error);
            }
          }, 1500);
        } else {
          initialParticipants.push({
            id: 1,
            name: "Teacher Host",
            role: "Teacher",
            handRaised: false,
            videoRef: teacherVideoRef,
            stream: null
          });
          
          setActiveSpeakerId(1);
          
          initialParticipants.push({
            id: 2,
            name: `${username} (You)`,
            role: "Student",
            handRaised: false,
            videoRef: localVideoRef,
            stream: stream
          });
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          
          for (let i = 0; i < 2; i++) {
            initialParticipants.push({
              id: i + 3,
              name: `Student ${i + 2}`,
              role: "Student",
              handRaised: false,
              videoRef: studentVideoRefs[i],
              stream: null
            });
          }
          
          setTimeout(async () => {
            try {
              const teacherStream = await navigator.mediaDevices.getUserMedia({
                video: {
                  width: { ideal: 1280 },
                  height: { ideal: 720 }
                },
                audio: true
              });
              
              if (teacherVideoRef.current) {
                teacherVideoRef.current.srcObject = teacherStream;
              }
              
              if (mainPresenterRef.current) {
                mainPresenterRef.current.srcObject = teacherStream;
              }
              
              setParticipants(prev => {
                return prev.map(p => {
                  if (p.role === "Teacher") {
                    return { ...p, stream: teacherStream };
                  }
                  return p;
                });
              });
              
              toast({
                title: "Teacher joined",
                description: "The teacher has joined the class",
                duration: 2000,
              });
            } catch (error) {
              console.error("Error creating teacher stream:", error);
            }
          }, 1000);
        }
        
        setParticipants(initialParticipants);
        
        toast({
          title: "Connected to class",
          description: `You've joined as ${isTeacher ? 'Teacher' : 'Student'}`,
          duration: 3000,
        });
        
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
        
        if (mainPresenterRef.current) {
          mainPresenterRef.current.srcObject = stream;
        }
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        setIsScreenSharing(true);
        
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          
          const activeParticipant = participants.find(p => p.id === activeSpeakerId);
          if (activeParticipant?.stream && mainPresenterRef.current) {
            mainPresenterRef.current.srcObject = activeParticipant.stream;
          }
          
          if (localVideoRef.current && mediaStream) {
            localVideoRef.current.srcObject = mediaStream;
          }
        };
      } else {
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
        }
        
        const activeParticipant = participants.find(p => p.id === activeSpeakerId);
        if (activeParticipant?.stream && mainPresenterRef.current) {
          mainPresenterRef.current.srcObject = activeParticipant.stream;
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
      const stream = mainPresenterRef.current?.srcObject as MediaStream;
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

  const handleLockParticipant = (participantId: number) => {
    if (!isTeacher) return;
    setLockedParticipants(prev => 
      prev.includes(participantId) 
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
    toast({
      title: lockedParticipants.includes(participantId) ? "Participant unlocked" : "Participant locked",
      duration: 2000,
    });
  };

  const handleMuteParticipant = (participantId: number) => {
    if (!isTeacher) return;
    setMutedParticipants(prev => 
      prev.includes(participantId) 
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
    toast({
      title: mutedParticipants.includes(participantId) ? "Participant unmuted" : "Participant muted",
      duration: 2000,
    });
  };

  const handleEndMeeting = () => {
    if (!isTeacher) {
      handleEndCall();
      return;
    }
    toast({
      title: "Meeting ended",
      description: "You have ended the meeting for all participants",
      duration: 2000,
    });
    setTimeout(() => window.location.href = "/", 2000);
  };

  const setMainPresenter = (participantId: number) => {
    const participant = participants.find(p => p.id === participantId);
    if (participant?.stream && mainPresenterRef.current) {
      mainPresenterRef.current.srcObject = participant.stream;
      setActiveSpeakerId(participantId);
      
      toast({
        title: "Main presenter changed",
        description: `${participant.name} is now the main presenter`,
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="max-w-[1800px] mx-auto p-4">
        <div className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-lg rounded-lg p-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              Live Class
            </Badge>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Advanced Mathematics</h2>
              <p className="text-gray-600">
                {isTeacher ? (
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Teacher Host Mode
                  </span>
                ) : (
                  "Student View"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isTeacher && (
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" className="rounded-full">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          <Card className="glass-card lg:col-span-2 xl:col-span-3 aspect-video relative overflow-hidden">
            <video
              ref={mainPresenterRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
              <Video className="w-4 h-4" />
              {isScreenSharing ? "Screen Share" : activeSpeakerId === 1 ? "Teacher Host" : `${participants.find(p => p.id === activeSpeakerId)?.name || "Active Speaker"}`}
            </div>
          </Card>

          <div className="space-y-4">
            <Card 
              className="glass-card aspect-video relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              onClick={() => setMainPresenter(1)}
            >
              <video 
                ref={teacherVideoRef}
                autoPlay 
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                {isTeacher ? "You (Teacher Host)" : "Teacher Host"}
                {activeSpeakerId === 1 && <Badge variant="secondary" className="ml-1 text-xs px-2 py-0">Active</Badge>}
              </div>
            </Card>
            
            {participants
              .filter(p => p.role === "Student")
              .map((participant, index) => (
                <Card 
                  key={participant.id}
                  className="glass-card aspect-video relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => setMainPresenter(participant.id)}
                >
                  {participant.id === 2 && !isTeacher ? (
                    <video 
                      ref={localVideoRef}
                      autoPlay 
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    index < studentVideoRefs.length ? (
                      <video 
                        ref={studentVideoRefs[index]}
                        autoPlay 
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-800/10 flex items-center justify-center">
                        <Users className="w-12 h-12 text-gray-400" />
                      </div>
                    )
                  )}
                  
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                    {!isTeacher && participant.id === 2 ? "You (Student)" : participant.name}
                    {activeSpeakerId === participant.id && <Badge variant="secondary" className="ml-1 text-xs px-2 py-0">Active</Badge>}
                  </div>
                </Card>
              ))
            }
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {(isTeacher || !isTeacher) && (
            <Card className="glass-card p-4 hover:bg-white/90 transition-colors cursor-pointer" onClick={() => setIsChatOpen(!isChatOpen)}>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Class Chat
              </h3>
              <p className="text-sm text-gray-600">Interact with your classmates in real-time</p>
            </Card>
          )}
          
          {isTeacher && (
            <Card className="glass-card p-4 hover:bg-white/90 transition-colors cursor-pointer" onClick={() => setIsQuizOpen(!isQuizOpen)}>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Create Quiz
              </h3>
              <p className="text-sm text-gray-600">Create and manage assessments</p>
            </Card>
          )}
          
          <Card className="glass-card p-4 hover:bg-white/90 transition-colors cursor-pointer" onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Participants
            </h3>
            <p className="text-sm text-gray-600">View all class participants</p>
          </Card>
          
          {isTeacher && (
            <Card className="glass-card p-4 hover:bg-white/90 transition-colors cursor-pointer" onClick={() => toggleRecording()}>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Recording
              </h3>
              <p className="text-sm text-gray-600">{isRecording ? 'Stop Recording' : 'Start Recording'}</p>
            </Card>
          )}
        </div>

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

        {isQuizOpen && isTeacher && <Quiz onClose={() => setIsQuizOpen(false)} />}

        {isParticipantsOpen && (
          <ParticipantsList
            participants={participants}
            onClose={() => setIsParticipantsOpen(false)}
            isTeacher={isTeacher}
            onLockParticipant={handleLockParticipant}
            onMuteParticipant={handleMuteParticipant}
            lockedParticipants={lockedParticipants}
            mutedParticipants={mutedParticipants}
          />
        )}

        {isSettingsOpen && isTeacher && (
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
          isTeacher={isTeacher}
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
          onEndCall={handleEndMeeting}
        />
      </div>
    </div>
  );
};

export default VideoCall;
