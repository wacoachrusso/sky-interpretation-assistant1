import React from 'react'
import { ImageIcon, HelpCircle, Eye, FileText, MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'

export function ChatActions() {
  return (
    <div className="flex justify-center gap-2 mt-4">
      <Button variant="ghost" className="text-[#8E8EA0] hover:bg-[#2D2D30] gap-2">
        <ImageIcon className="w-4 h-4" />
        Create image
      </Button>
      <Button variant="ghost" className="text-[#8E8EA0] hover:bg-[#2D2D30] gap-2">
        <HelpCircle className="w-4 h-4" />
        Get advice
      </Button>
      <Button variant="ghost" className="text-[#8E8EA0] hover:bg-[#2D2D30] gap-2">
        <Eye className="w-4 h-4" />
        Analyze images
      </Button>
      <Button variant="ghost" className="text-[#8E8EA0] hover:bg-[#2D2D30] gap-2">
        <FileText className="w-4 h-4" />
        Summarize text
      </Button>
      <Button variant="ghost" className="text-[#8E8EA0] hover:bg-[#2D2D30]">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </div>
  )
}