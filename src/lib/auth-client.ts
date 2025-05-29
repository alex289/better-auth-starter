import { polarClient } from '@polar-sh/better-auth';
import {
  adminClient,
  apiKeyClient,
  organizationClient,
  passkeyClient,
  twoFactorClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [
    passkeyClient(),
    apiKeyClient(),
    adminClient(),
    organizationClient(),
    polarClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = '/two-factor';
      },
    }),
  ],
});
