import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Scale, ArrowLeft, MessageSquare, Send, Bot, User, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  sender_type: string;
  message: string;
  created_at: string;
}

interface Negotiation {
  id: string;
  title: string;
  description: string;
  status: string;
  counterparty_name: string;
  deal_value: number;
}

const NegotiationAssistant = () => {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [selectedNegotiation, setSelectedNegotiation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [strategy, setStrategy] = useState("balanced");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewNegotiation, setShowNewNegotiation] = useState(false);
  
  // New negotiation form
  const [newNegTitle, setNewNegTitle] = useState("");
  const [newNegDescription, setNewNegDescription] = useState("");
  const [counterpartyName, setCounterpartyName] = useState("");
  const [dealValue, setDealValue] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchNegotiations();
  }, []);

  useEffect(() => {
    if (selectedNegotiation) {
      fetchMessages(selectedNegotiation);
    }
  }, [selectedNegotiation]);

  const fetchNegotiations = async () => {
    const { data, error } = await supabase
      .from('negotiations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching negotiations:', error);
    } else {
      setNegotiations(data || []);
    }
  };

  const fetchMessages = async (negotiationId: string) => {
    const { data, error } = await supabase
      .from('negotiation_messages')
      .select('*')
      .eq('negotiation_id', negotiationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const createNegotiation = async () => {
    if (!newNegTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a negotiation title.",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('negotiations')
      .insert({
        user_id: user.id,
        title: newNegTitle,
        description: newNegDescription,
        counterparty_name: counterpartyName,
        deal_value: dealValue ? parseFloat(dealValue) : null,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating negotiation",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Negotiation created!",
        description: "Your new negotiation has been started.",
      });
      setNegotiations([data, ...negotiations]);
      setSelectedNegotiation(data.id);
      setShowNewNegotiation(false);
      setNewNegTitle("");
      setNewNegDescription("");
      setCounterpartyName("");
      setDealValue("");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedNegotiation) return;

    setIsLoading(true);
    try {
      const selectedNeg = negotiations.find(n => n.id === selectedNegotiation);
      const negotiationContext = selectedNeg ? 
        `Negotiation: ${selectedNeg.title}. Description: ${selectedNeg.description}. Counterparty: ${selectedNeg.counterparty_name}. Deal Value: $${selectedNeg.deal_value?.toLocaleString() || 'TBD'}` 
        : '';

      const { data, error } = await supabase.functions.invoke('ai-negotiation-assistant', {
        body: { 
          negotiationId: selectedNegotiation,
          userMessage: newMessage,
          negotiationContext,
          strategy
        }
      });

      if (error) throw error;

      // Refresh messages after AI response
      await fetchMessages(selectedNegotiation);
      setNewMessage("");
      
      toast({
        title: "AI Assistant responded",
        description: "Strategic advice has been provided for your negotiation.",
      });
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message || "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrategyColor = (strat: string) => {
    switch (strat) {
      case 'aggressive': return 'bg-red-500';
      case 'collaborative': return 'bg-green-500';
      case 'defensive': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background border-b border-border shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-border mx-2" />
              <div className="bg-primary-gradient p-2 rounded-lg">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Negotiation Assistant</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Strategic Guidance</p>
              </div>
            </div>
            <Button 
              variant="gradient" 
              size="sm" 
              onClick={() => setShowNewNegotiation(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Negotiation
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          {/* Negotiations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Active Negotiations</CardTitle>
              <CardDescription>Select a negotiation to get AI assistance</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                {negotiations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No negotiations yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setShowNewNegotiation(true)}
                    >
                      Start First Negotiation
                    </Button>
                  </div>
                ) : (
                  negotiations.map((negotiation) => (
                    <div
                      key={negotiation.id}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedNegotiation === negotiation.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedNegotiation(negotiation.id)}
                    >
                      <h4 className="font-semibold text-foreground">{negotiation.title}</h4>
                      <p className="text-sm text-muted-foreground">{negotiation.counterparty_name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className={getStrategyColor(negotiation.status)}>
                          {negotiation.status}
                        </Badge>
                        {negotiation.deal_value && (
                          <span className="text-xs font-medium">${negotiation.deal_value.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI Strategy Assistant</CardTitle>
                  <CardDescription>Get real-time negotiation advice and tactics</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Strategy:</Label>
                  <Select value={strategy} onValueChange={setStrategy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                      <SelectItem value="collaborative">Collaborative</SelectItem>
                      <SelectItem value="defensive">Defensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            {selectedNegotiation ? (
              <>
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Start chatting with the AI assistant for strategic advice</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.sender_type === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`p-3 rounded-lg ${
                            message.sender_type === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender_type === 'user' ? 'order-1 bg-primary' : 'order-2 bg-muted'
                        }`}>
                          {message.sender_type === 'user' ? 
                            <User className="w-4 h-4 text-primary-foreground" /> : 
                            <Bot className="w-4 h-4 text-muted-foreground" />
                          }
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask for negotiation advice..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[40px] max-h-[120px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={!newMessage.trim() || isLoading}
                      variant="gradient"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select a Negotiation</h3>
                  <p className="text-muted-foreground">Choose a negotiation from the list to start getting AI assistance</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* New Negotiation Modal */}
        {showNewNegotiation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Start New Negotiation</CardTitle>
                <CardDescription>Create a new negotiation to get AI assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Negotiation Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Partnership Agreement with ABC Corp"
                    value={newNegTitle}
                    onChange={(e) => setNewNegTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the negotiation..."
                    value={newNegDescription}
                    onChange={(e) => setNewNegDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="counterparty">Counterparty Name</Label>
                  <Input
                    id="counterparty"
                    placeholder="Who are you negotiating with?"
                    value={counterpartyName}
                    onChange={(e) => setCounterpartyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deal-value">Deal Value ($)</Label>
                  <Input
                    id="deal-value"
                    type="number"
                    placeholder="100000"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowNewNegotiation(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="gradient" 
                    className="flex-1"
                    onClick={createNegotiation}
                  >
                    Create Negotiation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default NegotiationAssistant;