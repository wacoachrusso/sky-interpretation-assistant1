import * as React from 'react';
const { useState, useEffect } = React;
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
  const effectiveSpeed = speed / 12; // Make typewriter effect even faster

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
      }, effectiveSpeed);

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
          <div className="overflow-x-auto my-1">
            <table className="border-collapse border border-gray-600 w-full text-left mb-1" {...props} />
          </div>
        ),
        th: props => <th className="border border-gray-600 px-3 py-1.5 bg-gray-800 text-sm font-semibold" {...props} />,
        td: props => <td className="border border-gray-600 px-3 py-1.5 text-sm whitespace-normal" {...props} />,
        p: props => <p className="mb-0.5 last:mb-0 leading-relaxed" {...props} />,
        ul: props => <ul className="mb-1 last:mb-0 list-disc pl-4" {...props} />,
        ol: props => <ol className="mb-1 last:mb-0 list-decimal pl-4" {...props} />,
        li: props => <li className="mb-1 last:mb-0" {...props} />,
        h2: props => <h2 className="text-lg font-semibold mb-0.5 mt-1" {...props} />,
        h3: props => <h3 className="text-base font-semibold mb-0.5 mt-1" {...props} />,
        code: props => <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />,
        pre: props => <pre className="bg-gray-800 p-2 rounded-lg my-1 overflow-x-auto" {...props} />
      }}
    >
      {displayedText}
    </ReactMarkdown>
  );
}