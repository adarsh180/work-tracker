'use client';

interface FormattedTextProps {
  text: string | null | undefined;
  className?: string;
}

export default function FormattedText({ text, className = '' }: FormattedTextProps) {
  const formatText = (text: string) => {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      .replace(/#{1,6}\s*(.*?)$/gm, '<h3 class="font-bold text-lg mt-4 mb-2">$1</h3>')
      .replace(/^\s*[-*+]\s+(.*)$/gm, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ 
        __html: `<p class="mb-3">${formatText(text || '')}</p>` 
      }} 
    />
  );
}