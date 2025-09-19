import { IOSButton } from "@/components/ui/ios-button";
import { Plus } from "lucide-react";

interface HeaderProps {
  onAddSubject: () => void;
}

export function Header({ onAddSubject }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container flex h-16 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Attendance</h1>
          <p className="text-sm text-gray-400">
            Last Updated on {new Date().toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long',
              year: 'numeric'
            })} at {new Date().toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <IOSButton variant="primary" size="sm" onClick={onAddSubject} className="gap-1 bg-green-500 hover:bg-green-600 text-white">
            <Plus className="h-4 w-4" />
          </IOSButton>
        </div>
      </div>
    </header>
  );
}