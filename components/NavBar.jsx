'use client';

import { Dock, DockIcon } from '../components/magicui/dock';
import { Home, Search, PlusCircle, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser(); // Clerk user

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Search },
    { href: '/create', label: 'Create', icon: PlusCircle },
    { href: '/profile', label: 'Profile', icon: User, isProfile: true },
  ];

  // Handle profile click → use Clerk username
  const handleProfileClick = async () => {
    if (!user) {
      // If user is not logged in, redirect to sign-in page
      router.push('/sign-in');
      return;
    }
  
    try {
      // Use Clerk username directly
      if (user.username) {
        router.push(`/${user.username}`);
      } else {
        console.error('Username not found for the logged-in user');
      }
    } catch (err) {
      console.error('Error navigating to profile:', err);
    }
  };
  

  // Check if current path is profile page
  const isProfileActive = () => {
    if (!user?.username) return false;
    return pathname === `/${user.username}`;
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4"
    >
      <Dock
        iconMagnification={80}
        iconDistance={120}
        iconSize={44}
        className="gap-4 sm:gap-8"
      >
        {links.map(({ href, label, icon: Icon, isProfile }) => {
          const isActive = isProfile ? isProfileActive() : pathname === href;

          if (isProfile) {
            return (
              <DockIcon
  key={label}
  className={
    isActive
      ? 'text-pink-600'
      : 'text-zinc-500 dark:text-zinc-300 hover:text-pink-500'
  }
>
  <button
    onClick={handleProfileClick}
    className="flex flex-col items-center gap-1 px-3 py-2 transition rounded-md cursor-pointer" // <-- added cursor-pointer
  >
    <Icon size={22} />
    <span className="text-xs">{label}</span>
  </button>
</DockIcon>
            );
          }

          return (
            <DockIcon
              key={label}
              className={
                isActive
                  ? 'text-pink-600'
                  : 'text-zinc-500 dark:text-zinc-300 hover:text-pink-500'
              }
            >
              <Link
                href={href}
                className="flex flex-col items-center gap-1 px-3 py-2 transition rounded-md"
              >
                <Icon size={22} />
                <span className="text-xs">{label}</span>
              </Link>
            </DockIcon>
          );
        })}

        <SignedIn>
          <DockIcon>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-11 h-11 sm:w-14 sm:h-14',
                },
              }}
            />
          </DockIcon>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-xs px-3 py-1 bg-pink-600 text-white rounded-md">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </Dock>
    </motion.nav>
  );
}
