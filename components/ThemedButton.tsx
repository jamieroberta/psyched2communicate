'use client'

import { useState } from 'react'

interface ThemedButtonProps {
  href: string
  variant: 'primary' | 'secondary'
  colors: {
    primary: string
    gradient: string
    border: string
  }
  children: React.ReactNode
  icon?: React.ReactNode
}

export default function ThemedButton({ href, variant, colors, children, icon }: ThemedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (variant === 'primary') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium transform hover:-translate-y-0.5"
        style={{ 
          background: colors.gradient,
          boxShadow: `0 4px 14px 0 ${colors.border}`
        }}
      >
        {icon}
        {children}
      </a>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 border-2 rounded-lg transition-all duration-300 font-medium transform hover:-translate-y-0.5"
      style={{ 
        borderColor: colors.primary,
        color: isHovered ? 'white' : colors.primary,
        background: isHovered ? colors.primary : 'white'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon}
      {children}
    </a>
  )
}
