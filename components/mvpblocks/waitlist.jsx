'use client';

import { useRouter } from 'next/navigation';

import { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles, Code, Star, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spotlight } from '../ui/spotlight';
import { useTheme } from 'next-themes';
import { Bricolage_Grotesque } from 'next/font/google';
import { cn } from '../../lib/utils';
import Btn09 from './btn-gradient1';
import { useUser, SignIn, SignUpButton } from '@clerk/nextjs';

const brico = Bricolage_Grotesque({
  subsets: ['latin'],
});



// Remove the import and definition of the 'users' array.

export default function WaitlistPage() {
  const { isSignedIn } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    setColor(resolvedTheme === 'dark' ? '#ffffff' : '#e60a64');
  }, [resolvedTheme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Your form submission logic here
    // For now, let's just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const dotPositions = useMemo(
    () => Array.from({ length: 20 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    })),
    []
  );

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden xl:h-screen">
      <Spotlight />

      <div className="relative z-[100] mx-auto max-w-2xl px-10 py-0 mt-0 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-gradient-to-r from-primary/15 to-primary/5 px-4 py-2 backdrop-blur-sm"
        >
          <img
            src="https://i.postimg.cc/vHnf0qZF/logo.webp"
            alt="logo"
            className="spin h-6 w-6"
          />
          <span className="text-sm font-medium">Explore</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={cn(
            'mb-4 cursor-crosshair bg-gradient-to-b from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-4xl font-bold text-transparent sm:text-7xl',
            brico.className,
          )}
        >
          Your 3D World. Shared in Reality.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12 mt-2 text-muted-foreground sm:text-lg"
        >
          ScanXR is where creators, brands, and teams turn 3D spaces into real-world AR experiences. Instantly share, remix, and own your immersive content — no app required.
        </motion.p>

        {/* Features at a Glance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-12 grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          <div
            className={cn(
              'flex flex-col items-center justify-center rounded-xl border border-primary/10 bg-white/5 p-4 backdrop-blur-md',
              resolvedTheme === 'dark' ? 'glass' : 'glass2',
            )}
          >
            <Sparkles className="mb-2 h-5 w-5 text-primary" />
            <span className="text-xl font-bold">AR Sharing</span>
            <span className="text-xs text-muted-foreground">Share 3D in the real world</span>
          </div>

          <div
            className={cn(
              'flex flex-col items-center justify-center rounded-xl border border-primary/10 bg-white/5 p-4 backdrop-blur-md',
              resolvedTheme === 'dark' ? 'glass' : 'glass2',
            )}
          >
            <Code className="mb-2 h-5 w-5 text-primary" />
            <span className="text-xl font-bold">3D Profile Cards</span>
            <span className="text-xs text-muted-foreground">Showcase your work in AR</span>
          </div>

          <div
            className={cn(
              'flex flex-col items-center justify-center rounded-xl border border-primary/10 bg-white/5 p-4 backdrop-blur-md',
              resolvedTheme === 'dark' ? 'glass' : 'glass2',
            )}
          >
            <Star className="mb-2 h-5 w-5 text-primary" />
            <span className="text-xl font-bold">Creative Tools</span>
            <span className="text-xs text-muted-foreground">Remix, animate, and more</span>
          </div>

          <div
            className={cn(
              'flex flex-col items-center justify-center rounded-xl border border-primary/10 bg-white/5 p-4 backdrop-blur-md',
              resolvedTheme === 'dark' ? 'glass' : 'glass2',
            )}
          >
            <ExternalLink className="mb-2 h-5 w-5 text-primary" />
            <span className="text-xl font-bold">Own Your Content</span>
            <span className="text-xs text-muted-foreground">You control your 3D assets</span>
          </div>
        </motion.div>
        {/* Centered Get Started Button and Modal for NOT signed in users */}


        {/* <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="mx-auto flex flex-col gap-4 sm:flex-row"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <>
                <div className="relative flex-1">
                  <motion.input
                    key="email-input"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-primary/20 bg-white/5 px-6 py-4 text-foreground backdrop-blur-md transition-all placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-1 text-sm text-destructive sm:absolute"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                 <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-rose-500 to-rose-700 px-8 py-4 font-semibold text-primary-foreground text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                    <Sparkles className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
                  </span>
                  <span className="absolute inset-0 z-0 bg-gradient-to-r from-rose-500 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </button> 
              </>
            ) : (
              <motion.div
                key="thank-you-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className={cn(
                  'flex-1 cursor-pointer rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 px-6 py-4 font-medium text-primary backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] active:brightness-125',
                  resolvedTheme === 'dark' ? 'glass' : 'glass2',
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  Thanks for joining!{' '}
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form> */}

        {/* Remove the section that renders the avatars and the text showing the number of people joined (social proof) near the end of the file. */}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }
      `}</style>
    </main>
  );
}
