
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Video,
    Mic,
    Share,
    MessageSquare,
    PhoneOff,
    BookOpen,
    Hand,
    Users,
    Link as LinkIcon,
    Settings
} from "lucide-react";
import { Card } from "@/components/ui/card";
import ClassInvitation from "./ClassInvitation";

// Basic Modal Component
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <button onClick={onClose} className="float-right">Close</button>
                <div>{children}</div>
            </div>
        </div>
    );
};

// Student Join Component
const StudentJoin = ({ onJoin }) => {
    const [classId, setClassId] = useState("");
    const [passcode, setPasscode] = useState("");

    const handleJoin = () => {
        if (classId && passcode) {
            onJoin({ classId, passcode });
        } else {
            alert("Please enter both Class ID and Passcode.");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">Join Meeting</h2>
            <input
                type="text"
                placeholder="Class ID"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
                type="password"
                placeholder="Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <Button onClick={handleJoin}>Join</Button>
        </div>
    );
};

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
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [joinOpen, setJoinOpen] = useState(false);
    const [muteUponEntry, setMuteUponEntry] = useState(false);
    const [allowSelfUnmute, setAllowSelfUnmute] = useState(true);
    const [enableWaitingRoom, setEnableWaitingRoom] = useState(false);

    const handleApplySettings = () => {
        console.log({ muteUponEntry, allowSelfUnmute, enableWaitingRoom });
        setSettingsOpen(false);
    };

    const handleStudentJoin = ({ classId, passcode }) => {
        // Logic for joining the meeting
        console.log(`Joining meeting with Class ID: ${classId} and Passcode: ${passcode}`);
        setJoinOpen(false);
    };

    return (
        <>
            <Card className="glass-card p-4 fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/90 border-gray-700">
                <Button variant="outline" className={`rounded-full p-4 ${isMuted ? "bg-red-500 text-white" : ""}`} onClick={onToggleMute}>
                    <Mic className="w-6 h-6" />
                </Button>
                <Button variant="outline" className={`rounded-full p-4 ${isVideoOff ? "bg-red-500 text-white" : ""}`} onClick={onToggleVideo}>
                    <Video className="w-6 h-6" />
                </Button>
                <Button variant="outline" className={`rounded-full p-4 ${isScreenSharing ? "bg-green-500 text-white" : ""}`} onClick={onToggleScreenShare}>
                    <Share className="w-6 h-6" />
                </Button>
                {isTeacher && (
                    <Button variant="outline" className={`rounded-full p-4 ${isRecording ? "bg-red-500 text-white animate-pulse" : ""}`} onClick={onToggleRecording}>
                        <Video className="w-6 h-6" />
                    </Button>
                )}
                {!isTeacher && (
                    <Button variant="outline" className={`rounded-full p-4 ${isHandRaised ? "bg-yellow-500 text-white" : ""}`} onClick={onToggleHandRaise}>
                        <Hand className="w-6 h-6" />
                    </Button>
                )}
                <Button variant="outline" className={`rounded-full p-4 ${isChatOpen ? "bg-primary text-white" : ""}`} onClick={onToggleChat}>
                    <MessageSquare className="w-6 h-6" />
                </Button>
                {isTeacher && (
                    <>
                        <Button variant="outline" className={`rounded-full p-4 ${isQuizOpen ? "bg-primary text-white" : ""}`} onClick={onToggleQuiz}>
                            <BookOpen className="w-6 h-6" />
                        </Button>
                        <Button onClick={() => setInviteOpen(true)}><LinkIcon className="w-6 h-6" /> Invite</Button>
                        <Button onClick={() => setSettingsOpen(true)}><Settings className="w-6 h-6" /></Button>
                    </>
                )}
                {!isTeacher && (
                    <Button onClick={() => setJoinOpen(true)}>Join Class</Button>
                )}
                <Button variant="destructive" className="rounded-full px-6 flex items-center gap-2" onClick={onEndCall}>
                    <PhoneOff className="w-4 h-4" />
                    {isTeacher ? 'End Meeting' : 'Leave'}
                </Button>
            </Card>

            {/* Meeting Settings Modal */}
            <Modal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-bold">Meeting Settings</h2>
                    <label>
                        <input type="checkbox" checked={muteUponEntry} onChange={() => setMuteUponEntry(!muteUponEntry)} />
                        Mute participants upon entry
                    </label>
                    <label>
                        <input type="checkbox" checked={allowSelfUnmute} onChange={() => setAllowSelfUnmute(!allowSelfUnmute)} />
                        Allow participants to unmute themselves
                    </label>
                    <label>
                        <input type="checkbox" checked={enableWaitingRoom} onChange={() => setEnableWaitingRoom(!enableWaitingRoom)} />
                        Enable waiting room
                    </label>
                    <Button onClick={handleApplySettings}>Apply Settings</Button>
                </div>
            </Modal>

            {/* Invitation Modal - replaced with new component */}
            <Modal isOpen={inviteOpen} onClose={() => setInviteOpen(false)}>
                <ClassInvitation onClose={() => setInviteOpen(false)} />
            </Modal>

            {/* Student Join Modal */}
            <Modal isOpen={joinOpen} onClose={() => setJoinOpen(false)}>
                <StudentJoin onJoin={handleStudentJoin} />
            </Modal>
        </>
    );
};

export default VideoControls;
