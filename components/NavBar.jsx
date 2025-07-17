'use client';

import { Dock,  DockIcon } from '../components/magicui/dock';
import { Home, Search, PlusCircle, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/create', label: 'Create', icon: PlusCircle },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <motion.nav 
    initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4">
      <Dock 
        iconMagnification={80} 
        iconDistance={120}
        iconSize={44}
        className="gap-4 sm:gap-8"
      >
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <DockIcon key={href} className={isActive ? "text-pink-600" : "text-zinc-500 dark:text-zinc-300 hover:text-pink-500"}>
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
            <UserButton appearance={{ elements: { avatarBox: 'w-11 h-11 sm:w-14 sm:h-14' } }} />
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
