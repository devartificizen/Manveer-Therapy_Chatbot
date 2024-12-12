'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoArrowBack } from 'react-icons/io5'
import { useRouter } from 'next/navigation'

function BreathingExercise() {
  const router = useRouter()
  const [duration, setDuration] = useState(3) // default 3 minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isActive, setIsActive] = useState(false)
  const [ballColor, setBallColor] = useState('rgb(132,181,255)') // default blue
  const [instruction, setInstruction] = useState('Press Start')
  const isInhaling = useRef(true)

  const colors = [
    { name: 'Blue', value: 'rgb(132,181,255)' },
    { name: 'Purple', value: 'rgb(167,139,250)' },
    { name: 'Green', value: 'rgb(110,231,183)' },
    { name: 'Pink', value: 'rgb(249,168,212)' }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      // Timer countdown
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      setInstruction('Session Complete! You must be feeling better.')
    } else if (!isActive) {
      if (timeLeft === duration * 60) {
        setInstruction('Press Start')
      } else {
        setInstruction('Session Paused.')
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, duration])

  useEffect(() => {
    let breathingInterval: NodeJS.Timeout | null = null

    if (isActive) {
      isInhaling.current = true
      setInstruction('Inhale...')

      breathingInterval = setInterval(() => {
        isInhaling.current = !isInhaling.current
        setInstruction(isInhaling.current ? 'Inhale...' : 'Exhale...')
      }, 6000)
    }

    return () => {
      if (breathingInterval) clearInterval(breathingInterval)
    }
  }, [isActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center relative">
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <button 
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoArrowBack size={24} />
          </button>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center flex-1 p-4">
      <h1 className='mb-8 font-bold'>Breathe in when the circle grows, and breathe out when it shrinks!</h1>
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={duration}
              onChange={(e) => {
                const value = Math.min(Math.max(parseInt(e.target.value), 1), 5) // Limit between 1-5
                setDuration(value)
                if (!isActive) setTimeLeft(value * 60)
              }}
              className="w-20 px-3 py-2 border rounded-lg"
              min="1"
              max="5"
            />
            <button
              onClick={() => {
                setIsActive(!isActive)
                if (!isActive) setTimeLeft(duration * 60)
              }}
              className="px-6 py-2 bg-[rgb(132,181,255)] text-white rounded-lg hover:bg-blue-600"
            >
              {isActive ? 'Pause' : 'Start'}
            </button>
          </div>
          <div className="text-2xl text-center rounded-full border  bg-blue-50 font-bold">{formatTime(timeLeft)}</div>
          <div className="flex gap-2">
            {colors.map(color => (
              <button
                key={color.name}
                onClick={() => setBallColor(color.value)}
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>

        <div className="text-xl mb-12">{instruction}</div>

        <AnimatePresence>
          <motion.div
            animate={{
              scale: isActive ? [1, 1.5, 1] : 1,
              opacity: isActive ? [0.5, 1, 0.5] : 0.5,
            }}
            transition={{
              duration: 12,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut",
              repeatDelay: 0
            }}
            initial={{
              scale: 1,
              opacity: 0.5
            }}
            className="rounded-full relative"
            style={{ backgroundColor: ballColor }}
          >
            <div className="w-36 h-36 rounded-full  blur-xl" />
            <div className="w-36 h-36 rounded-full  absolute inset-0" 
                 style={{ backgroundColor: ballColor, opacity: 0.7 }} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BreathingExercise
