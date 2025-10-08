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
import { authClient } from '@/lib/auth-client';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, CreditCard, Package, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from './spinner';

interface Subscription {
  id: string;
  status: string;
  product?: {
    name: string;
  };
  currentPeriodEnd?: string;
}

interface Usage {
  requests?: number;
}

export function BillingContent() {
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    loadSubscriptions();
    loadUsage();
  }, []);

  async function loadSubscriptions() {
    try {
      const response = await fetch('/api/auth/polar/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.result?.items || []);
      }
    } catch {
      console.error('Failed to load subscriptions');
    }
  }

  async function loadUsage() {
    try {
      const response = await fetch('/api/auth/polar/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch {
      console.error('Failed to load usage');
    }
  }

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await authClient.polar.checkout({
        slug: 'pro',
      });

      if ('error' in res && res.error) {
        toast.error('Failed to start checkout', {
          description: res.error.message,
        });
        setLoading(false);
        return;
      }

      // If redirect is true, the user will be redirected to the checkout page
      if ('url' in res && res.url) {
        window.location.href = res.url;
      }
    } catch {
      toast.error('Failed to start checkout');
      setLoading(false);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const response = await fetch('/api/auth/polar/portal');
      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        toast.error('Failed to open portal');
      }
    } catch {
      toast.error('Failed to open portal');
    } finally {
      setPortalLoading(false);
    }
  }

  const hasActiveSubscription = subscriptions.some(
    (sub) => sub.status === 'active' || sub.status === 'trialing',
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>
            Your current subscription and usage information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasActiveSubscription ? (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertTitle>Pro Plan Active</AlertTitle>
              <AlertDescription>
                You have an active subscription. Thank you for your support!
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Free Plan</AlertTitle>
              <AlertDescription>
                You are currently on the free plan. Upgrade to Pro for more
                features.
              </AlertDescription>
            </Alert>
          )}

          {subscriptions.length > 0 && (
            <div className="space-y-3">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <CreditCard className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {subscription.product?.name || 'Pro Plan'}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Status: {subscription.status}
                        {subscription.currentPeriodEnd &&
                          ` • Renews ${formatDistanceToNow(new Date(subscription.currentPeriodEnd), { addSuffix: true })}`}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      subscription.status === 'active' ||
                      subscription.status === 'trialing'
                        ? 'default'
                        : 'secondary'
                    }>
                    {subscription.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          {!hasActiveSubscription ? (
            <Button onClick={handleCheckout} disabled={loading}>
              {loading ? (
                <Spinner className="mr-2 h-4 w-4 text-white dark:text-black" />
              ) : (
                <Package className="mr-2 h-4 w-4" />
              )}
              Upgrade to Pro
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handlePortal}
              disabled={portalLoading}>
              {portalLoading ? (
                <Spinner className="mr-2 h-4 w-4" />
              ) : (
                <CreditCard className="mr-2 h-4 w-4" />
              )}
              Manage Subscription
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Usage Information */}
      {usage && (
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>
              Your current usage metrics for this billing period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-full p-2">
                <Zap className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">API Requests</h3>
                <p className="text-muted-foreground text-sm">
                  {usage.requests || 0} requests this period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
