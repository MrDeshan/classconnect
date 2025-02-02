import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Mic, Share, MessageSquare, Users } from "lucide-react";
import { useState } from "react";

const VideoCall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

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
          <Button variant="outline" className="rounded-full p-4">
            <Share className="w-6 h-6" />
          </Button>
          <Button variant="outline" className="rounded-full p-4">
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