import { eq } from 'drizzle-orm';
import { db } from '.';
import { invitation, member } from './auth-schema';

export async function getAllOrganizations() {
  const mappedOrganizations = [];
  const organizations = await db.query.organization.findMany();

  for (const organization of organizations) {
    const invitations = await db.query.invitation.findMany({
      where: eq(invitation.organizationId, organization.id),
      with: {
        user: true,
      },
    });

    const members = await db.query.member.findMany({
      where: eq(member.organizationId, organization.id),
      with: {
        user: true,
      },
    });

    mappedOrganizations.push({
      ...organization,
      invitations,
      members,
    });
  }

  return mappedOrganizations;
}

export type AllOrganizations = Awaited<ReturnType<typeof getAllOrganizations>>;
