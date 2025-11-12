import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-8 text-center animate-slide-in">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome to Your Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Your account has been successfully created!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-8"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-8"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
