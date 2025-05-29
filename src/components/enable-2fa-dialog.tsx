'use client';

import { Check, Copy, KeyRound, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from './ui/input-otp';

interface TotpData {
  totpURI: string;
  backupCodes: string[];
}

export function EnableTwoFactorDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'password' | 'setup' | 'verify'>('password');
  const [totpData, setTotpData] = useState<TotpData>({
    totpURI: '',
    backupCodes: [],
  });

  return (
    <Dialog open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
      <DialogTrigger asChild>
        <Button>Enable Two-Factor Authentication</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Add an extra layer of security to your account.
          </DialogDescription>
        </DialogHeader>

        {step === 'password' ? (
          <PasswordStep setStep={setStep} setTotpData={setTotpData} />
        ) : null}
        {step === 'setup' ? (
          <SetupStep setStep={setStep} totpData={totpData} />
        ) : null}
        {step === 'verify' ? (
          <VerifyStep setStep={setStep} setOpen={setOpen} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

const passwordStepSchema = z.object({
  password: z.string(),
});

function PasswordStep({
  setTotpData,
  setStep,
}: {
  setTotpData: (totpData: TotpData) => void;
  setStep: (step: 'verify' | 'password' | 'setup') => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof passwordStepSchema>>({
    resolver: zodResolver(passwordStepSchema),
    defaultValues: {
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof passwordStepSchema>) {
    setIsLoading(true);

    const res = await authClient.twoFactor.enable({
      password: values.password ?? '',
    });

    setIsLoading(false);

    if (res?.error) {
      toast.error('Failed to enable 2fa', {
        description: res.error.message,
      });
      return;
    }

    setTotpData(res.data);
    setStep('setup');
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <KeyRound className="text-muted-foreground h-4 w-4" />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-1">
                    <FormLabel>Confirm your password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Password
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function SetupStep({
  totpData,
  setStep,
}: {
  totpData: TotpData;
  setStep: (step: 'verify' | 'password' | 'setup') => void;
}) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyBackupCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllBackupCodes = () => {
    navigator.clipboard.writeText(totpData.backupCodes.join('\n'));
    toast.info('All backup codes have been copied to your clipboard.');
  };
  return (
    <div className="grid gap-4 py-4">
      <Tabs defaultValue="authenticator">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="authenticator">Authenticator App</TabsTrigger>
          <TabsTrigger value="backup">Backup Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="authenticator" className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4 p-4">
            <div className="rounded-lg bg-white p-2">
              <QRCode value={totpData.totpURI} />
            </div>
            <div className="text-muted-foreground text-center text-sm">
              <p>Scan this QR code with your authenticator app</p>
              <p className="mt-2">Or enter this code manually:</p>
              <div className="mt-1 flex items-center justify-center space-x-2">
                <code className="bg-muted rounded px-2 py-1 text-sm break-all">
                  {totpData.totpURI.split('secret=')[1]?.split('&')[0] ||
                    'JBSWY3DPEHPK3PXP'}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const secret =
                      totpData.totpURI.split('secret=')[1]?.split('&')[0] ||
                      'JBSWY3DPEHPK3PXP';
                    navigator.clipboard.writeText(secret);
                    toast.info(
                      'The secret key has been copied to your clipboard.',
                    );
                  }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Backup Codes</h4>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={copyAllBackupCodes}>
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {totpData.backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border px-3 py-2">
                  <code className="text-sm">{code}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyBackupCode(code, index)}>
                    {copiedIndex === index ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              Save these backup codes in a secure place. Each code can only be
              used once.
            </p>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('password')}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep('verify')}>
              Continue
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const verifyStepSchema = z.object({
  totpCode: z.string().length(6).regex(/^\d+$/),
});

function VerifyStep({
  setOpen,
  setStep,
}: {
  setOpen: (open: boolean) => void;
  setStep: (step: 'verify' | 'password' | 'setup') => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof verifyStepSchema>>({
    resolver: zodResolver(verifyStepSchema),
    defaultValues: {
      totpCode: '',
    },
  });

  async function onSubmit(values: z.infer<typeof verifyStepSchema>) {
    setIsLoading(true);

    const res = await authClient.twoFactor.verifyTotp({
      code: values.totpCode,
    });

    setIsLoading(false);

    if (res?.error) {
      toast.error('Failed to enable 2fa', {
        description: res.error.message,
      });
      return;
    }

    setOpen(false);
    router.refresh();
    toast.success('Two-factor authentication enabled');
    setStep('password');
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="totpCode"
              render={({ field }) => (
                <FormItem className="justify-center">
                  <FormLabel>Verification Code</FormLabel>
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
                  <FormDescription>
                    Enter the 6-digit code from your authenticator app to
                    complete setup
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep('setup')}
            className="mr-2">
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enable 2FA
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
