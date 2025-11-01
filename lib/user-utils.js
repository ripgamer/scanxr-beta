// lib/user-utils.js
import { prisma } from './prisma';

export async function ensureUserExists(clerkUser) {
  if (!clerkUser) return null;

  try {
    // First try to find user by email
    let dbUser = await prisma.user.findUnique({
      where: { email: clerkUser.emailAddresses[0].emailAddress }
    });

    // If user doesn't exist, create them
    if (!dbUser) {
      // Generate a unique username
      let username = clerkUser.username || 
                    clerkUser.firstName?.toLowerCase() || 
                    clerkUser.emailAddresses[0].emailAddress.split('@')[0];
      
      // Ensure username is unique
      let counter = 1;
      let baseUsername = username;
      while (await prisma.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      dbUser = await prisma.user.create({
        data: {
          email: clerkUser.emailAddresses[0].emailAddress,
          username: username,
        }
      });

      // Create a profile for the user
      const profileSlug = username; // You might want to make this more unique
      await prisma.profile.create({
        data: {
          userId: dbUser.id,
          slug: profileSlug,
          bio: `Welcome to ${clerkUser.firstName || username}'s profile!`,
          avatarUrl: clerkUser.imageUrl || null,
        }
      });
    }

    return dbUser;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    throw error;
  }
}