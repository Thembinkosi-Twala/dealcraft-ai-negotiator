import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Scale, ArrowLeft, Upload, Brain, AlertTriangle, CheckCircle, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ContractAnalyzer = () => {
  const [contractText, setContractText] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      toast({
        title: "Contract text required",
        description: "Please enter or paste contract text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-contract-analyzer', {
        body: { contractText, analysisType: 'full' }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis complete!",
        description: "Your contract has been successfully analyzed.",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setContractText(content);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a text (.txt) file.",
        variant: "destructive",
      });
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
                <h1 className="text-xl font-bold text-foreground">Contract Analyzer</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Legal Document Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Contract Input
              </CardTitle>
              <CardDescription>
                Upload a contract file or paste contract text for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload Contract File</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-muted-foreground">
                    .txt files only
                  </span>
                </div>
              </div>

              <div className="text-center text-muted-foreground">
                <span>or</span>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <Label htmlFor="contract-text">Paste Contract Text</Label>
                <Textarea
                  id="contract-text"
                  placeholder="Paste your contract text here..."
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  className="min-h-[300px]"
                />
              </div>

              <Button 
                onClick={handleAnalyze} 
                className="w-full" 
                variant="gradient"
                disabled={isAnalyzing || !contractText.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Contract...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Contract
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Analysis Results
              </CardTitle>
              <CardDescription>
                Detailed insights, risks, and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analysis && !isAnalyzing && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready for Analysis
                  </h3>
                  <p className="text-muted-foreground">
                    Upload or paste a contract to get started with AI-powered legal analysis
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="bg-primary-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-primary-foreground animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Analyzing Contract...
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI is reviewing the document for key terms, risks, and opportunities
                  </p>
                </div>
              )}

              {analysis && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Analysis Complete
                    </Badge>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div 
                      className="bg-card border rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed"
                      style={{ maxHeight: '400px', overflowY: 'auto' }}
                    >
                      {analysis}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      Save Analysis
                    </Button>
                    <Button variant="outline" size="sm">
                      Export Report
                    </Button>
                    <Button variant="outline" size="sm">
                      Share Results
                    </Button>
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

export default ContractAnalyzer;