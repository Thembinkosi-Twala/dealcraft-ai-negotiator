import { Button } from "@/components/ui/button";
import { Scale, Brain, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-background border-b border-border shadow-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient p-2 rounded-lg">
              <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LegalAI Pro</h1>
              <p className="text-xs text-muted-foreground">Intelligent Negotiation Platform</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>Home</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>Dashboard</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/contract-analyzer")}>Analyze</Button>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button variant="gradient" size="sm" onClick={() => navigate('/auth')}>
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;