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
type CustomMode = 'push' | 'zoom' | 'dissolve' | 'wipe' | 'morph' | 'shutter' | 'flip' | 'glitch'

// Predefined custom animations
const customAnimations = {
  // Push effect (like Premiere's "Push" transition)
  push: {
    old: {
      keyframes: [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: 'translateX(-100%)', opacity: 1 },
      ] as Keyframe[],
      options: { duration: 800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    },
    new: {
      keyframes: [
        { transform: 'translateX(100%)', opacity: 1 },
        { transform: 'translateX(0)', opacity: 1 },
      ] as Keyframe[],
      options: { duration: 800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    },
  },
  // Zoom effect (like Premiere's "Cross Zoom" transition)
  zoom: {
    old: {
      keyframes: [
        { transform: 'scale(1) rotate(0deg)', opacity: 1 },
        { transform: 'scale(2) rotate(5deg)', opacity: 0 },
      ] as Keyframe[],
      options: { duration: 1000, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    },
    new: {
      keyframes: [
        { transform: 'scale(0.5) rotate(-5deg)', opacity: 0 },
        { transform: 'scale(1) rotate(0deg)', opacity: 1 },
      ] as Keyframe[],
      options: { duration: 1000, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    },
  },
  // Dissolve effect (like Premiere's "Film Dissolve" transition)
  dissolve: {
    css: `
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 1200ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        mix-blend-mode: plus-lighter;
      }

      ::view-transition-old(root) {
        animation: dissolve-out 1200ms forwards;
      }
      
      ::view-transition-new(root) {
        animation: dissolve-in 1200ms forwards;
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
        animation-duration: 1000ms;
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
  // Morph effect (like morphing shapes)
  morph: {
    css: `
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 1500ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }

      ::view-transition-old(root) {
        animation: morph-out 1500ms forwards;
        transform-origin: center;
      }
      
      ::view-transition-new(root) {
        animation: morph-in 1500ms forwards;
        transform-origin: center;
      }
      
      @keyframes morph-out {
        0% { 
          clip-path: inset(0 0 0 0);
          transform: scale(1);
          filter: brightness(1);
        }
        25% { 
          clip-path: circle(70.7% at 50% 50%);
          transform: scale(0.95);
          filter: brightness(1.1);
        }
        50% { 
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          transform: scale(0.9) rotate(-5deg);
          filter: brightness(1.2);
        }
        75% { 
          clip-path: circle(35.4% at 50% 50%);
          transform: scale(0.85) rotate(-10deg);
          filter: brightness(1.3);
        }
        100% { 
          clip-path: inset(50% 50% 50% 50%);
          transform: scale(0.8) rotate(-15deg);
          filter: brightness(1.4);
        }
      }
      
      @keyframes morph-in {
        0% { 
          clip-path: inset(50% 50% 50% 50%);
          transform: scale(0.8) rotate(15deg);
          filter: brightness(0.6);
        }
        25% { 
          clip-path: circle(35.4% at 50% 50%);
          transform: scale(0.85) rotate(10deg);
          filter: brightness(0.7);
        }
        50% { 
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          transform: scale(0.9) rotate(5deg);
          filter: brightness(0.8);
        }
        75% { 
          clip-path: circle(70.7% at 50% 50%);
          transform: scale(0.95);
          filter: brightness(0.9);
        }
        100% { 
          clip-path: inset(0 0 0 0);
          transform: scale(1);
          filter: brightness(1);
        }
      }
    `,
  },
  // Shutter effect (like camera shutter)
  shutter: {
    css: `
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 1200ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }

      ::view-transition-old(root) {
        animation: shutter-out 1200ms forwards;
      }
      
      ::view-transition-new(root) {
        animation: shutter-in 1200ms forwards;
      }
      
      @keyframes shutter-out {
        0% { 
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
        25% { 
          clip-path: polygon(0 0, 100% 0, 100% 25%, 0 25%);
        }
        50% { 
          clip-path: polygon(0 25%, 100% 25%, 100% 50%, 0 50%);
        }
        75% { 
          clip-path: polygon(0 50%, 100% 50%, 100% 75%, 0 75%);
        }
        100% { 
          clip-path: polygon(0 75%, 100% 75%, 100% 100%, 0 100%);
        }
      }
      
      @keyframes shutter-in {
        0% { 
          clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
        }
        25% { 
          clip-path: polygon(0 0, 100% 0, 100% 25%, 0 25%);
        }
        50% { 
          clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        }
        75% { 
          clip-path: polygon(0 0, 100% 0, 100% 75%, 0 75%);
        }
        100% { 
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      }
    `,
  },
  // 3D Flip effect
  flip: {
    css: `
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 600ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        transform-style: preserve-3d;
        will-change: transform;
        position: absolute;
        width: 100%;
        height: 100%;
      }

      ::view-transition-old(root) {
        animation: flip-out 600ms forwards;
        z-index: 1;
      }
      
      ::view-transition-new(root) {
        animation: flip-in 600ms forwards;
        z-index: 2;
      }
      
      @keyframes flip-out {
        0% { 
          transform: perspective(1000px) rotateY(0deg);
          opacity: 1;
        }
        100% { 
          transform: perspective(1000px) rotateY(-90deg);
          opacity: 0;
        }
      }
      
      @keyframes flip-in {
        0% { 
          transform: perspective(1000px) rotateY(90deg);
          opacity: 0;
        }
        100% { 
          transform: perspective(1000px) rotateY(0deg);
          opacity: 1;
        }
      }

      ::view-transition-group(root) {
        animation: none;
        mix-blend-mode: normal;
      }
    `,
  },
  // Glitch effect
  glitch: {
    css: `
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 800ms;
        animation-timing-function: steps(24, end);
      }

      ::view-transition-old(root) {
        animation: glitch-out 800ms forwards;
        mix-blend-mode: difference;
      }
      
      ::view-transition-new(root) {
        animation: glitch-in 800ms forwards;
        mix-blend-mode: difference;
      }
      
      @keyframes glitch-out {
        0% { 
          clip-path: inset(0 0 0 0);
          transform: translate(0);
          filter: none;
        }
        8% { 
          clip-path: inset(8% -5px 88% 0);
          transform: translate(-4px);
          filter: hue-rotate(90deg);
        }
        16% { 
          clip-path: inset(85% 0 12% 0);
          transform: translate(4px);
          filter: invert(100%);
        }
        24% { 
          clip-path: inset(5% -5px 92% 0);
          transform: translate(-3px);
          filter: saturate(200%);
        }
        32% { 
          clip-path: inset(92% 0 5% 0);
          transform: translate(3px);
          filter: hue-rotate(-90deg);
        }
        40% { 
          clip-path: inset(15% -5px 82% 0);
          transform: translate(-2px);
          filter: brightness(150%);
        }
        48% { 
          clip-path: inset(78% 0 19% 0);
          transform: translate(2px);
          filter: contrast(150%);
        }
        56% { 
          clip-path: inset(25% -5px 72% 0);
          transform: translate(-4px);
          filter: saturate(200%);
        }
        64% { 
          clip-path: inset(65% 0 32% 0);
          transform: translate(4px);
          filter: brightness(200%);
        }
        72% { 
          clip-path: inset(35% -5px 62% 0);
          transform: translate(-3px);
          filter: invert(100%);
        }
        80% { 
          clip-path: inset(55% 0 42% 0);
          transform: translate(3px);
          filter: hue-rotate(180deg);
        }
        88% { 
          clip-path: inset(45% -5px 52% 0);
          transform: translate(-2px);
          filter: brightness(150%);
        }
        96% { 
          clip-path: inset(48% 0 49% 0);
          transform: translate(2px);
          filter: contrast(200%);
        }
        100% { 
          clip-path: inset(100% 0 0 0);
          transform: translate(0);
          filter: none;
        }
      }
      
      @keyframes glitch-in {
        0% { 
          clip-path: inset(100% 0 0 0);
          transform: translate(0);
          filter: none;
        }
        8% { 
          clip-path: inset(82% -5px 15% 0);
          transform: translate(4px);
          filter: brightness(150%);
        }
        16% { 
          clip-path: inset(19% 0 78% 0);
          transform: translate(-4px);
          filter: contrast(150%);
        }
        24% { 
          clip-path: inset(72% -5px 25% 0);
          transform: translate(3px);
          filter: saturate(200%);
        }
        32% { 
          clip-path: inset(32% 0 65% 0);
          transform: translate(-3px);
          filter: hue-rotate(45deg);
        }
        40% { 
          clip-path: inset(62% -5px 35% 0);
          transform: translate(2px);
          filter: invert(80%);
        }
        48% { 
          clip-path: inset(42% 0 55% 0);
          transform: translate(-2px);
          filter: brightness(180%);
        }
        56% { 
          clip-path: inset(52% -5px 45% 0);
          transform: translate(4px);
          filter: contrast(180%);
        }
        64% { 
          clip-path: inset(48% 0 49% 0);
          transform: translate(-4px);
          filter: saturate(180%);
        }
        72% { 
          clip-path: inset(45% -5px 52% 0);
          transform: translate(3px);
          filter: hue-rotate(-45deg);
        }
        80% { 
          clip-path: inset(55% 0 42% 0);
          transform: translate(-3px);
          filter: invert(100%);
        }
        88% { 
          clip-path: inset(35% -5px 62% 0);
          transform: translate(2px);
          filter: brightness(150%);
        }
        96% { 
          clip-path: inset(65% 0 32% 0);
          transform: translate(-2px);
          filter: contrast(200%);
        }
        100% { 
          clip-path: inset(0 0 0 0);
          transform: translate(0);
          filter: none;
        }
      }

      ::view-transition-group(root) {
        animation: none;
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
              className="grid grid-cols-2 gap-4"
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
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="morph" id="morph" />
                <Label className="text-md" htmlFor="morph">Morph</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shutter" id="shutter" />
                <Label className="text-md" htmlFor="shutter">Shutter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flip" id="flip" />
                <Label className="text-md" htmlFor="flip">3D Flip</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="glitch" id="glitch" />
                <Label className="text-md" htmlFor="glitch">Glitch</Label>
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
