import { passkeyClient } from '@better-auth/passkey/client';
import { polarClient } from '@polar-sh/better-auth';
import {
  adminClient,
  apiKeyClient,
  lastLoginMethodClient,
  organizationClient,
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
    lastLoginMethodClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = '/two-factor';
      },
    }),
  ],
});
