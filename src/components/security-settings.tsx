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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth-client';
import { Session } from 'better-auth';
import { Passkey } from 'better-auth/plugins/passkey';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, Check, KeyRound, Shield, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SecuritySettings({
  passkeys,
  sessions,
  currentSession,
}: {
  passkeys: Passkey[];
  sessions: Session[];
  currentSession: Session;
}) {
  const router = useRouter();

  async function addPasskey() {
    const res = await authClient.passkey.addPasskey();

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

        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="two-factor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Two-factor authentication is enabled</AlertTitle>
                <AlertDescription>
                  Your account is protected with an authenticator app.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Smartphone className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Authenticator App</h3>
                      <p className="text-muted-foreground text-sm">
                        Google Authenticator
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Smartphone className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">SMS Authentication</h3>
                      <p className="text-muted-foreground text-sm">
                        Not configured
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Setup
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Disable 2FA</Button>
              <Button>Reconfigure</Button>
            </CardFooter>
          </Card>
        </TabsContent>

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
                <div
                  key={passkey.id}
                  className="flex items-center justify-between">
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
              <Button
                className="w-full"
                onClick={async () => await addPasskey()}>
                <Shield className="mr-2 h-4 w-4" />
                Add New Passkey
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions across devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessions.map((session, index) => (
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
                      <h3 className="font-medium">
                        {session.token === currentSession.token
                          ? 'Current Session'
                          : (session.ipAddress ?? 'Session ' + (index + 1))}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {session.userAgent}
                      </p>
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
                className="w-full"
                onClick={async () => await revokeAllOtherSessions()}>
                Logout of All Other Sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
