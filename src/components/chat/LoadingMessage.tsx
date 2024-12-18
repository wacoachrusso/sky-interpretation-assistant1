import React from 'react'

export function LoadingMessage() {
  return (
    <div className="px-4 py-6 bg-[#444654]">
      <div className="max-w-3xl mx-auto flex gap-2 sm:gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#9b87f5]">
          AI
        </div>
        <div className="flex-1">
          <div className="text-[#ECECF1] animate-pulse">
            Searching the contract
            <span className="inline-flex w-5">
              <span className="animate-[ellipsis_1s_0s_infinite]">.</span>
              <span className="animate-[ellipsis_1s_0.2s_infinite]">.</span>
              <span className="animate-[ellipsis_1s_0.4s_infinite]">.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}