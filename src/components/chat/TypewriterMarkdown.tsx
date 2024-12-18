import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TypewriterMarkdownProps {
  content: string;
  speed?: number;
  instant?: boolean;
  onComplete?: () => void;
}

export function TypewriterMarkdown({ content, speed = 20, instant = false, onComplete }: TypewriterMarkdownProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (instant) {
      setDisplayedText(content);
      setCurrentIndex(content.length);
      if (onComplete) {
        onComplete();
      }
      return;
    }

    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, content, speed, onComplete, instant]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [content]);

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        table: props => (
          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-600" {...props} />
          </div>
        ),
        th: props => <th className="border border-gray-600 px-4 py-2 bg-gray-800" {...props} />,
        td: props => <td className="border border-gray-600 px-4 py-2" {...props} />
      }}
    >
      {displayedText}
    </ReactMarkdown>
  );
}