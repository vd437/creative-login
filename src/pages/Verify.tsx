import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCw } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    if (code.length === 6) {
      // Simulate verification
      setTimeout(() => {
        // Mock verification - in real app, verify with backend
        if (code === "123456") {
          setVerificationStatus("success");
          setTimeout(() => {
            navigate("/setup");
          }, 1500);
        } else {
          setVerificationStatus("error");
          setIsClearing(true);
          setTimeout(() => {
            setCode("");
            setVerificationStatus("idle");
            setIsClearing(false);
          }, 800);
        }
      }, 500);
    }
  }, [code, navigate]);

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setCode("");
    setVerificationStatus("idle");
    // TODO: Implement resend logic
    console.log("Resending code");
  };

  const getBorderColor = () => {
    if (verificationStatus === "success") return "border-success";
    if (verificationStatus === "error") return "border-destructive";
    return "";
  };

  const getSlotClassName = (index: number) => {
    const baseClass = `h-14 w-12 text-lg ${getBorderColor()}`;
    if (isClearing && verificationStatus === "error") {
      const delay = (5 - index) * 100;
      return `${baseClass} animate-[slideOutRight_0.3s_ease-out_${delay}ms_forwards]`;
    }
    return baseClass;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/signup")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground">
            Code sent to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="space-y-6 animate-slide-in">
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                className={getBorderColor()}
                disabled={isClearing}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className={getSlotClassName(0)} />
                  <InputOTPSlot index={1} className={getSlotClassName(1)} />
                  <InputOTPSlot index={2} className={getSlotClassName(2)} />
                  <InputOTPSlot index={3} className={getSlotClassName(3)} />
                  <InputOTPSlot index={4} className={getSlotClassName(4)} />
                  <InputOTPSlot index={5} className={getSlotClassName(5)} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {verificationStatus === "error" && (
              <p className="text-center text-sm text-destructive font-medium">
                Incorrect code. Try again
              </p>
            )}

            {verificationStatus === "success" && (
              <p className="text-center text-sm text-success font-medium">
                Verification successful!
              </p>
            )}
          </div>

          <div className="text-center space-y-2">
            {!canResend ? (
              <p className="text-sm text-muted-foreground">
                Code expires in{" "}
                <span className="font-medium text-foreground">
                  {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                </span>
              </p>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                className="text-sm"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Resend code
              </Button>
            )}
          </div>

          <div className="pt-4 text-center text-xs text-muted-foreground">
            <p>Didn't receive the code? Check your spam folder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
