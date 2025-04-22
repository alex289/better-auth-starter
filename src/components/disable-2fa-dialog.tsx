'use client';

import type React from 'react';

import { KeyRound, Loader2, ShieldOff } from 'lucide-react';
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
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// TODO: Use better form
export function DisableTwoFactorDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function disableTwoFactor(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const res = await authClient.twoFactor.disable({
      password,
    });

    setIsLoading(false);
    if (res?.error) {
      toast.error('Failed to disable 2fa', {
        description: res.error.message,
      });
      return;
    }

    toast.success('Two-factor authentication disabled');
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setPassword('');
        }
      }}>
      <DialogTrigger asChild>
        <Button variant="destructive">Disable Two-Factor Authentication</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            This will remove the extra layer of security from your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={disableTwoFactor}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="disable-password">Confirm your password</Label>
              <div className="flex items-center space-x-2">
                <KeyRound className="text-muted-foreground h-4 w-4" />
                <Input
                  id="disable-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>
            <div className="bg-destructive/10 rounded-md p-3">
              <div className="flex items-center space-x-3">
                <ShieldOff className="text-destructive h-5 w-5" />
                <div className="text-destructive text-sm">
                  <p className="font-medium">Warning: Reduced security</p>
                  <p>
                    Disabling two-factor authentication will make your account
                    more vulnerable to unauthorized access.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="mr-2">
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Disable 2FA
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
