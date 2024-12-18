import React from 'react'
import { ChatActions } from './ChatActions'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-semibold text-white mb-8">Know the contract</h1>
      <div className="w-full">
        <div className="relative">
          <div className="h-14 bg-[#40414F] rounded-lg w-full flex items-center px-4 text-[#8E8EA0]">
            Message SkyGuide
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <button className="p-1 hover:bg-[#2D2D30] rounded">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#8E8EA0]">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.5 3H3v3.5h3.5V3zM3 1.5h3.5a1.5 1.5 0 0 1 1.5 1.5v3.5a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 6.5V3A1.5 1.5 0 0 1 3 1.5zm17.5 1.5H17v3.5h3.5V3zM17 1.5h3.5A1.5 1.5 0 0 1 22 3v3.5a1.5 1.5 0 0 1-1.5 1.5H17a1.5 1.5 0 0 1-1.5-1.5V3a1.5 1.5 0 0 1 1.5-1.5zM6.5 17H3v3.5h3.5V17zM3 15.5h3.5a1.5 1.5 0 0 1 1.5 1.5v3.5a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 20.5V17a1.5 1.5 0 0 1 1.5-1.5zm17.5 1.5H17v3.5h3.5V17zM17 15.5h3.5a1.5 1.5 0 0 1 1.5 1.5v3.5a1.5 1.5 0 0 1-1.5 1.5H17a1.5 1.5 0 0 1-1.5-1.5V17a1.5 1.5 0 0 1 1.5-1.5z" fill="currentColor"/>
              </svg>
            </button>
            <button className="p-1 hover:bg-[#2D2D30] rounded">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#8E8EA0]">
                <path d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"/>
              </svg>
            </button>
            <button className="p-1 hover:bg-[#2D2D30] rounded">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#8E8EA0]">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12S6.201 22.5 12 22.5 22.5 17.799 22.5 12 17.799 1.5 12 1.5zM0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12z M13.5 16.5h-3v-3h3v3zM13.5 12h-3V6h3v6z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        <ChatActions />
      </div>
      <div className="absolute bottom-4 text-center text-sm text-[#8E8EA0]">
        SkyGuide can make mistakes. Consider checking important information.
      </div>
    </div>
  )
}