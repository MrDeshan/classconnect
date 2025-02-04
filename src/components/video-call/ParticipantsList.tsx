import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Hand, Lock, Mic, MicOff, LockOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Participant {
  id: number;
  name: string;
  role: string;
  handRaised: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
  onClose: () => void;
  isTeacher?: boolean;
  onLockParticipant?: (id: number) => void;
  onMuteParticipant?: (id: number) => void;
  lockedParticipants?: number[];
  mutedParticipants?: number[];
}

const ParticipantsList = ({ 
  participants, 
  onClose,
  isTeacher = false,
  onLockParticipant,
  onMuteParticipant,
  lockedParticipants = [],
  mutedParticipants = []
}: ParticipantsListProps) => {
  return (
    <Card className="glass-card fixed right-4 top-4 bottom-20 w-80 p-4 flex flex-col bg-gray-900/90 border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">Participants ({participants.length})</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded-lg mb-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-white">{participant.name}</span>
              {participant.role === "Teacher" && (
                <Badge variant="secondary" className="text-xs">Teacher</Badge>
              )}
              {participant.handRaised && (
                <Hand className="w-4 h-4 text-yellow-500" />
              )}
              {lockedParticipants.includes(participant.id) && (
                <Lock className="w-4 h-4 text-red-500" />
              )}
              {mutedParticipants.includes(participant.id) && (
                <MicOff className="w-4 h-4 text-red-500" />
              )}
            </div>
            {isTeacher && participant.role !== "Teacher" && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMuteParticipant?.(participant.id)}
                  className="h-8 w-8"
                >
                  {mutedParticipants.includes(participant.id) ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onLockParticipant?.(participant.id)}
                  className="h-8 w-8"
                >
                  {lockedParticipants.includes(participant.id) ? (
                    <LockOpen className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
};

export default ParticipantsList;