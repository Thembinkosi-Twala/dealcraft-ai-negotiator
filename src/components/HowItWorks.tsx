import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Scan, MessageSquare, FileCheck } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Requirements",
      description: "Input your deal terms, financial constraints, and negotiation goals into our secure platform.",
      step: "01"
    },
    {
      icon: Scan,
      title: "AI Analysis & Strategy",
      description: "Our AI analyzes market data, legal frameworks, and optimal negotiation tactics for your specific case.",
      step: "02"
    },
    {
      icon: MessageSquare,
      title: "Autonomous Negotiation",
      description: "AI conducts real-time negotiations via email, chat, or voice with sophisticated psychological strategies.",
      step: "03"
    },
    {
      icon: FileCheck,
      title: "Contract Generation",
      description: "Receive legally binding, customized agreements drafted by AI and reviewed by legal experts.",
      step: "04"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-subtle-gradient">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From initial requirements to final contracts - our AI handles the entire negotiation process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-border hover:shadow-elegant transition-smooth h-full">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-gradient flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="text-sm font-bold text-accent mb-2">STEP {step.step}</div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-accent" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="gradient" size="lg" className="text-base px-8">
            Start Your First Negotiation
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;