import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      navigate("/verify", { state: { email } });
    }
  };

  const handleGoogleSignup = () => {
    setShowTermsDialog(true);
  };

  const handleAppleSignup = () => {
    setShowTermsDialog(true);
  };

  const handleTermsAccept = () => {
    setShowTermsDialog(false);
    // TODO: Implement OAuth
    console.log("OAuth signup accepted");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">Get started with your journey</p>
        </div>

        <div className="space-y-4 animate-slide-in">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-base font-medium"
            type="button"
            onClick={handleGoogleSignup}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-base font-medium"
            type="button"
            onClick={handleAppleSignup}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Sign up with Apple
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button type="submit" size="lg" className="w-full h-12 text-base font-medium">
              Sign up
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button
              onClick={() => navigate("/login")}
              className="font-medium hover:underline"
            >
              Log in
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Terms and Privacy</DialogTitle>
            <DialogDescription>
              Before continuing, please review and accept our terms
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
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
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowTermsDialog(false)}
              className="w-full sm:w-auto"
            >
              Decline
            </Button>
            <Button
              onClick={handleTermsAccept}
              disabled={!acceptedTerms}
              className="w-full sm:w-auto"
            >
              Accept & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Signup;
