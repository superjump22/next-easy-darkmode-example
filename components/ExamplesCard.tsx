'use client'

import type { DarkModeTransition } from 'next-easy-darkmode'
import { useDarkMode } from 'next-easy-darkmode'
import * as React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

// Types for transition options
type TransitionTypeValue = 'none' | 'default' | 'circular-reveal' | 'custom'
type CircularMode = 'ref' | 'random'
type CustomMode = 'push' | 'zoom' | 'dissolve' | 'wipe'

// Predefined custom animations
const customAnimations = {
  // Push effect (like Premiere's "Push" transition)
  push: {
    old: {
      keyframes: [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: 'translateX(-100%)', opacity: 1 },
      ] as Keyframe[],
      options: { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    },
    new: {
      keyframes: [
        { transform: 'translateX(100%)', opacity: 1 },
        { transform: 'translateX(0)', opacity: 1 },
      ] as Keyframe[],
      options: { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    },
  },
  // Zoom effect (like Premiere's "Cross Zoom" transition)
  zoom: {
    old: {
      keyframes: [
        { transform: 'scale(1) rotate(0deg)', opacity: 1 },
        { transform: 'scale(2) rotate(5deg)', opacity: 0 },
      ] as Keyframe[],
      options: { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    },
    new: {
      keyframes: [
        { transform: 'scale(0.5) rotate(-5deg)', opacity: 0 },
        { transform: 'scale(1) rotate(0deg)', opacity: 1 },
      ] as Keyframe[],
      options: { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    },
  },
  // Dissolve effect (like Premiere's "Film Dissolve" transition)
  dissolve: {
    css: `
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 800ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        mix-blend-mode: plus-lighter;
      }

      ::view-transition-old(root) {
        animation: dissolve-out 800ms forwards;
      }
      
      ::view-transition-new(root) {
        animation: dissolve-in 800ms forwards;
      }
      
      @keyframes dissolve-out {
        from { 
          opacity: 1;
          filter: brightness(1) contrast(1);
        }
        50% { 
          opacity: 0.5;
          filter: brightness(1.2) contrast(0.8);
        }
        to { 
          opacity: 0;
          filter: brightness(1.5) contrast(0.5);
        }
      }
      
      @keyframes dissolve-in {
        from { 
          opacity: 0;
          filter: brightness(1.5) contrast(0.5);
        }
        50% { 
          opacity: 0.5;
          filter: brightness(1.2) contrast(0.8);
        }
        to { 
          opacity: 1;
          filter: brightness(1) contrast(1);
        }
      }
    `,
  },
  // Wipe effect (like Premiere's "Linear Wipe" transition)
  wipe: {
    css: `
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        animation-duration: 500ms;
      }

      ::view-transition-old(root) {
        animation-name: wipe-out;
      }
      
      ::view-transition-new(root) {
        animation-name: wipe-in;
      }
      
      @keyframes wipe-out {
        from { 
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
        to { 
          clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
        }
      }
      
      @keyframes wipe-in {
        from { 
          clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
        }
        to { 
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      }
    `,
  },
} as const

export function ExamplesCard() {
  // Refs for circular reveal from button positions
  const toggleRef = React.useRef<HTMLButtonElement>(null)
  const darkRef = React.useRef<HTMLButtonElement>(null)
  const lightRef = React.useRef<HTMLButtonElement>(null)
  const systemRef = React.useRef<HTMLButtonElement>(null)

  // State for transition options
  const [transitionType, setTransitionType] = React.useState<TransitionTypeValue>('default')
  const [circularMode, setCircularMode] = React.useState<CircularMode>('ref')
  const [customMode, setCustomMode] = React.useState<CustomMode>('push')

  // Get transition configuration based on selected options
  const getTransitionConfig = (): DarkModeTransition => {
    switch (transitionType) {
      case 'none':
        return { type: 'none' }
      case 'default':
        return { type: 'default' }
      case 'circular-reveal':
        return {
          type: 'circular-reveal',
          center: circularMode === 'ref'
            ? { ref: toggleRef }
            : {
                // Random position within the middle 60% of the viewport
                x: (Math.random() * 0.6 + 0.2) * window.innerWidth,
                y: (Math.random() * 0.6 + 0.2) * window.innerHeight,
              },
          duration: 300,
          easing: 'ease-out',
        }
      case 'custom':
        return {
          type: 'custom',
          ...customAnimations[customMode],
        }
      default:
        return { type: 'default' }
    }
  }

  // Use dark mode hook with selected transition
  const { toggle, enable, disable, system } = useDarkMode(getTransitionConfig())

  // Separate hooks for button-specific circular reveals
  const refActions = {
    toggle: useDarkMode({ type: 'circular-reveal', center: { ref: toggleRef } }).toggle,
    enable: useDarkMode({ type: 'circular-reveal', center: { ref: darkRef } }).enable,
    disable: useDarkMode({ type: 'circular-reveal', center: { ref: lightRef } }).disable,
    system: useDarkMode({ type: 'circular-reveal', center: { ref: systemRef } }).system,
  }

  // Handle theme actions with appropriate transition
  const handleAction = (action: keyof typeof refActions) => {
    if (transitionType === 'circular-reveal' && circularMode === 'ref') {
      refActions[action]()
    }
    else {
      const baseAction = { toggle, enable, disable, system }[action]
      baseAction()
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Dark Mode Transitions Demo</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <Label className="text-lg block mb-2">Transition Effect</Label>
          <Select
            value={transitionType}
            onValueChange={value => setTransitionType(value as TransitionTypeValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default (Fade)</SelectItem>
              <SelectItem value="circular-reveal">Circular Reveal</SelectItem>
              <SelectItem value="custom">Custom Animation</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {transitionType === 'circular-reveal' && (
          <div>
            <Label className="text-lg block mb-2">Reveal From</Label>
            <RadioGroup
              value={circularMode}
              onValueChange={value => setCircularMode(value as CircularMode)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ref" id="ref" />
                <Label className="text-md" htmlFor="ref">Button Center</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="random" id="random" />
                <Label className="text-md" htmlFor="random">Random Position</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {transitionType === 'custom' && (
          <div>
            <Label className="text-lg block mb-2">Transition Effect</Label>
            <RadioGroup
              value={customMode}
              onValueChange={value => setCustomMode(value as CustomMode)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="push" id="push" />
                <Label className="text-md" htmlFor="push">Push</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zoom" id="zoom" />
                <Label className="text-md" htmlFor="zoom">Cross Zoom</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dissolve" id="dissolve" />
                <Label className="text-md" htmlFor="dissolve">Film Dissolve</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wipe" id="wipe" />
                <Label className="text-md" htmlFor="wipe">Linear Wipe</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            ref={toggleRef}
            onClick={() => handleAction('toggle')}
            variant="outline"
            size="lg"
          >
            Toggle Theme
          </Button>
          <Button
            ref={darkRef}
            onClick={() => handleAction('enable')}
            variant="outline"
            size="lg"
          >
            Dark
          </Button>
          <Button
            ref={lightRef}
            onClick={() => handleAction('disable')}
            variant="outline"
            size="lg"
          >
            Light
          </Button>
          <Button
            ref={systemRef}
            onClick={() => handleAction('system')}
            variant="outline"
            size="lg"
          >
            System
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
