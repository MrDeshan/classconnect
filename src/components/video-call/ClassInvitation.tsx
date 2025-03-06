
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Link, Mail, QrCode, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ClassInvitationProps {
  onClose: () => void;
  classId?: string;
  passcode?: string;
}

const ClassInvitation = ({ onClose, classId: initialClassId, passcode: initialPasscode }: ClassInvitationProps) => {
  const [classId, setClassId] = useState(initialClassId || generateClassId());
  const [passcode, setPasscode] = useState(initialPasscode || generatePasscode());
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  // Generate invitation link
  const invitationLink = `${window.location.origin}/join?id=${classId}&passcode=${passcode}`;

  // Function to generate a random class ID
  function generateClassId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Function to generate a random passcode
  function generatePasscode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Function to regenerate class ID and passcode
  const handleRegenerate = () => {
    setClassId(generateClassId());
    setPasscode(generatePasscode());
    toast({
      title: "New credentials generated",
      description: "A new class ID and passcode have been created."
    });
  };

  // Function to copy invitation link
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The invitation has been copied to your clipboard."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to email invitation (placeholder)
  const sendInvitationEmail = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive"
      });
      return;
    }
    
    // This would be connected to a real email service in production
    console.log(`Sending invitation to ${email} with link: ${invitationLink}`);
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${email}.`
    });
    setEmail("");
  };

  // Function to share via the Web Share API (mobile)
  const shareInvitation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my virtual classroom',
          text: `Class ID: ${classId} | Passcode: ${passcode}`,
          url: invitationLink
        });
        toast({
          title: "Shared successfully",
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      copyToClipboard(invitationLink);
    }
  };

  return (
    <Card className="w-full max-w-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Class Invitation</h2>
      
      <Tabs defaultValue="link">
        <TabsList className="mb-4">
          <TabsTrigger value="link">Invitation Link</TabsTrigger>
          <TabsTrigger value="email">Email Invitation</TabsTrigger>
          <TabsTrigger value="creds">ID & Passcode</TabsTrigger>
        </TabsList>
        
        <TabsContent value="link" className="space-y-4">
          <div>
            <label className="text-sm font-medium">Invitation Link</label>
            <div className="flex mt-1">
              <Input 
                value={invitationLink} 
                readOnly 
                className="flex-grow" 
              />
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(invitationLink)}
                className="ml-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={shareInvitation}
              className="flex items-center gap-2"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
            
            <Button 
              variant="default" 
              onClick={handleRegenerate}
            >
              Generate New Link
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <div>
            <label className="text-sm font-medium">Recipient Email</label>
            <div className="flex mt-1">
              <Input 
                type="email" 
                placeholder="student@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow" 
              />
              <Button 
                variant="default" 
                onClick={sendInvitationEmail}
                className="ml-2"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            The recipient will receive an email with the class link and credentials.
          </p>
        </TabsContent>
        
        <TabsContent value="creds" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Class ID</label>
              <div className="flex mt-1">
                <Input value={classId} readOnly />
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(classId)}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Passcode</label>
              <div className="flex mt-1">
                <Input value={passcode} readOnly />
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(passcode)}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleRegenerate} 
            variant="outline" 
            className="w-full mt-2"
          >
            Generate New Credentials
          </Button>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
    </Card>
  );
};

export default ClassInvitation;
