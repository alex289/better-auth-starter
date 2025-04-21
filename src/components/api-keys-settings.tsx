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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Copy, Key, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Spinner } from './spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

const apiKeySchema = z.object({
  name: z.string().min(1),
  expiresIn: z.string().min(1),
  permission: z.string().min(1),
});

export function ApiKeysSettings({
  apiKeys,
}: {
  apiKeys: {
    id: string;
    name: string | null;
    createdAt: Date;
    lastRequest: Date | null;
    enabled: boolean;
    start: string | null;
  }[];
}) {
  const router = useRouter();
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: '',
      expiresIn: (60 * 60 * 24 * 7).toString(),
      permission: 'read',
    },
  });

  async function onSubmit(values: z.infer<typeof apiKeySchema>) {
    setLoading(true);

    const res = await authClient.apiKey.create({
      name: values.name,
      expiresIn:
        values.expiresIn === 'never' ? null : parseInt(values.expiresIn),
      prefix: 'bas_',
      // TODO: Make this server action to use permissions
      // permissions: {
      //   projects: [values.permission],
      // },
    });

    setLoading(false);

    if (res.error) {
      toast.error('Failed to create api key', {
        description: res.error.message,
      });
      return;
    }

    setNewKey(res.data.key);
  }

  function closeDialog() {
    if (newKey) {
      setNewKey(null);
      router.refresh();
    }

    setShowNewKeyDialog(false);
  }

  async function deleteKey(keyId: string) {
    const res = await authClient.apiKey.delete({
      keyId,
    });

    if (res?.error) {
      toast.error('Failed to delete api key', {
        description: res.error.message,
      });
      return;
    }

    toast.success('API key deleted');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">
            Manage API keys to authenticate with our services.
          </p>
        </div>
        <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            {!newKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    API keys allow applications to authenticate with our
                    service.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4 py-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="My API Key"
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="expiresIn"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Expiration</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select expiration" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem
                                    value={(60 * 60 * 24 * 7).toString()}>
                                    7 days
                                  </SelectItem>
                                  <SelectItem
                                    value={(60 * 60 * 24 * 30).toString()}>
                                    30 days
                                  </SelectItem>
                                  <SelectItem
                                    value={(60 * 60 * 24 * 60).toString()}>
                                    60 days
                                  </SelectItem>
                                  <SelectItem
                                    value={(60 * 60 * 24 * 90).toString()}>
                                    90 days
                                  </SelectItem>
                                  <SelectItem value="never">Never</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="permission"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Permissions</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select permissions" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="read">
                                    Read Only
                                  </SelectItem>
                                  <SelectItem value="read-write">
                                    Read & Write
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        disabled={loading}
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setShowNewKeyDialog(false)}>
                        Cancel
                      </Button>
                      <Button
                        disabled={loading}
                        type="submit"
                        className="cursor-pointer">
                        {loading ? (
                          <Spinner className="text-white dark:text-black" />
                        ) : null}
                        Create API Key
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>API Key Created</DialogTitle>
                  <DialogDescription>
                    Your new API key has been created. Please copy it now as you
                    won&apos;t be able to see it again.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="api-key"
                        value={newKey}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(newKey);
                          toast.success('Copied to clipboard');
                        }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      This API key will only be displayed once and cannot be
                      retrieved later.
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter>
                  <Button onClick={closeDialog}>Done</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for authentication with our services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKeys.length === 0 ? <p>No API Keys added yet.</p> : null}
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <Key className="text-primary h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{apiKey.name}</h3>
                    <Badge
                      variant={apiKey.enabled ? 'outline' : 'secondary'}
                      className={
                        apiKey.enabled
                          ? 'bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }>
                      {apiKey.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground font-mono text-sm">
                    {apiKey.start}••••••••••••••••••••••
                  </p>
                  <div className="text-muted-foreground mt-1 flex gap-4 text-xs">
                    <span>
                      Created: {apiKey.createdAt.toLocaleDateString('de-DE')}
                    </span>
                    <span>
                      Last used:{' '}
                      {apiKey.lastRequest?.toLocaleDateString('de-DE') ??
                        'Never'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive cursor-pointer"
                  onClick={async () => await deleteKey(apiKey.id)}>
                  <Trash className="mr-1 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Security Notice</AlertTitle>
            <AlertDescription>
              Keep your API keys secure. Do not share them in publicly
              accessible areas such as GitHub, client-side code, or in API
              requests over unencrypted connections.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </div>
  );
}
