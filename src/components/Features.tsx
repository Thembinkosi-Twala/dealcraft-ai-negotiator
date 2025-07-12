import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileText, MessageSquare, TrendingUp, Shield, Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Driven Strategy Formation",
      description: "Advanced AI learns your preferences, financial constraints, and business goals to create winning negotiation strategies.",
      color: "text-blue-600"
    },
    {
      icon: FileText,
      title: "Real-Time Contract Analysis",
      description: "Instantly scan existing contracts for loopholes, risks, and optimal negotiation points with 99% accuracy.",
      color: "text-purple-600"
    },
    {
      icon: MessageSquare,
      title: "Autonomous Negotiation",
      description: "AI conducts email, chat, or voice negotiations with counter-parties using proven psychological tactics.",
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Dynamic Contract Generation",
      description: "Generate legally binding agreements customized for any business deal in seconds, not hours.",
      color: "text-orange-600"
    },
    {
      icon: Shield,
      title: "Data-Driven Insights",
      description: "Analyze market trends, competitor deals, and legal frameworks to maximize your negotiation outcomes.",
      color: "text-red-600"
    },
    {
      icon: Zap,
      title: "Instant Deployment",
      description: "No setup required. Start negotiating immediately with our plug-and-play AI assistant.",
      color: "text-yellow-600"
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Revolutionary AI Capabilities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of legal and business negotiations with our cutting-edge AI technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-elegant transition-smooth group">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;