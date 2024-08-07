// app/actions/updateRole.ts
'use server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma'; // Update the path as needed

interface RoleData {
  role: 'INVESTOR' | 'ENTREPRENEUR';
}

interface RoleResult {
  data?: RoleData;
  error?: string;
}

export async function updateRole({ role }: { role: 'INVESTOR' | 'ENTREPRENEUR' }): Promise<RoleResult> {
  const user = await currentUser();

  if (!user) {
    return { error: 'User not found' };
  }

  const email = user.emailAddresses.length > 0 ? user.emailAddresses[0].emailAddress : '';

  try {
    let existingUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      existingUser = await db.user.create({
        data: {
          clerkId: user.id,
          email: email,
          name: user.firstName || '',
          imageUrl: user.imageUrl || '',
          role: role,
        },
      });
    } else if (existingUser.role) {
      return { error: 'Role has already been assigned and cannot be changed' };
    } else {
      existingUser = await db.user.update({
        where: { clerkId: user.id },
        data: { role: role },
      });
    }

    return { data: { role: existingUser.role ?? '' } };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to assign role' };
  }
}
