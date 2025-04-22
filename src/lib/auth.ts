import { db } from '@/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { apiKey, haveIBeenPwned, twoFactor } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { createClient } from 'redis';
import {
  changeEmail,
  deleteAccountEmail,
  sendForgotPasswordEmail,
  verifyEmail,
} from './email';

const redis = createClient({
  url: process.env.REDIS_URL,
});
await redis.connect();

export const auth = betterAuth({
  appName: 'Better Auth Starter',
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  secondaryStorage: {
    get: async (key) => {
      const value = await redis.get(key);
      return value ? value : null;
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, { EX: ttl });
      else await redis.set(key, value);
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  rateLimit: {
    storage: 'secondary-storage',
  },
  session: {
    cookieCache: {
      enabled: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  plugins: [
    passkey(),
    haveIBeenPwned(),
    apiKey(),
    twoFactor(),
    // captcha({
    //   provider: 'google-recaptcha',
    //   secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY as string,
    // }),
  ],
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user }) => {
        await deleteAccountEmail(
          user.email,
          user.name,
          process.env.BETTER_AUTH_URL as string,
        );
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await changeEmail(newEmail, user.name, url);
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendForgotPasswordEmail(user.email, user.name, url);
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await verifyEmail(user.email, user.name, url);
    },
  },
});
