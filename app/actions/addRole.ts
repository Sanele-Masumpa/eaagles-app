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

async function updateRole({ role }: { role: 'INVESTOR' | 'ENTREPRENEUR' }): Promise<RoleResult> {
  const user = await currentUser(); // Retrieve user details

  if (!user) {
    return { error: 'User not found' };
  }

  const email = user.emailAddresses.length > 0 ?  user.emailAddresses[0].emailAddress : '';

  try {
    // Check if user exists in the database
    let existingUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      // Create user if they don't exist
      existingUser = await db.user.create({
        data: {
          clerkId: user.id,
          email: email,
          name: user.firstName || '',
          imageUrl: user.imageUrl || '',
          role: role, // Assign the role directly during user creation
        },
      });
    } else if (existingUser.role) {
      // If user already has a role assigned, prevent further changes
      return { error: 'Role has already been assigned and cannot be changed' };
    } else {
      // Update the user with the new role
      existingUser = await db.user.update({
        where: { clerkId: user.id },
        data: { role: role },
      });
    }

    return { data: { role: existingUser.role ?? '' } }; // Handle potential null value
  } catch (error) {
    console.error(error);
    return { error: 'Failed to assign role' };
  }
}

export default updateRole;
