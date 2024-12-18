import React from 'react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-semibold text-white mb-4">Know the contract</h1>
      <p className="text-lg text-[#8E8EA0] text-center mb-8">
        Ask me anything about your contract and I'll help you understand it.
      </p>
      <div className="absolute bottom-4 text-center text-sm text-[#8E8EA0]">
        SkyGuide can make mistakes. Consider checking important information.
      </div>
    </div>
  )
}