'use client';

import { useId } from "react"
import { MicIcon, SearchIcon } from "lucide-react"

import Logo from "@/components/logo"
import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Btn09 from "@/components/mvpblocks/btn-gradient1";
import { useUser } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";

export default function Component() {
  const id = useId()
  const { isSignedIn } = useUser();

  return (
    (<header className="fixed top-0 left-0 w-full z-[201] border-b px-2 md:px-6 bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-2 md:gap-4 flex-wrap">
        {/* Logo */}
        <div className="flex-1 min-w-0 flex items-center">
          <a href="#" className="text-primary hover:text-primary/90 block w-8 h-8 md:w-10 md:h-10">
            <Logo />
          </a>
          <span className="ml-2 text-lg md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent select-none whitespace-nowrap">
            ScanXR
          </span>
        </div>
        {/* Middle area */}
        <div className="grow min-w-0">
          {/* Search form */}
          <div className="relative mx-auto w-full max-w-[120px] sm:max-w-[180px] md:max-w-xs">
            <Input id={id} className="peer h-7 px-6 text-xs md:h-8 md:px-8 md:text-base" placeholder="Search..." type="search" />
            <div
              className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Press to speak"
              type="submit">
              <MicIcon size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-1 md:gap-2 min-w-0">
          {!isSignedIn && (
            <SignUpButton mode="modal">
              <Btn09
                as="span"
                className="text-xs font-medium px-2 py-0.5 h-7 min-w-[70px] md:text-lg md:px-6 md:py-2 md:h-10 whitespace-nowrap cursor-pointer"
              >
                <span className="text-xs md:text-lg">Get Started</span>
              </Btn09>
            </SignUpButton>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>)
  );
}
