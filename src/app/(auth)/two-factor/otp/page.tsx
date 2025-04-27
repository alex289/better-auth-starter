'use client';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const otpSchema = z.object({
  otpCode: z.string().length(6).regex(/^\d+$/),
});

export default function OtpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: '',
    },
  });

  async function requestOtp() {
    setLoading(true);
    const res = await authClient.twoFactor.sendOtp();

    setLoading(false);

    if (res?.error) {
      toast.error('Failed to request OTP', {
        description: res.error.message,
      });
      return;
    }

    setOtpRequested(true);
  }

  async function verifyOtp(values: z.infer<typeof otpSchema>) {
    setLoading(true);
    const res = await authClient.twoFactor.verifyOtp({
      code: values.otpCode,
    });

    setLoading(false);

    if (res?.error) {
      toast.error('Failed to verify OTP', {
        description: res.error.message,
      });
      return;
    }

    router.push('/dashboard');
  }

  return (
    <Card className="min-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">OTP Verification</CardTitle>
        <CardDescription>
          Verify your account with an email OTP code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!otpRequested ? (
          <Button onClick={requestOtp} disabled={loading} className="w-full">
            {loading ? (
              <Spinner className="mr-2 h-4 w-4 text-white dark:text-black" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Send OTP to Email
          </Button>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(verifyOtp)}>
              <FormField
                control={form.control}
                name="otpCode"
                render={({ field }) => (
                  <FormItem className="justify-center">
                    <FormLabel>OTP Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-6 flex flex-col gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Spinner className="text-white dark:text-black" />
                  ) : null}
                  Verify
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
