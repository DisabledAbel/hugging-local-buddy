import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Github, Cpu, HardDrive, Monitor } from "lucide-react";

interface DeviceSpecs {
  os: string;
  python: string;
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
    os: "",
    python: "",
    gpu: "none",
    ram: "",
    packageManager: "pip",
    docker: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl && specs.os && specs.python && specs.ram) {
      onAnalyze(repoUrl, specs);
    }
  };

  const isFormValid = repoUrl && specs.os && specs.python && specs.ram;

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
              <Label htmlFor="python">Python Version</Label>
              <Select value={specs.python} onValueChange={(value) => setSpecs({ ...specs, python: value })}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select Python version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3.12">Python 3.12</SelectItem>
                  <SelectItem value="3.11">Python 3.11</SelectItem>
                  <SelectItem value="3.10">Python 3.10</SelectItem>
                  <SelectItem value="3.9">Python 3.9</SelectItem>
                  <SelectItem value="3.8">Python 3.8</SelectItem>
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
              <Select value={specs.packageManager} onValueChange={(value) => setSpecs({ ...specs, packageManager: value })}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select package manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pip">pip</SelectItem>
                  <SelectItem value="conda">conda</SelectItem>
                  <SelectItem value="mamba">mamba</SelectItem>
                  <SelectItem value="poetry">poetry</SelectItem>
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
              {specs.python || "Python"}
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