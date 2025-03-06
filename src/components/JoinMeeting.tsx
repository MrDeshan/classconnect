
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useSearchParams } from "react-router-dom";

const JoinMeeting = () => {
  const [searchParams] = useSearchParams();
  const [meetingId, setMeetingId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [username, setUsername] = useState("");
  const [rememberName, setRememberName] = useState(false);
  const [noAudio, setNoAudio] = useState(false);
  const [noVideo, setNoVideo] = useState(false);
  const navigate = useNavigate();

  // Check for invitation parameters in URL
  useEffect(() => {
    const id = searchParams.get("id");
    const pass = searchParams.get("passcode");
    
    if (id) setMeetingId(id);
    if (pass) setPasscode(pass);
    
    // Check if we have a remembered name
    const savedName = localStorage.getItem("username");
    if (savedName) {
      setUsername(savedName);
      setRememberName(true);
    }
  }, [searchParams]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingId && username) {
      // Save username if remember option is checked
      if (rememberName) {
        localStorage.setItem("username", username);
      } else {
        localStorage.removeItem("username");
      }
      
      // Navigate to class with all parameters
      navigate(`/class?id=${meetingId}&name=${username}&audio=${!noAudio}&video=${!noVideo}${passcode ? `&passcode=${passcode}` : ''}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-600 p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Class Connect</h1>
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Join meeting</h2>
        <form onSubmit={handleJoin} className="space-y-6">
          <div>
            <Input
              placeholder="Meeting ID or personal link name"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              required
            />
          </div>
          
          {/* Passcode input - show if not already provided in URL */}
          {!searchParams.get("passcode") && (
            <div>
              <Input
                placeholder="Passcode (if required)"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <Input
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberName}
                onCheckedChange={(checked) => setRememberName(checked as boolean)}
              />
              <label htmlFor="remember" className="text-sm">
                Remember my name for future meetings
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="noaudio"
                checked={noAudio}
                onCheckedChange={(checked) => setNoAudio(checked as boolean)}
              />
              <label htmlFor="noaudio" className="text-sm">
                Don't connect to audio
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="novideo"
                checked={noVideo}
                onCheckedChange={(checked) => setNoVideo(checked as boolean)}
              />
              <label htmlFor="novideo" className="text-sm">
                Turn off my video
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Join
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default JoinMeeting;
