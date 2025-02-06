'use client'

import type { TransitionType } from 'next-easy-darkmode'
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

// Types for transition options and modes
type TransitionTypeValue = 'none' | 'fade' | 'circular-reveal' | 'custom'
type CircularMode = 'ref' | 'random'
type CustomMode = 'slide' | 'diamond'

// Predefined clip-path animations for custom transitions
const customTransitions = {
  slide: {
    from: 'inset(0 0 100% 0)',
    to: 'inset(0)',
  },
  diamond: {
    from: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    to: 'polygon(-50% 50%, 50% -50%, 150% 50%, 50% 150%)',
  },
} as const

export function ExamplesCard() {
  // Refs for circular reveal from button positions
  const toggleRef = React.useRef<HTMLButtonElement>(null)
  const darkRef = React.useRef<HTMLButtonElement>(null)
  const lightRef = React.useRef<HTMLButtonElement>(null)
  const systemRef = React.useRef<HTMLButtonElement>(null)

  // State for transition options
  const [transitionType, setTransitionType] = React.useState<TransitionTypeValue>('fade')
  const [circularMode, setCircularMode] = React.useState<CircularMode>('ref')
  const [customMode, setCustomMode] = React.useState<CustomMode>('slide')

  // Get transition configuration based on selected options
  const getTransitionConfig = (): TransitionType => {
    switch (transitionType) {
      case 'none':
        return { type: 'none' }
      case 'fade':
        return { type: 'fade' }
      case 'circular-reveal':
        return {
          type: 'circular-reveal',
          // Random position within the middle 60% of the viewport
          center: {
            x: (Math.random() * 0.6 + 0.2) * window.innerWidth,
            y: (Math.random() * 0.6 + 0.2) * window.innerHeight,
          },
        }
      case 'custom':
        return {
          type: 'custom',
          clipPath: customTransitions[customMode],
        }
    }
  }

  // Main theme hook with selected transition
  const { toggle, enable, disable, system } = useDarkMode({
    transition: getTransitionConfig(),
    duration: 500,
    easing: 'ease-in-out',
  })

  // Separate hooks for button-specific circular reveals
  const refActions = {
    toggle: useDarkMode({ transition: { type: 'circular-reveal', center: { ref: toggleRef } } }).toggle,
    enable: useDarkMode({ transition: { type: 'circular-reveal', center: { ref: darkRef } } }).enable,
    disable: useDarkMode({ transition: { type: 'circular-reveal', center: { ref: lightRef } } }).disable,
    system: useDarkMode({ transition: { type: 'circular-reveal', center: { ref: systemRef } } }).system,
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
        <CardTitle className="text-center text-2xl">Easy Dark Mode Demo</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <Label className="text-lg block mb-2">Transition Effect</Label>
          <Select
            value={transitionType}
            onValueChange={value => setTransitionType(value as TransitionTypeValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transition type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fade">Fade</SelectItem>
              <SelectItem value="circular-reveal">Circular Reveal</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {transitionType === 'circular-reveal' && (
          <div>
            <Label className="text-lg block mb-2">Circular Reveal Mode</Label>
            <RadioGroup
              value={circularMode}
              onValueChange={value => setCircularMode(value as CircularMode)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ref" id="ref" />
                <Label className="text-md" htmlFor="ref">From Button</Label>
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
            <Label className="text-lg block mb-2">Custom Animation</Label>
            <RadioGroup
              className="space-y-3"
              value={customMode}
              onValueChange={value => setCustomMode(value as CustomMode)}
            >
              {Object.entries(customTransitions).map(([key, _]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {' '}
                    expand
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <Button
            ref={toggleRef}
            onClick={() => handleAction('toggle')}
            variant="outline"
          >
            Toggle Theme
          </Button>
          <Button
            ref={darkRef}
            onClick={() => handleAction('enable')}
            variant="outline"
          >
            Dark
          </Button>
          <Button
            ref={lightRef}
            onClick={() => handleAction('disable')}
            variant="outline"
          >
            Light
          </Button>
          <Button
            ref={systemRef}
            onClick={() => handleAction('system')}
            variant="outline"
          >
            System
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
