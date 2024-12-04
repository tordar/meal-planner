import React from 'react'

interface TextWithLinksProps {
    text: string;
}

export function TextWithLinks({ text }: TextWithLinksProps) {
    if (!text) return null;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
        <span className="inline whitespace-pre-wrap">
      {parts.map((part, index) => {
          if (part.match(urlRegex)) {
              return (
                  <a
                      key={index}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all inline-break"
                  >
                      {part}
                  </a>
              );
          }
          return <span key={index} className="break-words">{part}</span>;
      })}
    </span>
    );
}