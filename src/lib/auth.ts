import { db } from '@/db';
import { user } from '@/db/schema';
import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import {
  admin,
  apiKey,
  captcha,
  haveIBeenPwned,
  organization,
  twoFactor,
} from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { eq } from 'drizzle-orm';
import { createClient } from 'redis';
import {
  changeEmail,
  deleteAccountEmail,
  inviteOrganisationMember,
  sendForgotPasswordEmail,
  sendOtpVerificationEmail,
  verifyEmail,
} from './email';

const redis = createClient({
  url: process.env.REDIS_URL,
});
await redis.connect();

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: process.env.NODE_ENV !== 'production' ? 'sandbox' : 'production',
});

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
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendOtpVerificationEmail(user.email, user.name, otp);
        },
      },
    }),
    admin(),
    captcha({
      provider: 'google-recaptcha',
      secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY as string,
    }),
    organization({
      sendInvitationEmail: async (data) => {
        const invitedUser = await db.query.user.findFirst({
          where: eq(user.email, data.email),
        });

        const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`;
        await inviteOrganisationMember(
          data.email,
          invitedUser?.name ?? '',
          data.inviter.user.name,
          data.inviter.user.email,
          data.organization.name,
          inviteLink,
          invitedUser?.image,
          data.organization.logo,
        );
      },
    }),
    // If using preview deployments
    // oAuthProxy(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: '123-456-789',
              slug: 'pro',
            },
          ],
          successUrl: '/success?checkout_id={CHECKOUT_ID}',
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET as string,
        }),
      ],
    }),
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ['google', 'github', 'demo-app'],
    },
  },
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
