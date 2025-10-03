import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultModal({ isOpen, onClose }: ConsultModalProps) {
  const { toast } = useToast();

  const handleCallDoctor = () => {
    // Attempt tel: link or show demo toast
    toast({
      title: "Calling an available physician…",
      description: "(demo)",
    });
  };

  const handleVideoCall = () => {
    // Show fallback toast for video call
    toast({
      title: "Starting demo video call",
      description: "Integration not configured",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md max-w-[90vw] w-full mx-auto p-6 bg-background border border-border rounded-lg shadow-lg"
        onKeyDown={handleKeyDown}
      >

        <DialogHeader className="space-y-4 text-center">
          {/* Small header line */}
          <p className="text-sm text-muted-foreground">Immediate general advice</p>
          
          {/* Main heading */}
          <DialogTitle className="text-2xl font-bold text-primary">
            Consult an available physician now
          </DialogTitle>
          
          {/* Estimated wait time */}
          <p className="text-sm text-muted-foreground">
            Estimated wait: usually under 10 minutes
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Body content */}
          <DialogDescription className="text-base text-foreground leading-relaxed">
            A general physician is available now to give short medical advice. This is suitable for non-critical health questions and quick guidance. For emergencies or specialist care please book a specialist appointment.
          </DialogDescription>

          {/* Caution line */}
          <p className="text-sm text-red-600 text-center">
            This service is not for emergencies. Call emergency services if you need urgent help.
          </p>

          {/* Login note */}
          <p className="text-sm text-muted-foreground text-center">
            You may be asked to enter a phone number for follow-up.
          </p>

          {/* Action buttons */}
          <div className="flex justify-center w-full">
            <Button
              onClick={handleVideoCall}
              className="h-12 text-base font-medium px-8"
              aria-label="Video call doctor"
            >
              <Video className="mr-2 h-5 w-5" />
              Video call doctor
            </Button>
          </div>

          {/* Secondary link */}
          <div className="text-center">
            <Link
              to="/find-doctor"
              className="text-primary hover:underline text-sm font-medium"
              onClick={onClose}
            >
              Book a specialist appointment
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}