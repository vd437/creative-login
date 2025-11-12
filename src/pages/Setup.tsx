import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Setup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength(0);
      setPasswordFeedback("");
      return;
    }

    let strength = 0;
    let feedback = "Weak";
    let color = "text-destructive";

    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;

    // Complexity checks
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

    if (strength >= 75) {
      feedback = "Strong";
      color = "text-success";
    } else if (strength >= 50) {
      feedback = "Medium";
      color = "text-yellow-600";
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  }, [password]);

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (!acceptedTerms) {
      alert("Please accept the terms and privacy policy");
      return;
    }
    // TODO: Implement account setup
    console.log("Setup complete:", { username, password });
    navigate("/dashboard");
  };

  const getStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-success";
    if (passwordStrength >= 50) return "bg-yellow-600";
    return "bg-destructive";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/verify")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Set up your account</h1>
          <p className="text-muted-foreground">Create your credentials</p>
        </div>

        <form onSubmit={handleSetup} className="space-y-6 animate-slide-in">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12"
            />
            {password && (
              <div className="space-y-2">
                <Progress 
                  value={passwordStrength} 
                  className="h-2"
                  indicatorClassName={getStrengthColor()}
                />
                <p className={`text-sm font-medium ${
                  passwordStrength >= 75 ? "text-success" :
                  passwordStrength >= 50 ? "text-yellow-600" :
                  "text-destructive"
                }`}>
                  {passwordFeedback}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              required
            />
            <label htmlFor="terms" className="text-sm leading-relaxed">
              I agree to the{" "}
              <a href="#" className="underline hover:text-foreground">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-foreground">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-12 text-base font-medium"
            disabled={!acceptedTerms}
          >
            Start
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
