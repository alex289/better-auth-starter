import { auth } from './auth';

export type FullOrganization = NonNullable<
  Awaited<ReturnType<typeof auth.api.getFullOrganization>>
>;
export type FullOrganizationMember = FullOrganization['members'][number];
export type FullOrganizationInvitation =
  FullOrganization['invitations'][number];
