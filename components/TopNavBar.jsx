import React from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

function TopNavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[201] bg-white/70 backdrop-blur-lg border-b border-primary/10 shadow-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="ScanXR Logo" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight text-primary select-none">ScanXR</span>
        </div>
        {/* Search bar - only on large screens */}
        <div className="flex items-center gap-2 w-80">
          <div className="relative w-full hidden lg:block">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 bg-secondary/20 text-primary border-none focus:outline-none focus:ring-0 focus:border-none placeholder:text-primary/60 autofill:bg-secondary/20"
              style={{ boxShadow: 'none' }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60 pointer-events-none" />
          </div>
          {/* Mobile: show only a clickable search icon */}
          <button className="block lg:hidden p-2 rounded-full bg-secondary/20 text-primary hover:bg-secondary/40 transition" aria-label="Search">
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default TopNavBar
