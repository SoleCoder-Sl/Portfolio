# Sidebar Component Usage

## Basic Usage

The Sidebar component is fully responsive and includes mobile overlay functionality.

### In your Layout or Page

```tsx
'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        onMobileClose={() => setIsMobileOpen(false)} 
      />
      <main className="flex-1 lg:ml-0">
        {children}
      </main>
    </div>
  )
}
```

### With a Header/Hamburger Menu

Create a Header component with a hamburger icon to control the mobile sidebar:

```tsx
'use client'

import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm p-4">
      <button onClick={onMenuClick} className="p-2">
        <Menu className="w-6 h-6" />
      </button>
    </header>
  )
}
```

## Features

✅ **Desktop Expanded**: 240px width, shows icons and labels
✅ **Desktop Collapsed**: 80px width, icons only
✅ **Mobile Overlay**: Full-screen overlay with backdrop
✅ **Active States**: Automatically highlights current route
✅ **Income Accordion**: Expandable dropdown menu
✅ **Gradient Background**: Custom gradient with noise texture
✅ **Bottom Sections**: CTA block and user profile
✅ **Responsive**: Adapts perfectly to all screen sizes

## Navigation Items

Update the navigation items in `components/Sidebar.tsx`:

- `mainNavItems`: Top navigation items
- `incomeItems`: Nested items under Income
- `bottomNavItems`: Settings and other bottom items

## Styling

The sidebar uses:
- Custom gradient class: `.bg-custom-gradient` (defined in `globals.css`)
- Tailwind CSS for responsive utilities
- Lucide React icons

