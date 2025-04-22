'use client';

import type React from 'react';

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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

// TODO: use better form
export function EnableTwoFactorDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'password' | 'setup' | 'verify'>('password');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [totpUri, setTotpUri] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function enableTwoFactor(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const res = await authClient.twoFactor.enable({
      password,
    });

    setIsLoading(false);

    if (res?.error) {
      toast.error('Failed to enable 2fa', {
        description: res.error.message,
      });
      return;
    }

    setTotpUri(res.data.totpURI);
    setBackupCodes(res.data.backupCodes);
    setStep('setup');
  }

  async function verifyTwoFactor(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const res = await authClient.twoFactor.verifyTotp({
      code: totpCode,
    });

    setIsLoading(false);

    if (res?.error) {
      toast.error('Failed to enable 2fa', {
        description: res.error.message,
      });
      return;
    }

    setOpen(false);
    setStep('password');
    setPassword('');
    setTotpCode('');

    router.refresh();
    toast.success('Two-factor authentication enabled');
  }

  const copyBackupCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    toast.info('All backup codes have been copied to your clipboard.');
  };

  const resetDialog = () => {
    setStep('password');
    setPassword('');
    setTotpCode('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetDialog();
        }
      }}>
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

        {step === 'password' && (
          <form onSubmit={enableTwoFactor}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Confirm your password</Label>
                <div className="flex items-center space-x-2">
                  <KeyRound className="text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
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
        )}

        {step === 'setup' && (
          <div className="grid gap-4 py-4">
            <Tabs defaultValue="authenticator">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="authenticator">
                  Authenticator App
                </TabsTrigger>
                <TabsTrigger value="backup">Backup Codes</TabsTrigger>
              </TabsList>

              <TabsContent value="authenticator" className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-4 p-4">
                  <div className="rounded-lg bg-white p-2">
                    <QRCode value={totpUri} />
                  </div>
                  <div className="text-muted-foreground text-center text-sm">
                    <p>Scan this QR code with your authenticator app</p>
                    <p className="mt-2">Or enter this code manually:</p>
                    <div className="mt-1 flex items-center justify-center space-x-2">
                      <code className="bg-muted rounded px-2 py-1 text-sm break-all">
                        {totpUri.split('secret=')[1]?.split('&')[0] ||
                          'JBSWY3DPEHPK3PXP'}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          const secret =
                            totpUri.split('secret=')[1]?.split('&')[0] ||
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
                    {backupCodes.map((code, index) => (
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
                    Save these backup codes in a secure place. Each code can
                    only be used once.
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
        )}

        {step === 'verify' && (
          <form onSubmit={verifyTwoFactor}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="totp-code-verify">Verification Code</Label>
                <Input
                  id="totp-code-verify"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
                <p className="text-muted-foreground text-xs">
                  Enter the 6-digit code from your authenticator app to complete
                  setup
                </p>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
