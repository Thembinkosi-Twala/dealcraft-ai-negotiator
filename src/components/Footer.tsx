import { Scale } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-accent p-2 rounded-lg">
                <Scale className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">LegalAI Pro</h3>
                <p className="text-sm text-primary-foreground/80">Intelligent Negotiation Platform</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed max-w-md">
              The world's first AI-powered negotiation and contract drafting assistant. 
              Revolutionizing legal tech for businesses of all sizes.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Features</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Pricing</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">API</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">About</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Careers</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Contact</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-smooth">Legal</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2025 LegalAI Pro. All rights reserved. | InterDevTech</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
