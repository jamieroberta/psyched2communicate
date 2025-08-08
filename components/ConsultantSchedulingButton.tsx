'use client'

import { useState } from 'react'

interface ConsultantSchedulingButtonProps {
  href: string
  colors: {
    primary: string
  }
}

export default function ConsultantSchedulingButton({ href, colors }: ConsultantSchedulingButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 border-2 rounded-lg transition-all duration-300 font-medium text-sm transform hover:-translate-y-0.5 hover:shadow-md"
      style={{ 
        borderColor: colors.primary,
        color: isHovered ? 'white' : colors.primary,
        background: isHovered ? colors.primary : 'white'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M7 21h10a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v11a2 2 0 002 2z" />
      </svg>
      Schedule Appointment
    </a>
  )
}
