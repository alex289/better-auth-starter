'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function SuccessContent({ checkoutId }: { checkoutId?: string }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your subscription is now active.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Order Confirmed
          </CardTitle>
          <CardDescription>
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Subscription Active</AlertTitle>
            <AlertDescription>
              Your Pro subscription is now active. You can start using all the
              premium features immediately.
            </AlertDescription>
          </Alert>

          {checkoutId && (
            <div className="text-muted-foreground bg-muted rounded-md p-3 text-sm">
              <p className="font-medium">Checkout ID:</p>
              <p className="font-mono text-xs">{checkoutId}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/account/billing">View Billing</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
