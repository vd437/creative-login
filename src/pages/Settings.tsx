import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Shield, 
  Languages, 
  Monitor, 
  FileText, 
  ScrollText, 
  Mail, 
  ChevronRight,
  X
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <X className="h-5 w-5" />
        </Button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">PROFILE</h2>
          <div className="rounded-2xl border bg-card overflow-hidden">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors border-b">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <User className="h-5 w-5" />
              </div>
              <span className="flex-1 text-left font-medium">Account Settings</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <Shield className="h-5 w-5" />
              </div>
              <span className="flex-1 text-left font-medium">Data Controls</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* App Section */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">APP</h2>
          <div className="rounded-2xl border bg-card overflow-hidden">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors border-b">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <Languages className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground">English</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors border-b">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <Monitor className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Appearance</p>
                <p className="text-sm text-muted-foreground">System</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <FileText className="h-5 w-5" />
              </div>
              <span className="flex-1 text-left font-medium">Line Ruling</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">SUPPORT</h2>
          <div className="rounded-2xl border bg-card overflow-hidden">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors border-b">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <ScrollText className="h-5 w-5" />
              </div>
              <span className="flex-1 text-left font-medium">Service Agreement</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <Mail className="h-5 w-5" />
              </div>
              <span className="flex-1 text-left font-medium">Contact Us</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <Button 
          variant="destructive" 
          className="w-full rounded-2xl py-6 font-semibold text-base"
          onClick={() => navigate("/login")}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Settings;
