import {
  Body,
  Button,
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

interface VerifyEmailProps {
  url: string;
  username: string;
  baseUrl: string;
}

function ChangeEmail({ url, username, baseUrl }: VerifyEmailProps) {
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
              Change Email
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Please click on the following link to change your email:
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}>
                Change email
              </Button>
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

ChangeEmail.PreviewProps = {
  username: 'alanturing',
  url: `http://localhost:3000/api/auth/get-user-image?userId=1`,
  baseUrl: `http://localhost:3000`,
} as VerifyEmailProps;

export default ChangeEmail;
