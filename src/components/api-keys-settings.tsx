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
import { AlertCircle, Copy, Key, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

const apiKeys = [
  {
    id: 'key_1',
    name: 'Production API Key',
    key: 'sk_prod_2Kyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    created: 'Apr 23, 2023',
    lastUsed: '2 hours ago',
    status: 'active',
  },
  {
    id: 'key_2',
    name: 'Development API Key',
    key: 'sk_dev_7Lzxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    created: 'Jan 12, 2023',
    lastUsed: '5 days ago',
    status: 'active',
  },
  {
    id: 'key_3',
    name: 'Testing API Key',
    key: 'sk_test_9Qyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    created: 'Feb 5, 2023',
    lastUsed: '1 month ago',
    status: 'expired',
  },
];

export function ApiKeysSettings() {
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

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
            <Button>
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
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">API Key Name</Label>
                    <Input id="name" placeholder="My API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiration">Expiration</Label>
                    <Select defaultValue="never">
                      <SelectTrigger>
                        <SelectValue placeholder="Select expiration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days">30 days</SelectItem>
                        <SelectItem value="60days">60 days</SelectItem>
                        <SelectItem value="90days">90 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permissions">Permissions</Label>
                    <Select defaultValue="read-write">
                      <SelectTrigger>
                        <SelectValue placeholder="Select permissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read-only">Read Only</SelectItem>
                        <SelectItem value="read-write">Read & Write</SelectItem>
                        <SelectItem value="full-access">Full Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewKeyDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      setNewKey('sk_new_8Xyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
                    }>
                    Create API Key
                  </Button>
                </DialogFooter>
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
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      This API key will only be displayed once and cannot be
                      retrieved later.
                    </AlertDescription>
                  </Alert>
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
                        onClick={() => navigator.clipboard.writeText(newKey)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setShowNewKeyDialog(false);
                      setNewKey(null);
                    }}>
                    Done
                  </Button>
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
                      variant={
                        apiKey.status === 'active' ? 'outline' : 'secondary'
                      }
                      className={
                        apiKey.status === 'active'
                          ? 'bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }>
                      {apiKey.status === 'active' ? 'Active' : 'Expired'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground font-mono text-sm">
                    {apiKey.key.substring(0, 8)}••••••••••••••••••••••
                  </p>
                  <div className="text-muted-foreground mt-1 flex gap-4 text-xs">
                    <span>Created: {apiKey.created}</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(apiKey.key)}>
                  <Copy className="mr-1 h-3.5 w-3.5" />
                  Copy
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash className="mr-1 h-3.5 w-3.5" />
                  Revoke
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
