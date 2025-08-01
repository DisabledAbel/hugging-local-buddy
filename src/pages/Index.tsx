import { useState } from "react";
import { SetupForm } from "@/components/SetupForm";
import { SetupGuide } from "@/components/SetupGuide";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Github, Zap, Sparkles } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.jpg";

interface DeviceSpecs {
  language: string;
  version: string;
  os: string;
  gpu: string;
  ram: string;
  packageManager: string;
  docker: boolean;
}

// Mock analysis function - in a real app, this would call an API
const analyzeRepository = async (repoUrl: string, specs: DeviceSpecs) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Language-specific configurations
  const getLanguageConfig = () => {
    switch (specs.language) {
      case "python":
        return {
          techStack: ["Transformers", "Gradio", "PyTorch", "NumPy"],
          venvCommand: specs.packageManager === "conda" 
            ? `conda create -n hf-app python=${specs.version}\nconda activate hf-app`
            : `python -m venv hf-app\nsource hf-app/bin/activate  # On Windows: hf-app\\Scripts\\activate`,
          installCommand: specs.packageManager === "conda"
            ? "conda install pytorch transformers gradio -c pytorch -c huggingface"
            : "pip install torch transformers gradio accelerate",
          runCommand: "python app.py",
          accessUrl: "http://localhost:7860",
          envSetup: [
            "Ensure you have at least 4GB of free disk space for models",
            "Set CUDA_VISIBLE_DEVICES if you have multiple GPUs",
            "Configure Hugging Face token if using gated models",
            "Install Git LFS for large model files if needed"
          ],
          troubleshooting: [
            "If CUDA out of memory, try reducing batch size or model precision",
            "For slow downloads, consider using a mirror or cache",
            "On Windows, you might need Visual Studio Build Tools",
            "For M1/M2 Macs, use MPS backend for acceleration"
          ]
        };
        
      case "javascript":
        return {
          techStack: ["Transformers.js", "Node.js", "Express", "TensorFlow.js"],
          venvCommand: specs.packageManager === "yarn"
            ? "yarn init -y"
            : "npm init -y",
          installCommand: specs.packageManager === "yarn"
            ? "yarn add @huggingface/transformers @huggingface/hub express"
            : "npm install @huggingface/transformers @huggingface/hub express",
          runCommand: "node server.js",
          accessUrl: "http://localhost:3000",
          envSetup: [
            `Ensure Node.js ${specs.version} is installed`,
            "Install dependencies with your package manager",
            "Configure environment variables in .env file",
            "Set up CORS if accessing from browser"
          ],
          troubleshooting: [
            "If WebGPU not available, models will fallback to CPU",
            "Large models may require significant RAM",
            "Use model quantization for better performance",
            "Check browser compatibility for WebGL/WebGPU"
          ]
        };
        
      case "r":
        return {
          techStack: ["reticulate", "torch", "transformers (via Python)", "Shiny"],
          venvCommand: "# R environment setup\ninstall.packages('renv')\nrenv::init()",
          installCommand: `install.packages(c("reticulate", "shiny"))\nreticulate::py_install(c("torch", "transformers"))`,
          runCommand: "Rscript app.R",
          accessUrl: "http://localhost:3838",
          envSetup: [
            "Install R and required packages",
            "Configure reticulate to use Python environment",
            "Install Python dependencies via reticulate",
            "Set up Shiny server for web interface"
          ],
          troubleshooting: [
            "Ensure Python and R can communicate via reticulate",
            "Install system dependencies for torch compilation",
            "Configure PATH variables for Python/R integration",
            "Use virtual environments to avoid conflicts"
          ]
        };
        
      case "julia":
        return {
          techStack: ["MLJ.jl", "Transformers.jl", "Flux.jl", "PlutoUI"],
          venvCommand: "julia --project=.\nusing Pkg\nPkg.activate(\".\")",
          installCommand: "Pkg.add([\"MLJ\", \"Transformers\", \"Flux\", \"PlutoUI\"])",
          runCommand: "julia app.jl",
          accessUrl: "http://localhost:8000",
          envSetup: [
            `Ensure Julia ${specs.version} is installed`,
            "Create and activate project environment",
            "Install required Julia packages",
            "Configure CUDA.jl for GPU support if available"
          ],
          troubleshooting: [
            "Precompile packages to reduce startup time",
            "Use BinaryBuilder.jl for system dependencies",
            "Configure JULIA_NUM_THREADS for parallelization",
            "Check CUDA installation for GPU acceleration"
          ]
        };
        
      case "rust":
        return {
          techStack: ["Candle", "Tokenizers", "Axum", "Serde"],
          venvCommand: "cargo init hf-app\ncd hf-app",
          installCommand: "cargo add candle-core candle-nn tokenizers axum serde",
          runCommand: "cargo run",
          accessUrl: "http://localhost:8080",
          envSetup: [
            `Ensure Rust ${specs.version} is installed`,
            "Initialize Cargo project",
            "Add required dependencies to Cargo.toml",
            "Configure features for CUDA support if needed"
          ],
          troubleshooting: [
            "Compile with --release flag for better performance",
            "Install CUDA toolkit for GPU support",
            "Use cross-compilation for different targets",
            "Enable LTO for smaller binaries"
          ]
        };
        
      default:
        return {
          techStack: ["Generic ML Framework"],
          venvCommand: "# Environment setup varies by language",
          installCommand: "# Install language-specific dependencies",
          runCommand: "# Run application",
          accessUrl: "http://localhost:8000",
          envSetup: ["Configure your development environment"],
          troubleshooting: ["Check documentation for language-specific issues"]
        };
    }
  };

  const config = getLanguageConfig();
  
  const mockResult = {
    ...config,
    compatibility: "95%",
    estimatedTime: specs.language === "rust" ? "10-15 min" : specs.language === "julia" ? "8-12 min" : "5-10 min",
    modelSize: specs.language === "javascript" ? "200 MB" : "1.2 GB",
    alternatives: [
      {
        name: specs.language === "python" ? "Google Colab" : "CodeSandbox",
        description: specs.language === "python" ? "Run in the cloud with free GPU access" : "Run in browser environment",
        url: specs.language === "python" ? "https://colab.research.google.com" : "https://codesandbox.io"
      },
      {
        name: "Hugging Face Spaces",
        description: "Deploy directly on Hugging Face infrastructure",
        url: "https://huggingface.co/spaces"
      },
      {
        name: "Docker Container",
        description: "Use pre-built container with all dependencies",
        url: null
      }
    ]
  };
  
  return mockResult;
};

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentRepo, setCurrentRepo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (repoUrl: string, specs: DeviceSpecs) => {
    setIsLoading(true);
    setCurrentRepo(repoUrl);
    
    try {
      const result = await analyzeRepository(repoUrl, specs);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setCurrentRepo("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="relative container mx-auto px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-8 w-8 text-primary" />
                <Badge variant="secondary" className="px-3 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Setup Assistant
                </Badge>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                Hugging Face Setup Assistant
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Get personalized, step-by-step instructions to run any Hugging Face repository on your local machine. 
                Just paste a GitHub URL and your device specs – we'll handle the rest.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Github className="h-3 w-3" />
                  GitHub Integration
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Smart Analysis
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  Device Optimization
                </Badge>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <img 
                src={heroIllustration} 
                alt="Setup Assistant Interface" 
                className="relative w-full h-auto rounded-lg shadow-card border border-border/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {!analysisResult ? (
          <div className="max-w-4xl mx-auto">
            <SetupForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            
            {isLoading && (
              <Card className="mt-6 bg-gradient-card border-border/50 shadow-card">
                <CardContent className="py-8">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    <span className="text-foreground">Analyzing repository and generating setup guide...</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Setup Guide</h2>
              <button 
                onClick={handleNewAnalysis}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                ← Analyze Another Repository
              </button>
            </div>
            <SetupGuide repoUrl={currentRepo} analysisResult={analysisResult} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-secondary/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">HF Setup Assistant</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              Streamline your Hugging Face development workflow with intelligent setup automation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;