import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Briefcase, Users, ShoppingCart } from "lucide-react";

const Industries = () => {
  const industries = [
    {
      icon: Building2,
      title: "Legal Tech",
      market: "$60+ Billion Market",
      description: "Reduces dependency on lawyers for routine contract work and standard negotiations.",
      color: "from-blue-500/20 to-blue-600/5"
    },
    {
      icon: Users,
      title: "Freelance & SMB",
      market: "$1+ Trillion Market", 
      description: "Helps individuals negotiate salaries, contracts, and payments with enterprise-level sophistication.",
      color: "from-purple-500/20 to-purple-600/5"
    },
    {
      icon: Briefcase,
      title: "Corporate M&A",
      market: "$3+ Trillion Market",
      description: "AI speeds up complex deal-making and merger negotiations with data-driven insights.",
      color: "from-green-500/20 to-green-600/5"
    },
    {
      icon: ShoppingCart,
      title: "E-commerce & Vendors",
      market: "$5+ Trillion Market",
      description: "Businesses optimize supplier pricing and contract terms using intelligent AI negotiation.",
      color: "from-orange-500/20 to-orange-600/5"
    }
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Industries We're Disrupting
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforming negotiation across trillion-dollar markets with AI-powered intelligence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((industry, index) => (
            <Card key={index} className="border-border hover:shadow-elegant transition-smooth group">
              <CardHeader>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce`}>
                  <industry.icon className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-semibold text-foreground mb-2">
                  {industry.title}
                </CardTitle>
                <div className="text-accent font-semibold text-lg">
                  {industry.market}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {industry.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;