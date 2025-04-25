import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3';

export default function Captcha({
  handleVerify,
}: {
  handleVerify: (token: string) => void | Promise<void>;
}) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={
        process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_PUBLIC_KEY as string
      }>
      <GoogleReCaptcha onVerify={handleVerify} />
    </GoogleReCaptchaProvider>
  );
}
