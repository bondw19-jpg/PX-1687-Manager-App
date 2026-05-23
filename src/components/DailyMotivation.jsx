import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

const ROTATE_INTERVAL_MS = 30_000;

const FALLBACK_QUOTES = [
  { quote: "Every great shift starts with a great attitude. Lead with energy and your team will follow.", author: "— The Panda Way" },
  { quote: "Serve every guest like they're the first guest of the day — that's the Panda difference.", author: "— Panda Wisdom" },
  { quote: "Great operations don't happen by accident. They happen because great leaders show up ready.", author: "— Panda Leadership" },
  { quote: "Your energy sets the tone. Make it a shift everyone remembers for the right reasons.", author: "— The Panda Spirit" },
  { quote: "When you take care of your team, your team takes care of the guests. That's the Panda way.", author: "— Panda Values" },
  { quote: "Consistency is the foundation of excellence. Show up the same way every single shift.", author: "— Panda Excellence" },
  { quote: "A good leader doesn't just manage — they inspire. Be the reason your team gives their best.", author: "— Panda Leadership" },
  { quote: "Every challenge is a chance to grow. The best managers turn hard shifts into great lessons.", author: "— Panda Growth" },
  { quote: "Smile first, lead second. Your team mirrors what you bring to the floor.", author: "— The Panda Spirit" },
  { quote: "Excellence is never an accident — it's the result of high intention and smart effort.", author: "— Panda Excellence" },
];

export default function DailyMotivation() {
  const [index, setIndex] = useState(() => new Date().getDay() % FALLBACK_QUOTES.length);
  const [visible, setVisible] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const timerRef = useRef(null);

  const rotateToIndex = useCallback((nextIdx) => {
    setVisible(false);
    setTimeout(() => {
      setIndex(nextIdx);
      setVisible(true);
    }, 300);
  }, []);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex(prev => {
        const next = (prev + 1) % FALLBACK_QUOTES.length;
        rotateToIndex(next);
        return prev;
      });
    }, ROTATE_INTERVAL_MS);
  }, [rotateToIndex]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const handleRefresh = () => {
    setSpinning(true);
    const next = (index + 1) % FALLBACK_QUOTES.length;
    rotateToIndex(next);
    startTimer();
    setTimeout(() => setSpinning(false), 500);
  };

  const quote = FALLBACK_QUOTES[index];

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
          <Sparkles size={16} className="text-yellow-500" />
          Today's Motivation
        </div>
        <button
          onClick={handleRefresh}
          title="Next quote"
          className="p-1.5 text-gray-400 hover:text-primary rounded-lg transition-colors"
        >
          <RefreshCw size={15} className={spinning ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="p-5 min-h-[96px] flex flex-col justify-center">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          <p className="text-[15px] text-gray-800 leading-relaxed font-medium italic">
            "{quote.quote}"
          </p>
          <p className="text-xs text-gray-400 mt-3 font-semibold">{quote.author}</p>
        </div>
      </div>
    </div>
  );
}
