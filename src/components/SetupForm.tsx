import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Github, Cpu, HardDrive, Monitor } from "lucide-react";

interface DeviceSpecs {
  language: string;
  version: string;
  os: string;
  gpu: string;
  ram: string;
  packageManager: string;
  docker: boolean;
}

interface SetupFormProps {
  onAnalyze: (repoUrl: string, specs: DeviceSpecs) => void;
  isLoading: boolean;
}

export const SetupForm = ({ onAnalyze, isLoading }: SetupFormProps) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [specs, setSpecs] = useState<DeviceSpecs>({
    language: "",
    version: "",
    os: "",
    gpu: "none",
    ram: "",
    packageManager: "",
    docker: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl && specs.language && specs.version && specs.os && specs.ram) {
      onAnalyze(repoUrl, specs);
    }
  };

  const getPackageManagerOptions = () => {
    switch (specs.language) {
      case "python":
        return [
          { value: "pip", label: "pip" },
          { value: "conda", label: "conda" },
          { value: "mamba", label: "mamba" },
          { value: "poetry", label: "poetry" },
        ];
      case "javascript":
        return [
          { value: "npm", label: "npm" },
          { value: "yarn", label: "yarn" },
          { value: "pnpm", label: "pnpm" },
          { value: "bun", label: "bun" },
        ];
      case "r":
        return [
          { value: "install.packages", label: "install.packages" },
          { value: "pak", label: "pak" },
          { value: "renv", label: "renv" },
        ];
      case "julia":
        return [
          { value: "pkg", label: "Pkg.jl" },
        ];
      case "rust":
        return [
          { value: "cargo", label: "cargo" },
        ];
      default:
        return [{ value: "default", label: "Default package manager" }];
    }
  };

  const getVersionOptions = () => {
    switch (specs.language) {
      case "python":
        return [
          { value: "3.12", label: "Python 3.12" },
          { value: "3.11", label: "Python 3.11" },
          { value: "3.10", label: "Python 3.10" },
          { value: "3.9", label: "Python 3.9" },
          { value: "3.8", label: "Python 3.8" },
        ];
      case "javascript":
        return [
          { value: "20", label: "Node.js 20 LTS" },
          { value: "18", label: "Node.js 18 LTS" },
          { value: "16", label: "Node.js 16" },
        ];
      case "r":
        return [
          { value: "4.3", label: "R 4.3" },
          { value: "4.2", label: "R 4.2" },
          { value: "4.1", label: "R 4.1" },
        ];
      case "julia":
        return [
          { value: "1.9", label: "Julia 1.9" },
          { value: "1.8", label: "Julia 1.8" },
          { value: "1.7", label: "Julia 1.7" },
        ];
      case "rust":
        return [
          { value: "1.75", label: "Rust 1.75" },
          { value: "1.74", label: "Rust 1.74" },
          { value: "stable", label: "Rust Stable" },
        ];
      default:
        return [];
    }
  };

  const isFormValid = repoUrl && specs.language && specs.version && specs.os && specs.ram;

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5 text-primary" />
          Repository & Device Setup
        </CardTitle>
        <CardDescription>
          Enter your GitHub repository and device specifications to get a tailored setup guide
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="repo-url">GitHub Repository URL</Label>
            <Input
              id="repo-url"
              type="url"
              placeholder="https://github.com/username/repo-name"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Programming Language</Label>
              <Select value={specs.language} onValueChange={(value) => setSpecs({ ...specs, language: value, version: "", packageManager: "" })}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript/Node.js</SelectItem>
                  <SelectItem value="r">R</SelectItem>
                  <SelectItem value="julia">Julia</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Language Version</Label>
              <Select 
                value={specs.version} 
                onValueChange={(value) => setSpecs({ ...specs, version: value })}
                disabled={!specs.language}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder={specs.language ? "Select version" : "Select language first"} />
                </SelectTrigger>
                <SelectContent>
                  {getVersionOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="os">Operating System</Label>
              <Select value={specs.os} onValueChange={(value) => setSpecs({ ...specs, os: value })}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="windows11">Windows 11</SelectItem>
                  <SelectItem value="windows10">Windows 10</SelectItem>
                  <SelectItem value="macos">macOS</SelectItem>
                  <SelectItem value="ubuntu">Ubuntu</SelectItem>
                  <SelectItem value="debian">Debian</SelectItem>
                  <SelectItem value="fedora">Fedora</SelectItem>
                  <SelectItem value="arch">Arch Linux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpu">GPU</Label>
              <Select value={specs.gpu} onValueChange={(value) => setSpecs({ ...specs, gpu: value })}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select GPU" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No GPU</SelectItem>
                  <SelectItem value="nvidia-rtx-4090">NVIDIA RTX 4090</SelectItem>
                  <SelectItem value="nvidia-rtx-4080">NVIDIA RTX 4080</SelectItem>
                  <SelectItem value="nvidia-rtx-4070">NVIDIA RTX 4070</SelectItem>
                  <SelectItem value="nvidia-rtx-3080">NVIDIA RTX 3080</SelectItem>
                  <SelectItem value="nvidia-rtx-3070">NVIDIA RTX 3070</SelectItem>
                  <SelectItem value="nvidia-gtx-1660">NVIDIA GTX 1660</SelectItem>
                  <SelectItem value="amd-rx-7900">AMD RX 7900 XTX</SelectItem>
                  <SelectItem value="amd-rx-6800">AMD RX 6800 XT</SelectItem>
                  <SelectItem value="apple-m1">Apple M1/M2/M3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ram">RAM</Label>
              <Select value={specs.ram} onValueChange={(value) => setSpecs({ ...specs, ram: value })}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select RAM amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8gb">8 GB</SelectItem>
                  <SelectItem value="16gb">16 GB</SelectItem>
                  <SelectItem value="32gb">32 GB</SelectItem>
                  <SelectItem value="64gb">64 GB</SelectItem>
                  <SelectItem value="128gb">128 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="package-manager">Package Manager</Label>
              <Select 
                value={specs.packageManager} 
                onValueChange={(value) => setSpecs({ ...specs, packageManager: value })}
                disabled={!specs.language}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder={specs.language ? "Select package manager" : "Select language first"} />
                </SelectTrigger>
                <SelectContent>
                  {getPackageManagerOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="docker">Docker Available</Label>
              <Select value={specs.docker.toString()} onValueChange={(value) => setSpecs({ ...specs, docker: value === "true" })}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Docker availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes, Docker is installed</SelectItem>
                  <SelectItem value="false">No Docker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Monitor className="h-3 w-3" />
              {specs.os || "OS"}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {specs.language ? `${specs.language} ${specs.version}` : "Language"}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              {specs.ram || "RAM"}
            </Badge>
          </div>

          <Button 
            type="submit" 
            variant="glow" 
            className="w-full" 
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Analyzing Repository..." : "Generate Setup Guide"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};