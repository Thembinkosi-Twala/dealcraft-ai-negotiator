import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, ArrowLeft, FileText, Wand2, Download, Save, Loader2, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Party {
  name: string;
  role: string;
  address: string;
}

const ContractGenerator = () => {
  const [contractType, setContractType] = useState("");
  const [parties, setParties] = useState<Party[]>([
    { name: "", role: "Client", address: "" },
    { name: "", role: "Service Provider", address: "" }
  ]);
  const [terms, setTerms] = useState({
    duration: "",
    paymentAmount: "",
    paymentTerms: "",
    deliverables: "",
    startDate: "",
    endDate: ""
  });
  const [jurisdiction, setJurisdiction] = useState("United States");
  const [customRequirements, setCustomRequirements] = useState("");
  const [generatedContract, setGeneratedContract] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contractTitle, setContractTitle] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  const addParty = () => {
    setParties([...parties, { name: "", role: "", address: "" }]);
  };

  const removeParty = (index: number) => {
    if (parties.length > 2) {
      setParties(parties.filter((_, i) => i !== index));
    }
  };

  const updateParty = (index: number, field: keyof Party, value: string) => {
    const updatedParties = [...parties];
    updatedParties[index][field] = value;
    setParties(updatedParties);
  };

  const generateContract = async () => {
    if (!contractType || parties.some(p => !p.name)) {
      toast({
        title: "Required fields missing",
        description: "Please fill in contract type and all party names.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-contract-generator', {
        body: {
          contractType,
          parties,
          terms,
          jurisdiction,
          customRequirements
        }
      });

      if (error) throw error;

      setGeneratedContract(data.contract);
      toast({
        title: "Contract generated!",
        description: "Your AI-generated contract is ready for review.",
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveContract = async () => {
    if (!generatedContract || !contractTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a contract title and generate the contract first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('contracts')
        .insert({
          user_id: user.id,
          title: contractTitle,
          content: generatedContract,
          contract_type: contractType,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Contract saved!",
        description: "Your contract has been saved to your dashboard.",
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save contract.",
        variant: "destructive",
      });
    }
  };

  const downloadContract = () => {
    if (!generatedContract) return;

    const blob = new Blob([generatedContract], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractTitle || 'contract'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                <h1 className="text-xl font-bold text-foreground">Contract Generator</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Legal Document Creation</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contract Builder */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
                <CardDescription>Define the basic contract parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contract-type">Contract Type *</Label>
                  <Select value={contractType} onValueChange={setContractType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nda">Non-Disclosure Agreement (NDA)</SelectItem>
                      <SelectItem value="service_agreement">Service Agreement</SelectItem>
                      <SelectItem value="partnership">Partnership Agreement</SelectItem>
                      <SelectItem value="employment">Employment Contract</SelectItem>
                      <SelectItem value="general">General Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contract-title">Contract Title</Label>
                  <Input
                    id="contract-title"
                    placeholder="e.g., Software Development Agreement"
                    value={contractTitle}
                    onChange={(e) => setContractTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Select value={jurisdiction} onValueChange={setJurisdiction}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="European Union">European Union</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Parties */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Parties</CardTitle>
                    <CardDescription>Define all parties involved in the contract</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={addParty}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Party
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {parties.map((party, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Party {index + 1}</h4>
                      {parties.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParty(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          placeholder="Party name or company"
                          value={party.name}
                          onChange={(e) => updateParty(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Input
                          placeholder="e.g., Client, Contractor, Partner"
                          value={party.role}
                          onChange={(e) => updateParty(index, 'role', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Address</Label>
                        <Textarea
                          placeholder="Full address"
                          value={party.address}
                          onChange={(e) => updateParty(index, 'address', e.target.value)}
                          className="min-h-[60px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Terms</CardTitle>
                <CardDescription>Specify key terms and conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={terms.startDate}
                      onChange={(e) => setTerms({...terms, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={terms.endDate}
                      onChange={(e) => setTerms({...terms, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-amount">Payment Amount</Label>
                    <Input
                      id="payment-amount"
                      placeholder="e.g., $10,000"
                      value={terms.paymentAmount}
                      onChange={(e) => setTerms({...terms, paymentAmount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Input
                      id="payment-terms"
                      placeholder="e.g., Net 30 days"
                      value={terms.paymentTerms}
                      onChange={(e) => setTerms({...terms, paymentTerms: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliverables">Deliverables/Scope</Label>
                  <Textarea
                    id="deliverables"
                    placeholder="Describe what will be delivered or the scope of work..."
                    value={terms.deliverables}
                    onChange={(e) => setTerms({...terms, deliverables: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-requirements">Additional Requirements</Label>
                  <Textarea
                    id="custom-requirements"
                    placeholder="Any specific clauses, conditions, or requirements..."
                    value={customRequirements}
                    onChange={(e) => setCustomRequirements(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={generateContract} 
              className="w-full" 
              variant="gradient"
              disabled={isGenerating || !contractType}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Contract...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Contract
                </>
              )}
            </Button>
          </div>

          {/* Generated Contract */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Generated Contract
                  </CardTitle>
                  <CardDescription>
                    AI-generated legal document ready for review
                  </CardDescription>
                </div>
                {generatedContract && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={saveContract}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadContract}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!generatedContract && !isGenerating && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-muted-foreground">
                    Fill in the contract details and click generate to create your AI-powered legal document
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-12">
                  <div className="bg-primary-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Wand2 className="w-8 h-8 text-primary-foreground animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Generating Contract...
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI is creating a professional legal document based on your specifications
                  </p>
                </div>
              )}

              {generatedContract && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Disclaimer:</strong> This contract is AI-generated and should be reviewed by a qualified attorney before use.
                    </p>
                  </div>
                  
                  <div 
                    className="bg-background border rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed max-h-[600px] overflow-y-auto"
                  >
                    {generatedContract}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractGenerator;