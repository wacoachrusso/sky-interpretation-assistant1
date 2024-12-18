import React from 'react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-semibold text-white mb-8">Know Your Contract</h1>
      <div className="w-full">
        <div className="relative">
          <div className="h-14 bg-[#40414F] rounded-lg w-full flex items-center px-4 text-[#8E8EA0]">
            Ask me anything about your contract and I'll help you understand it...
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 text-center text-sm text-[#8E8EA0]">
        <p>SkyGuide can make mistakes. Consider checking important information.</p>
        <p className="mt-2">💾 Click the download icon to save responses for offline reference.</p>
      </div>
    </div>
  )
}