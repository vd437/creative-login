import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold">Continue with OAuth</h1>
          <p className="text-muted-foreground">Authentication in progress...</p>
        </div>

        <div className="space-y-4 animate-slide-in">
          <div className="text-center text-sm text-muted-foreground">
            <p>Redirecting to authentication provider...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
