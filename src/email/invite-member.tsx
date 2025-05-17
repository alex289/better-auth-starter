import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface InviteUserEmailProps {
  username?: string;
  userImage?: string | null | undefined;
  invitedByUsername?: string;
  invitedByEmail?: string;
  organizationName?: string;
  organizationLogo?: string | null | undefined;
  inviteLink?: string;
  baseUrl: string;
}

export const InviteUserEmail = ({
  username,
  userImage,
  invitedByUsername,
  invitedByEmail,
  organizationName: teamName,
  organizationLogo: teamImage,
  inviteLink,
  baseUrl,
}: InviteUserEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{`Join ${teamName} on Better-Auth-Starter`}</Preview>
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
              Join <strong>{teamName}</strong> on{' '}
              <strong>Better-Auth-Starter</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline">
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>{teamName}</strong> organization
              on <strong>Better-Auth-Starter</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={userImage ?? `${baseUrl}/static/icon.png`}
                    width="64"
                    height="64"
                    alt={`${username}'s profile picture`}
                  />
                </Column>
                <Column align="center">&rarr;</Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={teamImage ?? `${baseUrl}/static/icon.png`}
                    width="64"
                    height="64"
                    alt={`${teamName} team logo`}
                  />
                </Column>
              </Row>
            </Section>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={inviteLink}>
                Join the organization
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{' '}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
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
};

InviteUserEmail.PreviewProps = {
  username: 'alanturing',
  userImage: `http://localhost:3000/static/icon.png`,
  invitedByUsername: 'Alan',
  invitedByEmail: 'alan.turing@example.com',
  organizationName: 'Enigma',
  organizationLogo: `http://localhost:3000/static/icon.png`,
  inviteLink: 'https://vercel.com',
  baseUrl: `http://localhost:3000`,
} as InviteUserEmailProps;

export default InviteUserEmail;
