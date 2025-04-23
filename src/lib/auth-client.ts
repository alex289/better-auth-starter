import {
  apiKeyClient,
  passkeyClient,
  twoFactorClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [
    passkeyClient(),
    apiKeyClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = '/two-factor';
      },
    }),
  ],
});
