import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface OtpVerificationProps {
  username: string;
  baseUrl: string;
  otp: string;
}

function OtpVerification({ username, baseUrl, otp }: OtpVerificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Click on the button to change your email</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/static/icon.png`}
                height="50"
                alt="Better-Auth-Starter"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              One-time password verification
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Enter the following code to sign in:
            </Text>
            <Section className="mt-[32px] mb-[32px] rounded-md bg-black/5 text-center">
              <Text className="mx-auto block pt-1 pb-1 text-center text-4xl leading-[30px] font-bold tracking-[5px] text-black">
                {otp}
              </Text>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              If you were not expecting this invitation, you can ignore this
              email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

OtpVerification.PreviewProps = {
  username: 'alanturing',
  baseUrl: `http://localhost:3000`,
  otp: '123456',
} as OtpVerificationProps;

export default OtpVerification;
