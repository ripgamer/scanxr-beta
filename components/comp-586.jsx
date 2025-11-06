'use client';

import { useId, useState, useEffect, useRef } from "react"
import { MicIcon, SearchIcon, User, FileBox } from "lucide-react"
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

import Logo from "@/components/logo"
import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Btn09 from "@/components/mvpblocks/btn-gradient1";
import { useUser } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";
import RippleWaveLoader from "@/components/mvpblocks/ripple-loader";

export default function Component() {
  const id = useId()
  const { isSignedIn } = useUser();
  const router = useRouter()
  const pathname = usePathname()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [isListening, setIsListening] = useState(false)
  const searchRef = useRef(null)
  const recognitionRef = useRef(null)

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setSearchQuery(transcript)
          setIsListening(false)
        }

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  // Stop loading when pathname changes (page loaded)
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

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
    const searchTerm = query.trim()

    console.log('Searching:', { query, searchTerm })

    try {
      // Search both users and posts simultaneously
      const [usersResponse, postsResponse] = await Promise.all([
        fetch(`/api/search/users?q=${encodeURIComponent(searchTerm)}`),
        fetch(`/api/search/posts?q=${encodeURIComponent(searchTerm)}`)
      ])

      const users = await usersResponse.json()
      const posts = await postsResponse.json()

      console.log('Search results:', { users, posts })
      setSearchResults({ users, posts })
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults({ users: [], posts: [] })
    } finally {
      setIsSearching(false)
    }
  }

  const addToSearchHistory = (item) => {
    const newHistory = [
      item,
      ...searchHistory.filter(h => h.path !== item.path)
    ].slice(0, 10) // Keep only last 10 items

    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice search is not supported in your browser. Please try Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error('Error starting voice recognition:', error)
      }
    }
  }

  const handleResultClick = (path, title, type) => {
    // Add to search history
    addToSearchHistory({ path, title, type, timestamp: Date.now() })
    
    setIsNavigating(true)
    setShowResults(false)
    setSearchQuery('')
    router.push(path)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Navigate to first result (prioritize users, then posts)
      if (searchResults.users.length > 0) {
        const firstUser = searchResults.users[0]
        const path = `/${firstUser.profile?.slug || firstUser.username}`
        handleResultClick(path, `@${firstUser.username}`, 'user')
      } else if (searchResults.posts.length > 0) {
        const firstPost = searchResults.posts[0]
        const path = `/p/${firstPost.slug}`
        handleResultClick(path, firstPost.title, 'post')
      }
    } else if (e.key === 'Escape') {
      setShowResults(false)
    }
  }

  return (
    <>
      {/* Loading Overlay */}
      {isNavigating && <RippleWaveLoader />}

      <header className="fixed top-0 left-0 w-full z-[201] border-b px-2 md:px-6 bg-background/80 backdrop-blur">
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
        <div className="grow min-w-0" ref={searchRef}>
          {/* Search form */}
          <div className="relative mx-auto w-full max-w-[120px] sm:max-w-[180px] md:max-w-xs">
            <Input 
              id={id} 
              className="peer h-7 px-6 text-xs md:h-8 md:px-8 md:text-base" 
              placeholder="Search users or posts" 
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowResults(true)}
            />
            <div
              className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <button
              onClick={handleVoiceSearch}
              className={`absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-all outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${
                isListening 
                  ? 'text-red-500 animate-pulse' 
                  : 'text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50'
              }`}
              aria-label={isListening ? "Stop recording" : "Press to speak"}
              type="button">
              <MicIcon size={16} aria-hidden="true" />
            </button>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 w-[90vw] max-w-md">
                {/* Search History - shown when no query */}
                {!searchQuery.trim() && searchHistory.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="text-xs font-semibold text-muted-foreground">Recent Searches</div>
                      <button 
                        onClick={clearSearchHistory}
                        className="text-xs text-primary hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleResultClick(item.path, item.title, item.type)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-md transition text-left"
                      >
                        {item.type === 'user' ? (
                          <User className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <FileBox className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{item.title}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Loading State */}
                {searchQuery.trim() && isSearching && (
                  <div className="p-4 text-center text-muted-foreground">Searching...</div>
                )}

                {/* Users Results */}
                {!isSearching && searchResults.users.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Users
                    </div>
                    {searchResults.users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleResultClick(
                          `/${user.profile?.slug || user.username}`,
                          `@${user.username}`,
                          'user'
                        )}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-md transition text-left"
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
                          <div className="font-medium">@{user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.profile?.bio || 'No bio'}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Posts Results */}
                {!isSearching && searchResults.posts.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <FileBox className="h-4 w-4" />
                      Posts
                    </div>
                    {searchResults.posts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => handleResultClick(
                          `/p/${post.slug}`,
                          post.title,
                          'post'
                        )}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-md transition text-left"
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
                          <div className="font-medium truncate">{post.title}</div>
                          <div className="text-sm text-muted-foreground truncate">{post.caption || 'No description'}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!isSearching && searchResults.users.length === 0 && searchResults.posts.length === 0 && searchQuery.trim().length > 0 && (
                  <div className="p-4 text-center text-muted-foreground">No results found</div>
                )}
              </div>
            )}
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
    </header>
    </>
  );
}
