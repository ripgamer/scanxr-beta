'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Search, User, FileBox } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RippleWaveLoader from '@/components/mvpblocks/ripple-loader'

function TopNavBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const searchRef = useRef(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        setShowResults(true)
        performSearch(searchQuery)
      } else {
        setSearchResults({ users: [], posts: [] })
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  const performSearch = async (query) => {
    setIsSearching(true)
    const isUserSearch = query.startsWith('@')
    const searchTerm = isUserSearch ? query.slice(1) : query

    console.log('Searching:', { query, isUserSearch, searchTerm })

    try {
      if (isUserSearch) {
        // Search only users
        const response = await fetch(`/api/search/users?q=${encodeURIComponent(searchTerm)}`)
        const users = await response.json()
        console.log('User results:', users)
        setSearchResults({ users, posts: [] })
      } else {
        // Search posts
        const response = await fetch(`/api/search/posts?q=${encodeURIComponent(searchTerm)}`)
        const posts = await response.json()
        console.log('Post results:', posts)
        setSearchResults({ users: [], posts })
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultClick = (path) => {
    setIsNavigating(true)
    setShowResults(false)
    setSearchQuery('')
    router.push(path)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Navigate to first result or search page
      const isUserSearch = searchQuery.startsWith('@')
      
      if (isUserSearch && searchResults.users.length > 0) {
        // Navigate to first user
        const firstUser = searchResults.users[0]
        router.push(`/${firstUser.profile?.slug || firstUser.username}`)
        handleResultClick()
      } else if (!isUserSearch && searchResults.posts.length > 0) {
        // Navigate to first post
        const firstPost = searchResults.posts[0]
        router.push(`/p/${firstPost.slug}`)
        handleResultClick()
      }
    } else if (e.key === 'Escape') {
      setShowResults(false)
    }
  }

  return (
    <>
      {/* Loading Overlay */}
      {isNavigating && <RippleWaveLoader />}

      <nav className="fixed top-0 left-0 w-full z-[201] bg-white/70 backdrop-blur-lg border-b border-primary/10 shadow-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="ScanXR Logo" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight text-primary select-none">ScanXR</span>
        </div>
        {/* Search bar - only on large screens */}
        <div className="flex items-center gap-2 w-80">
          <div ref={searchRef} className="relative w-full hidden lg:block">
            <Input
              type="text"
              placeholder="Search posts or @users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 bg-secondary/20 text-primary border-none focus:outline-none focus:ring-0 focus:border-none placeholder:text-primary/60 autofill:bg-secondary/20"
              style={{ boxShadow: 'none' }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60 pointer-events-none" />
            
            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary/10 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {/* Loading State */}
                {isSearching && (
                  <div className="p-4 text-center text-primary/60">Searching...</div>
                )}

                {/* Users Results */}
                {!isSearching && searchResults.users.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-primary/60 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Users
                    </div>
                    {searchResults.users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleResultClick(`/${user.profile?.slug || user.username}`)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/20 rounded-md transition text-left"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {user.profile?.avatarUrl ? (
                            <img 
                              src={user.profile.avatarUrl} 
                              alt={user.username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-primary">@{user.username}</div>
                          <div className="text-sm text-primary/60">{user.profile?.bio || 'No bio'}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Posts Results */}
                {!isSearching && searchResults.posts.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-primary/60 flex items-center gap-2">
                      <FileBox className="h-4 w-4" />
                      Posts
                    </div>
                    {searchResults.posts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => handleResultClick(`/p/${post.slug}`)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/20 rounded-md transition text-left"
                      >
                        <div className="h-10 w-10 rounded-md bg-primary/10 overflow-hidden">
                          {post.thumbnailUrl ? (
                            <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <FileBox className="h-5 w-5 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-primary truncate">{post.title}</div>
                          <div className="text-sm text-primary/60 truncate">{post.caption || 'No description'}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!isSearching && searchResults.users.length === 0 && searchResults.posts.length === 0 && searchQuery.trim().length > 0 && (
                  <div className="p-4 text-center text-primary/60">No results found</div>
                )}
              </div>
            )}
          </div>
          {/* Mobile: show only a clickable search icon */}
          <button className="block lg:hidden p-2 rounded-full bg-secondary/20 text-primary hover:bg-secondary/40 transition" aria-label="Search">
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
    </>
  )
}

export default TopNavBar
