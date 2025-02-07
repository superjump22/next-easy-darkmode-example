'use client'

import { Moon, Sun } from 'lucide-react'
import { useDarkMode } from 'next-easy-darkmode'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export function ToggleButton() {
  const toggleRef = React.useRef<HTMLButtonElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { toggle } = useDarkMode({ type: 'circular-reveal', center: { ref: toggleRef } })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button ref={toggleRef} variant="outline" size="icon" onClick={toggle}>
        <Skeleton className="h-[1.2rem] w-[1.2rem] rounded-full" />
      </Button>
    )
  }

  return (
    <Button ref={toggleRef} variant="outline" size="icon" onClick={toggle}>
      {resolvedTheme === 'light'
        ? (
            <>
              <Moon className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Switch to Dark Mode</span>
            </>
          )
        : (
            <>
              <Sun className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Switch to Light Mode</span>
            </>
          )}
    </Button>
  )
}
