import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Plus, FileText, MessageSquare, BarChart3, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name: string;
  company_name: string;
  role: string;
}

interface Negotiation {
  id: string;
  title: string;
  status: string;
  deal_value: number;
  counterparty_name: string;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await fetchProfile(session.user.id);
      await fetchNegotiations(session.user.id);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
  };

  const fetchNegotiations = async (userId: string) => {
    const { data, error } = await supabase
      .from('negotiations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching negotiations:', error);
    } else {
      setNegotiations(data || []);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Scale className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background border-b border-border shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-gradient p-2 rounded-lg">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">LegalAI Pro</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                {profile?.full_name || user?.email}
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-muted-foreground">
            Manage your negotiations, analyze contracts, and leverage AI for better deals.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="hover:shadow-elegant transition-shadow cursor-pointer"
            onClick={() => navigate("/negotiation-assistant")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-3">
              <div className="bg-primary-gradient p-2 rounded-lg mr-3">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">New Negotiation</CardTitle>
                <CardDescription>Start a new deal or negotiation</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card 
            className="hover:shadow-elegant transition-shadow cursor-pointer"
            onClick={() => navigate("/contract-analyzer")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-3">
              <div className="bg-primary-gradient p-2 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Analyze Contract</CardTitle>
                <CardDescription>Upload and analyze legal documents</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card 
            className="hover:shadow-elegant transition-shadow cursor-pointer"
            onClick={() => navigate("/contract-generator")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-3">
              <div className="bg-primary-gradient p-2 rounded-lg mr-3">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Generate Contract</CardTitle>
                <CardDescription>Create legal documents with AI</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Negotiations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Negotiations
                </CardTitle>
                <CardDescription>Your latest deals and negotiations</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/negotiation-assistant")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {negotiations.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No negotiations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first negotiation to see it here
                </p>
                <Button variant="gradient" onClick={() => navigate("/negotiation-assistant")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Start Negotiation
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {negotiations.map((negotiation) => (
                  <div
                    key={negotiation.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-card transition-shadow"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{negotiation.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        with {negotiation.counterparty_name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(negotiation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {negotiation.deal_value && (
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            ${negotiation.deal_value.toLocaleString()}
                          </p>
                        </div>
                      )}
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(negotiation.status)} text-white`}
                      >
                        {negotiation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;