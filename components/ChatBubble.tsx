
import React from 'react';

interface ChatBubbleProps {
  question: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ question }) => {
  return (
    <div className="bg-gradient-to-br from-purple-800 to-indigo-800 p-6 rounded-xl rounded-bl-none mb-6 border border-purple-600 shadow-lg relative">
      <p className="text-xl font-medium text-white">{question}</p>
      <div className="absolute left-[-10px] bottom-0 w-0 h-0 border-l-[10px] border-l-transparent border-b-[15px] border-b-indigo-800"></div>
    </div>
  );
};

export default ChatBubble;
