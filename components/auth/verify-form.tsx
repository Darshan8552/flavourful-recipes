"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  VerifyEmailFormValues,
  verifyEmailSchema,
} from "@/lib/schemas/auth-schema";
import { resendVerificationCode, verifyEmail } from "@/actions/auth-action";

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email,
      code: "",
    },
  });

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const onSubmit = async (data: VerifyEmailFormValues) => {
    setError(null);

    try {
      const result = await verifyEmail({
        email: data.email,
        code: data.code,
      });

      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "Invalid verification code");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setResendSuccess(false);
    setError(null);

    try {
      const result = await resendVerificationCode({ email });

      if (result.success) {
        setResendSuccess(true);
        setResendCooldown(60);
        form.setValue("code", "");
      } else {
        setError(result.error || "Failed to resend verification code");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 6);
    form.setValue("code", cleanValue);

    if (cleanValue.length === 6) {
      form.handleSubmit(onSubmit)();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      ["Backspace", "Tab", "Escape", "Enter", "Delete"].includes(e.key) ||
      (e.key === "a" && e.ctrlKey === true) ||
      (e.key === "c" && e.ctrlKey === true) ||
      (e.key === "v" && e.ctrlKey === true) ||
      (e.key === "x" && e.ctrlKey === true)
    ) {
      return;
    }
    if (
      (e.shiftKey || !/^\d+$/.test(e.key)) &&
      ![
        "Numpad0",
        "Numpad1",
        "Numpad2",
        "Numpad3",
        "Numpad4",
        "Numpad5",
        "Numpad6",
        "Numpad7",
        "Numpad8",
        "Numpad9",
      ].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="text-sm font-medium">{email}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resendSuccess && (
            <Alert>
              <AlertDescription>
                Verification code has been resent to your email.
              </AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Verification Code</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter 6-digit code"
                      className="text-center text-2xl font-mono tracking-widest"
                      maxLength={6}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoComplete="one-time-code"
                    />
                    <FormDescription className="text-center">
                      Enter the 6-digit code sent to your email
                    </FormDescription>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={
              form.formState.isSubmitting || form.watch("code").length !== 6
            }
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center space-y-4">
        <div className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleResendCode}
          disabled={isResending || resendCooldown > 0}
          className="w-full"
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : resendCooldown > 0 ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend in {resendCooldown}s
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend Code
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          Check your spam folder if you don&apos;t see the email
        </div>
      </div>
    </div>
  );
}
