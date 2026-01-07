"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

type OTPFormProps = {
  userId: string;
  className?: string;
};

export function OTPForm({ className, userId, ...props }: OTPFormProps) {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    try {
      await axios.post("/api/users/verifyemail", {
        userId,
        otp,
      });
      toast.success("OTP Verification Successful");

      // ✅ redirect after success
      router.push("/login");
    } catch (error: any) {
      console.log("OTP Verification Failed", error.message);
      toast.error("Signup Failed");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Enter verification code</h1>
            <p className="text-muted-foreground text-sm text-balance">
              We sent a 6-digit code to your email.
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP
              maxLength={6}
              minLength={6}
              id="otp"
              value={otp}
              onChange={setOtp}
              required
            >
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Enter the 6-digit code sent to your email.
            </FieldDescription>
          </Field>
          <Button type="submit">Verify</Button>
          <FieldDescription className="text-center">
            Didn&apos;t receive the code? <a href="#">Resend</a>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
