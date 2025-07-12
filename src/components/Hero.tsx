import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-subtle-gradient py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            AI-Powered Legal Revolution
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Negotiate Like a
            <span className="bg-primary-gradient bg-clip-text text-transparent"> Pro</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            The world's first AI-powered negotiation and contract drafting assistant. 
            Handle business deals, legal agreements, and financial negotiations autonomously—saving time and money.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="gradient" size="lg" className="text-base px-8">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold text-accent mb-2">$60B+</h3>
              <p className="text-muted-foreground">Legal Tech Market</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-accent mb-2">80%</h3>
              <p className="text-muted-foreground">Faster Negotiations</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-accent mb-2">95%</h3>
              <p className="text-muted-foreground">Cost Reduction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;