import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const MAX_TITLE_LENGTH = 75

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTitleFromContent(content: string): string {
  try {
    // Remove any markdown formatting
    let title = content.replace(/[#*`_~]/g, '');
  
    // Get first line or sentence, prioritizing complete sentences
    const sentences = title.split(/[.!?]|\n/);
    title = sentences[0].trim();
  
    // If first sentence is too short, try to include more context
    if (title.length < 20 && sentences.length > 1) {
      title = sentences.slice(0, 2).join('. ').trim();
    }
  
    // Remove extra whitespace
    title = title.replace(/\s+/g, ' ');
  
    // Truncate if too long, trying to break at word boundaries
    if (title.length > MAX_TITLE_LENGTH) {
      const truncated = title.slice(0, MAX_TITLE_LENGTH - 3);
      const lastSpace = truncated.lastIndexOf(' ');
      title = truncated.slice(0, lastSpace) + '...';
    }
    
    return title || 'New Chat';
  } catch (error) {
    console.error('Error generating title:', error);
    return 'New Chat';
  }
}
