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

type TransitionTypeValue = 'none' | 'fade' | 'circular-reveal' | 'custom'
type CircularMode = 'ref' | 'random'
type CustomMode = 'slide' | 'diamond' | 'ellipse'

export function ExamplesCard() {
  const toggleRef = React.useRef<HTMLButtonElement>(null)
  const darkRef = React.useRef<HTMLButtonElement>(null)
  const lightRef = React.useRef<HTMLButtonElement>(null)
  const systemRef = React.useRef<HTMLButtonElement>(null)
  const [transitionType, setTransitionType] = React.useState<TransitionTypeValue>('fade')
  const [circularMode, setCircularMode] = React.useState<CircularMode>('ref')
  const [customMode, setCustomMode] = React.useState<CustomMode>('slide')

  const getTransitionConfig = (): TransitionType => {
    if (transitionType === 'none') {
      return { type: 'none' }
    }

    if (transitionType === 'fade') {
      return { type: 'fade' }
    }

    if (transitionType === 'circular-reveal') {
      return {
        type: 'circular-reveal',
        center: { x: (Math.random() * 0.6 + 0.2) * window.innerWidth, y: (Math.random() * 0.6 + 0.2) * window.innerHeight },
      }
    }

    // Custom transitions from documentation
    const customTransitions = {
      slide: {
        from: 'inset(0 0 100% 0)',
        to: 'inset(0)',
      },
      diamond: {
        from: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
        to: 'polygon(-50% 50%, 50% -50%, 150% 50%, 50% 150%)',
      },
      ellipse: {
        from: 'ellipse(0% 0% at 50% 50%)',
        to: 'ellipse(150% 75% at 50% 50%)',
      },
    }

    return {
      type: 'custom',
      clipPath: customTransitions[customMode],
    }
  }

  const { isDarkMode, toggle, enable, disable, system } = useDarkMode({
    transition: getTransitionConfig(),
    duration: 500,
    easing: 'ease-in-out',
  })

  const { toggle: refToggle } = useDarkMode({
    transition: { type: 'circular-reveal', center: { ref: toggleRef } },
  })

  const { enable: refEnable } = useDarkMode({
    transition: { type: 'circular-reveal', center: { ref: darkRef } },
  })

  const { disable: refDisable } = useDarkMode({
    transition: { type: 'circular-reveal', center: { ref: lightRef } },
  })

  const { system: refSystem } = useDarkMode({
    transition: { type: 'circular-reveal', center: { ref: systemRef } },
  })

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
            <RadioGroup value={circularMode} onValueChange={value => setCircularMode(value as CircularMode)}>
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
          <div className="space-y-6">
            <Label className="block">Custom Animation</Label>
            <RadioGroup className="space-y-3" value={customMode} onValueChange={value => setCustomMode(value as CustomMode)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="slide" id="slide" />
                <Label htmlFor="slide">Slide from top</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="diamond" id="diamond" />
                <Label htmlFor="diamond">Diamond expand</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ellipse" id="ellipse" />
                <Label htmlFor="ellipse">Ellipse expand</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <Button
            ref={toggleRef}
            onClick={() => {
              if (transitionType === 'circular-reveal' && circularMode === 'ref') {
                refToggle()
              }
              else {
                toggle()
              }
            }}
            variant="outline"
          >
            {isDarkMode ? '🌞' : '🌙'}
            {' '}
            Toggle Theme
          </Button>
          <Button
            ref={darkRef}
            onClick={() => {
              if (transitionType === 'circular-reveal' && circularMode === 'ref') {
                refEnable()
              }
              else {
                enable()
              }
            }}
            variant="outline"
          >
            Dark
          </Button>
          <Button
            ref={lightRef}
            onClick={() => {
              if (transitionType === 'circular-reveal' && circularMode === 'ref') {
                refDisable()
              }
              else {
                disable()
              }
            }}
            variant="outline"
          >
            Light
          </Button>
          <Button
            ref={systemRef}
            onClick={() => {
              if (transitionType === 'circular-reveal' && circularMode === 'ref') {
                refSystem()
              }
              else {
                system()
              }
            }}
            variant="outline"
          >
            System
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
