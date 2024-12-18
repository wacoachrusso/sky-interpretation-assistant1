import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TypewriterMarkdownProps {
  content: string;
  speed?: number;
  instant?: boolean;
  contractReferenceClassName?: string;
  onComplete?: () => void;
}

export function TypewriterMarkdown({ 
  content, 
  speed = 20, 
  instant = false, 
  contractReferenceClassName,
  onComplete 
}: TypewriterMarkdownProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const typeText = useCallback(() => {
    if (instant) {
      setDisplayedText(content);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    let currentIndex = 0;
    const chunkSize = 4; // Number of characters to add per tick
    const effectiveSpeed = Math.max(1, speed / 4); // Faster speed

    const typeChunk = () => {
      if (currentIndex < content.length) {
        const chunk = content.slice(
          currentIndex,
          currentIndex + chunkSize
        );
        setDisplayedText(prev => prev + chunk);
        currentIndex += chunkSize;
        setTimeout(typeChunk, effectiveSpeed);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    typeChunk();
  }, [content, speed, instant, onComplete]);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    typeText();
  }, [content, typeText]);

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      className="max-w-full overflow-hidden"
      components={{
        code: ({ node, inline, className, children, ...props }) => {
          if (!inline && className?.includes('contract-reference')) {
            return (
              <div className={`${contractReferenceClassName} max-w-full`}>
                {String(children).replace(/\n$/, '')}
              </div>
            )
          }
          return <code className="bg-gray-800 px-1 py-0.5 rounded text-sm break-words" {...props}>{children}</code>
        },
        table: props => (
          <div className="overflow-x-auto my-1 max-w-full">
            <table className="border-collapse border border-gray-600 w-full text-left" {...props} />
          </div>
        ),
        th: props => <th className="border border-gray-600 px-2 py-1 bg-gray-800 text-sm font-semibold" {...props} />,
        td: props => <td className="border border-gray-600 px-2 py-1 text-sm whitespace-normal" {...props} />,
        p: props => <p className="mb-2 leading-relaxed break-words" {...props} />,
        ul: props => <ul className="mb-1 list-disc pl-4" {...props} />,
        ol: props => <ol className="mb-1 list-decimal pl-4" {...props} />,
        li: props => <li className="mb-0.5" {...props} />,
        h2: props => <h2 className="text-lg font-semibold mb-2 mt-3" {...props} />,
        h3: props => <h3 className="text-base font-semibold mb-2 mt-3" {...props} />,
        pre: props => <pre className="bg-gray-800 p-2 rounded-lg my-2 overflow-x-auto max-w-full whitespace-pre-wrap" {...props} />
      }}
    >
      {displayedText}
    </ReactMarkdown>
  );
}