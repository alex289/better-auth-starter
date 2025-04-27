'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from 'better-auth';
import { Passkey } from 'better-auth/plugins/passkey';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  Check,
  KeyRound,
  Laptop,
  LogOut,
  Shield,
  Smartphone,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { UAParser } from 'ua-parser-js';
import { z } from 'zod';
import { DisableTwoFactorDialog } from './disable-2fa-dialog';
import { EnableTwoFactorDialog } from './enable-2fa-dialog';
import { Spinner } from './spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

export function SecuritySettings({
  passkeys,
  sessions,
  currentSession,
  twoFactorEnabled,
}: {
  passkeys: Passkey[];
  sessions: Session[];
  currentSession: Session;
  twoFactorEnabled: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage your account security and authentication methods.
        </p>
      </div>

      <Tabs defaultValue="password" className="space-y-4">
        <TabsList>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="two-factor">Two-Factor Auth</TabsTrigger>
          <TabsTrigger value="passkeys">Passkeys</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <PasswordTab />
        <TwoFactorTab twoFactorEnabled={twoFactorEnabled} />
        <PasskeyTab passkeys={passkeys} />
        <SessionTab sessions={sessions} currentSession={currentSession} />
      </Tabs>
    </div>
  );
}

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

function PasswordTab() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function submitPasswordChange(
    values: z.infer<typeof changePasswordSchema>,
  ) {
    setLoading(true);
    const res = await authClient.changePassword({
      currentPassword: values.oldPassword,
      newPassword: values.newPassword,
    });

    setLoading(false);

    if (res?.error) {
      toast.error('Failed to change password', {
        description: res.error.message,
      });
      return;
    }

    toast.success('Password changed successfully');
  }
  return (
    <TabsContent value="password" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitPasswordChange)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Confirm new Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirm Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={loading} className="mt-4">
                {loading ? (
                  <Spinner className="text-white dark:text-black" />
                ) : null}
                Change Password
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </TabsContent>
  );
}

function SessionTab({
  sessions,
  currentSession,
}: {
  sessions: Session[];
  currentSession: Session;
}) {
  const router = useRouter();

  async function removeSession(session: Session) {
    const res = await authClient.revokeSession({
      token: session.token,
    });

    if (res?.error) {
      toast.error('Failed revoke session', {
        description: res.error.message,
      });
      return;
    }

    router.refresh();
  }

  async function revokeAllOtherSessions() {
    const res = await authClient.revokeOtherSessions();

    if (res?.error) {
      toast.error('Failed revoke all other sessions', {
        description: res.error.message,
      });
      return;
    }

    router.refresh();
  }
  return (
    <TabsContent value="sessions" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active sessions across devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.token}
              className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {session.token === currentSession.token ? (
                  <div className="rounded-full bg-green-100 p-2">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                ) : (
                  <div className="bg-primary/10 rounded-full p-2">
                    <Smartphone className="text-primary h-4 w-4" />
                  </div>
                )}
                <div>
                  <h3 className="flex items-center gap-2 font-medium">
                    {new UAParser(session.userAgent || '').getDevice().type ===
                    'mobile' ? (
                      <Smartphone />
                    ) : (
                      <Laptop />
                    )}
                    {new UAParser(session.userAgent || '').getOS().name},{' '}
                    {new UAParser(session.userAgent || '').getBrowser().name}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Last active: {formatDistanceToNow(session.updatedAt)}
                  </p>
                </div>
                {session.token !== currentSession.token ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={async () => await removeSession(session)}>
                    Revoke
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            onClick={async () => await revokeAllOtherSessions()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout of All Other Sessions
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}

const passkeySchema = z.object({
  name: z.string().min(1).max(50),
});

function PasskeyTab({ passkeys }: { passkeys: Passkey[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof passkeySchema>>({
    resolver: zodResolver(passkeySchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof passkeySchema>) {
    setLoading(true);
    const res = await authClient.passkey.addPasskey({
      name: values.name,
    });
    setLoading(false);

    if (res?.error) {
      toast.error('Failed to add passkey', {
        description: res.error.message,
      });
      return;
    }

    router.refresh();
  }

  async function removePasskey(passkey: Passkey) {
    const res = await authClient.passkey.deletePasskey({
      id: passkey.id,
    });

    if (res?.error) {
      toast.error('Failed delete passkey', {
        description: res.error.message,
      });
      return;
    }

    router.refresh();
  }

  return (
    <TabsContent value="passkeys" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Passkeys</CardTitle>
          <CardDescription>
            Manage passwordless authentication with passkeys.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passkeys.length === 0 ? <p>No passkeys added yet.</p> : null}
          {passkeys.map((passkey, index) => (
            <div key={passkey.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <KeyRound className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">
                    {passkey.name ?? 'Passkey ' + (index + 1)}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Added on {passkey.createdAt.toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={async () => await removePasskey(passkey)}>
                Remove
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid gap-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Passkey 1" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={loading} type="submit">
                {loading ? (
                  <Spinner className="mr-2 h-4 w-4 text-white dark:text-black" />
                ) : (
                  <Shield className="mr-2 h-4 w-4" />
                )}
                Add New Passkey
              </Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}

function TwoFactorTab({ twoFactorEnabled }: { twoFactorEnabled: boolean }) {
  return (
    <TabsContent value="two-factor" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {twoFactorEnabled ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Two-factor authentication is enabled</AlertTitle>
              <AlertDescription>
                Your account is protected with an authenticator app.
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <Smartphone className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Authenticator App</h3>
                  <p className="text-muted-foreground text-sm">
                    Use an authentication app or browser extension to get
                    two-factor authentication codes when prompted.
                  </p>
                </div>
              </div>
              {twoFactorEnabled ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">
                  Configured
                </Badge>
              ) : null}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {twoFactorEnabled ? (
            <DisableTwoFactorDialog />
          ) : (
            <EnableTwoFactorDialog />
          )}
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
