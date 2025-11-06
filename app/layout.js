import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import NavBar from '../components/NavBar'
import RippleWaveLoader from "../components/mvpblocks/ripple-loader"
import TopNavBar from '@/components/TopNavBar'
import Component from '@/components/comp-586'
import { ThemeProvider } from "@/components/theme-provider"
import GlobalParticles from '@/components/mvpblocks/GlobalParticles';
import { organizationSchema, websiteSchema } from './structured-data';
import PageTransition from '@/components/page-transition';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'ScanXR - 3D World Shared in Reality ',
  description: 'ScanXR - Your 3D World Shared in Reality. Built by Aakashdeep Kumar (Developer), Nandini Jagdade (Team Lead & Database Manager), Sakshi Kapure (UI/UX Designer), and Pramod Dwarkunde (Full Stack Developer). Experience immersive 3D technology and augmented reality.',
  keywords: 'ScanXR, 3D Technology, Augmented Reality, Virtual Reality, 3D Modeling, AR/VR, Aakashdeep Kumar, Nandini Jagdade, Sakshi Kapure, Pramod Dwarkunde, Team Lead, Developer, Database Manager, UI/UX Designer, Full Stack Developer',
  authors: [
    { name: 'Aakashdeep Kumar', role: 'Developer' },
    { name: 'Nandini Jagdade', role: 'Team Lead & Database Manager' },
    { name: 'Sakshi Kapure', role: 'UI/UX Designer' },
    { name: 'Pramod Dwarkunde', role: 'Full Stack Developer' }
  ],
  openGraph: {
    title: 'ScanXR - 3D World Shared in Reality',
    description: 'Built by Aakashdeep Kumar, Nandini Jagdade, Sakshi Kapure, and Pramod Dwarkunde. Experience immersive 3D technology.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ScanXR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScanXR - 3D World Shared in Reality',
    description: 'Built by Aakashdeep Kumar, Nandini Jagdade, Sakshi Kapure, and Pramod Dwarkunde',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema),
            }}
          />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class" // or "body" if you want to avoid <html> class mismatch
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <GlobalParticles />
            <header>
              <Component />
              <NavBar />
              
            </header>
            <RippleWaveLoader />
            {/* Main content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}