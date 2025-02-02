import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send } from "lucide-react";

interface Message {
  text: string;
  sender: string;
  timestamp: string;
}

interface ChatPanelProps {
  messages: Message[];
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onClose: () => void;
}

const ChatPanel = ({
  messages,
  message,
  onMessageChange,
  onSendMessage,
  onClose,
}: ChatPanelProps) => {
  return (
    <Card className="glass-card fixed right-4 top-4 bottom-20 w-80 p-4 flex flex-col bg-gray-900/90 border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">Class Chat</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
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
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Button onClick={onSendMessage} variant="secondary">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ChatPanel;