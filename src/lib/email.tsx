import ChangeEmail from '@/email/change-email';
import DeleteAccount from '@/email/delete-account';
import InviteUserEmail from '@/email/invite-member';
import OtpVerification from '@/email/otp-verification';
import ResetPassword from '@/email/reset-password';
import VerifyEmail from '@/email/verify-email';
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendForgotPasswordEmail(
  email: string,
  username: string,
  url: string,
) {
  const emailHtml = await render(
    <ResetPassword
      url={url}
      username={username}
      baseUrl={process.env.BETTER_AUTH_URL as string}
    />,
  );

  const options = {
    from: `"Better-Auth-Starter" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Better-Auth-Starter - Change your password',
    html: emailHtml,
  };

  await transporter.sendMail(options);
}

export async function verifyEmail(
  email: string,
  username: string,
  url: string,
) {
  const emailHtml = await render(
    <VerifyEmail
      url={url}
      username={username}
      baseUrl={process.env.BETTER_AUTH_URL as string}
    />,
  );

  const options = {
    from: `"Better-Auth-Starter" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Better-Auth-Starter - Verify your email',
    html: emailHtml,
  };

  await transporter.sendMail(options);
}

export async function changeEmail(
  email: string,
  username: string,
  url: string,
) {
  const emailHtml = await render(
    <ChangeEmail
      url={url}
      username={username}
      baseUrl={process.env.BETTER_AUTH_URL as string}
    />,
  );

  const options = {
    from: `"Better-Auth-Starter" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Better-Auth-Starter - Verify your email',
    html: emailHtml,
  };

  await transporter.sendMail(options);
}

export async function deleteAccountEmail(
  email: string,
  username: string,
  url: string,
) {
  const emailHtml = await render(
    <DeleteAccount
      url={url}
      username={username}
      baseUrl={process.env.BETTER_AUTH_URL as string}
    />,
  );

  const options = {
    from: `"Better-Auth-Starter" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Better-Auth-Starter - Delete your account',
    html: emailHtml,
  };

  await transporter.sendMail(options);
}

export async function sendOtpVerificationEmail(
  email: string,
  username: string,
  otp: string,
) {
  const emailHtml = await render(
    <OtpVerification
      username={username}
      baseUrl={process.env.BETTER_AUTH_URL as string}
      otp={otp}
    />,
  );

  const options = {
    from: `"Better-Auth-Starter" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Better-Auth-Starter - One-time password verification',
    html: emailHtml,
  };

  await transporter.sendMail(options);
}

export async function inviteOrganisationMember(
  email: string,
  username: string,
  invitedByUsername: string,
  invitedByEmail: string,
  organizationName: string,
  inviteLink: string,
  userImage?: string | null | undefined,
  organizationLogo?: string | null | undefined,
) {
  const emailHtml = await render(
    <InviteUserEmail
      username={username}
      baseUrl={process.env.BETTER_AUTH_URL as string}
      userImage={userImage}
      invitedByUsername={invitedByUsername}
      invitedByEmail={invitedByEmail}
      organizationName={organizationName}
      organizationLogo={organizationLogo}
      inviteLink={inviteLink}
    />,
  );

  const options = {
    from: `"Better-Auth-Starter" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Better-Auth-Starter - Invitation to join organization',
    html: emailHtml,
  };

  await transporter.sendMail(options);
}
