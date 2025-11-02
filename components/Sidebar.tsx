'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Home,
  ShoppingBag,
  FolderKanban,
  UserCircle,
  ChevronsLeftRight,
  ChevronDown,
  User,
  X,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface SidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
}

export default function Sidebar({ 
  isMobileOpen = false, 
  onMobileClose,
  isExpanded,
  setIsExpanded
}: SidebarProps) {
  const { isLoggedIn, logout, user } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Auto-expand sidebar when opened on mobile
  useEffect(() => {
    if (isMobileOpen) {
      setIsExpanded(true)
    }
  }, [isMobileOpen, setIsExpanded])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  // Close projects dropdown when collapsing
  useEffect(() => {
    if (!isExpanded) {
      setIsProjectsOpen(false)
    }
  }, [isExpanded])

  const mainNavItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ShoppingBag, label: 'Shop', href: '/shop' },
  ]

  const projectsItems = [
    { label: 'Websites', href: '/projects?tab=websites' },
    { label: 'Apps', href: '/projects?tab=apps' },
    { label: 'Workflows', href: '/projects?tab=workflows' },
  ]

  const bottomNavItems = [
    { icon: UserCircle, label: 'About Me', href: '/about' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  const NavItem = ({ 
    icon: Icon, 
    label, 
    href, 
    onClick 
  }: { 
    icon: typeof Home
    label: string
    href: string
    onClick?: () => void
  }) => {
    const active = isActive(href)
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`
          group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
          ${active 
            ? 'bg-gray-100 text-slate-900 font-semibold' 
            : 'text-slate-700 font-medium hover:bg-gray-100 hover:text-slate-900'
          }
          ${!isExpanded ? 'justify-center px-2' : ''}
        `}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
          active 
            ? 'text-slate-900' 
            : 'text-slate-500 group-hover:text-slate-900'
        }`} />
        {isExpanded && <span className="text-sm">{label}</span>}
      </Link>
    )
  }

  const ProjectsDropdown = () => {
    const active = pathname?.startsWith('/projects')
    return (
      <div 
        className="flex flex-col gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsProjectsOpen(!isProjectsOpen)
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsProjectsOpen(!isProjectsOpen)
          }}
          className={`
            group flex items-center px-4 py-2 rounded-lg transition-all duration-200 touch-manipulation
            ${active 
              ? 'bg-gray-100 text-slate-900 font-semibold' 
              : 'text-slate-700 font-medium hover:bg-gray-100 hover:text-slate-900'
            }
            ${!isExpanded ? 'justify-center px-2' : 'justify-between'}
          `}
        >
          <div className="flex items-center gap-3">
            <FolderKanban className={`w-5 h-5 flex-shrink-0 transition-colors ${
              active 
                ? 'text-slate-900' 
                : 'text-slate-500 group-hover:text-slate-900'
            }`} />
            {(isExpanded || isMobileOpen) && <span className="text-sm">Projects</span>}
          </div>
          {(isExpanded || isMobileOpen) && (
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 text-slate-500 ${
                isProjectsOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </button>
        {(isExpanded || isMobileOpen) && isProjectsOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="ml-4 pl-4 border-l-2 border-gray-200 flex flex-col gap-1"
          >
            {projectsItems.map((item) => {
              // Extract tab value from href (e.g., '/projects?tab=apps' -> 'apps')
              const tabValue = item.href.split('tab=')[1]
              const currentTab = searchParams.get('tab')
              const itemActive = pathname === '/projects' && currentTab === tabValue
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.stopPropagation()
                    // Don't close the dropdown - keep it open
                  }}
                  className={`
                    px-4 py-2 rounded-lg text-sm transition-all duration-200
                    ${itemActive 
                      ? 'bg-gray-100 text-slate-900 font-semibold' 
                      : 'text-slate-700 font-medium hover:bg-gray-100 hover:text-slate-900'
                    }
                  `}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50
          bg-white border-r border-gray-200
          flex flex-col justify-between
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-56' : 'w-16'}
          ${isMobileOpen ? '' : 'hidden lg:flex'}
          ${!isMobileOpen ? 'lg:flex' : ''}
        `}
      >
        {/* Header section */}
        <div className="relative flex items-center justify-between px-4 py-4">
          {/* Close button (Mobile only) */}
          {isMobileOpen && (
            <button
              onClick={onMobileClose}
              className="lg:hidden flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group text-slate-700 font-medium"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
              {isExpanded && <span className="text-sm">Close</span>}
            </button>
          )}

          {/* Toggle Button (Desktop only) - Positioned at right edge */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group absolute -right-4 top-1/2 -translate-y-1/2 z-10"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <ChevronsLeftRight className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-colors" />
          </button>
        </div>

        {/* Top section - Nav */}
        <div className="flex flex-col py-8 overflow-y-auto flex-1">
          {/* Main Navigation */}
          <nav className="flex flex-col gap-2 px-4">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
              />
            ))}
            
            {/* Projects Dropdown */}
            <ProjectsDropdown />

            {/* Bottom Navigation */}
            {bottomNavItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
              />
            ))}
          </nav>
        </div>

        {/* Bottom section - Profile */}
        <div ref={profileRef} className="flex flex-col gap-4 py-8 px-4 relative">
          {/* User Profile - Clickable */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full
              ${!isExpanded ? 'justify-center' : ''}
              ${isProfileOpen ? 'bg-gray-100' : ''}
            `}
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-slate-700 truncate">
                  {isLoggedIn && user
                    ? (user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
                    : 'Guest User'
                  }
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {isLoggedIn && user ? (user.email || '') : 'Sign in to continue'}
                </p>
              </div>
            )}
            {isExpanded && (
              <ChevronDown 
                className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
              />
            )}
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && isExpanded && (
            <div className="absolute bottom-20 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden transform translate-x-4">
              {isLoggedIn ? (
                <>
                  {/* User Details Section */}
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">
                          {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 text-center">
                      <p>Member since {user?.created_at ? new Date(user.created_at).getFullYear() : '2024'}</p>
                    </div>
                  </div>

                  {/* Profile Link */}
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-slate-700 font-medium"
                  >
                    <User className="w-5 h-5 text-slate-500" />
                    <span className="text-sm">Profile</span>
                  </Link>

                  {/* Logout Button - Red */}
                  <button
                    onClick={async () => {
                      await logout()
                      setIsProfileOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 font-medium"
                  >
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Not Logged In */}
                  <div className="p-4">
                    <p className="text-sm text-slate-700 text-center mb-4">
                      Sign in to access your profile
                    </p>
                  </div>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-slate-700 font-medium"
                  >
                    <User className="w-5 h-5 text-slate-500" />
                    <span className="text-sm">Sign In</span>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Dropdown for collapsed state */}
          {isProfileOpen && !isExpanded && (
            <div className="absolute bottom-20 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden w-64 transform translate-x-4">
              {isLoggedIn ? (
                <>
                  {/* User Details Section */}
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">
                          {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 text-center">
                      <p>Member since {user?.created_at ? new Date(user.created_at).getFullYear() : '2024'}</p>
                    </div>
                  </div>

                  {/* Profile Link */}
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-slate-700 font-medium"
                  >
                    <User className="w-5 h-5 text-slate-500" />
                    <span className="text-sm">Profile</span>
                  </Link>

                  {/* Logout Button - Red */}
                  <button
                    onClick={async () => {
                      await logout()
                      setIsProfileOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 font-medium"
                  >
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Not Logged In */}
                  <div className="p-4">
                    <p className="text-sm text-slate-700 text-center mb-4">
                      Sign in to access your profile
                    </p>
                  </div>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-slate-700 font-medium"
                  >
                    <User className="w-5 h-5 text-slate-500" />
                    <span className="text-sm">Sign In</span>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

