import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Package, 
  Settings, 
  Rocket, 
  Globe, 
  AlertTriangle, 
  Lightbulb, 
  Copy,
  ExternalLink,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SetupGuideProps {
  repoUrl: string;
  analysisResult: any;
}

export const SetupGuide = ({ repoUrl, analysisResult }: SetupGuideProps) => {
  const { toast } = useToast();
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = async (text: string, commandType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(commandType);
      toast({
        title: "Copied to clipboard",
        description: `${commandType} command copied successfully`,
      });
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const CodeBlock = ({ title, command, language = "bash" }: { title: string; command: string; language?: string }) => (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(command, title)}
          className="h-8 px-2"
        >
          {copiedCommand === title ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre className="bg-secondary/50 p-3 rounded-md text-sm overflow-x-auto border border-border/50">
        <code className="text-foreground">{command}</code>
      </pre>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with detected tech stack */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <CardTitle>Analysis Complete</CardTitle>
          </div>
          <CardDescription>
            Repository analyzed successfully. Here's your personalized setup guide.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Detected Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.techStack.map((tech: string, index: number) => (
                  <Badge key={index} variant="default" className="bg-primary/10 text-primary border-primary/20">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{analysisResult.compatibility}</div>
                <div className="text-sm text-muted-foreground">Compatibility</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{analysisResult.estimatedTime}</div>
                <div className="text-sm text-muted-foreground">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{analysisResult.modelSize}</div>
                <div className="text-sm text-muted-foreground">Model Size</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-step setup guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dependencies */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              title="Clone Repository"
              command={`git clone ${repoUrl}\ncd ${repoUrl.split('/').pop()?.replace('.git', '') || 'repo'}`}
            />
            
            <CodeBlock
              title="Create Virtual Environment"
              command={analysisResult.venvCommand}
            />
            
            <CodeBlock
              title="Install Dependencies"
              command={analysisResult.installCommand}
            />
          </CardContent>
        </Card>

        {/* Environment Setup */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Environment Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisResult.envSetup.map((step: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Run Commands */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Running the Application
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock
            title="Start Application"
            command={analysisResult.runCommand}
          />
          
          <div className="flex items-center gap-2 p-4 bg-secondary/30 rounded-md border border-border/50">
            <Globe className="h-5 w-5 text-accent" />
            <span className="text-sm">
              Access your app at: 
              <a 
                href={analysisResult.accessUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-primary hover:underline font-mono"
              >
                {analysisResult.accessUrl}
              </a>
              <ExternalLink className="inline h-3 w-3 ml-1" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting & Alternatives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {analysisResult.troubleshooting.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              Alternative Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisResult.alternatives.map((alt: any, index: number) => (
                <div key={index} className="p-3 bg-secondary/30 rounded-md border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{alt.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{alt.description}</p>
                  {alt.url && (
                    <a 
                      href={alt.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs mt-1 inline-flex items-center gap-1"
                    >
                      Try it here <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};