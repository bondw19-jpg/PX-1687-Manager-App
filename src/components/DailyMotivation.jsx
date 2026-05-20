import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

const QUOTE_STORAGE_KEY = 'px_daily_motivation';

const FALLBACK_QUOTES = [
  { quote: "Every great shift starts with a great attitude. Lead with energy and your team will follow.", author: "— The Panda Way" },
  { quote: "Serve every guest like they're the first guest of the day — that's the Panda difference.", author: "— Panda Wisdom" },
  { quote: "Great operations don't happen by accident. They happen because great leaders show up ready.", author: "— Panda Leadership" },
  { quote: "Your energy sets the tone. Make it a shift everyone remembers for the right reasons.", author: "— The Panda Spirit" },
  { quote: "When you take care of your team, your team takes care of the guests. That's the Panda way.", author: "— Panda Values" },
  { quote: "Consistency is the foundation of excellence. Show up the same way every single shift.", author: "— Panda Excellence" },
  { quote: "A good leader doesn't just manage — they inspire. Be the reason your team gives their best.", author: "— Panda Leadership" },
];

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function loadCachedQuote() {
  try {
    const raw = localStorage.getItem(QUOTE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.date === getTodayString()) return parsed;
  } catch {}
  return null;
}

function saveCachedQuote(data) {
  try {
    localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export default function DailyMotivation() {
  const [quote, setQuote] = useState(loadCachedQuote());
  const [loading, setLoading] = useState(!loadCachedQuote());

  const getLocalFallback = () => {
    const idx = new Date().getDay() % FALLBACK_QUOTES.length;
    return { ...FALLBACK_QUOTES[idx], date: getTodayString() };
  };

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/daily-quote');
      if (!res.ok) throw new Error('non-ok');
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) throw new Error('not-json');
      const data = await res.json();
      if (!data?.quote) throw new Error('empty');
      setQuote(data);
      saveCachedQuote(data);
    } catch {
      const fallback = getLocalFallback();
      setQuote(fallback);
      saveCachedQuote(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadCachedQuote()) fetchQuote();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
          <Sparkles size={16} className="text-yellow-500" />
          Today's Motivation
        </div>
        <button
          onClick={fetchQuote}
          disabled={loading}
          title="Refresh quote"
          className="p-1.5 text-gray-400 hover:text-primary rounded-lg disabled:opacity-40 transition-colors"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="flex flex-col items-center py-4 gap-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-400">Loading today's message…</p>
          </div>
        ) : quote ? (
          <div>
            <p className="text-[15px] text-gray-800 leading-relaxed font-medium italic">
              "{quote.quote}"
            </p>
            <p className="text-xs text-gray-400 mt-3 font-semibold">{quote.author}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
