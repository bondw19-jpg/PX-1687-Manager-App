import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, ClipboardList, ListChecks, Megaphone, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';

const QUOTE_STORAGE_KEY = 'px_shift_lead_daily_quote';

const FALLBACK_QUOTES = [
  { quote: "Every great shift starts with a great attitude. Lead with energy and your team will follow.", author: "— The Panda Way" },
  { quote: "Serve every guest like they're the first guest of the day — that's the Panda difference.", author: "— Panda Wisdom" },
  { quote: "Great operations don't happen by accident. They happen because great leaders show up ready.", author: "— Panda Leadership" },
  { quote: "Your energy sets the tone. Make it a shift everyone remembers for the right reasons.", author: "— The Panda Spirit" },
  { quote: "When you take care of your team, your team takes care of the guests. That's the Panda way.", author: "— Panda Values" },
  { quote: "Consistency is the foundation of excellence. Show up the same way every single shift.", author: "— Panda Excellence" },
  { quote: "A good shift lead doesn't just manage — they inspire. Be the reason your team gives their best.", author: "— Panda Leadership" },
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

const PRIORITY_LEFT = {
  Normal: 'bg-blue-400',
  Important: 'bg-yellow-400',
  Urgent: 'bg-red-500',
};
const PRIORITY_COLORS = {
  Normal: 'bg-blue-50 border-blue-200 text-blue-700',
  Important: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  Urgent: 'bg-red-50 border-red-200 text-red-700',
};

const QUICK_LINKS = [
  { label: 'Shift Checklist', icon: ClipboardCheck, path: '/checklist', color: 'bg-red-50 text-primary' },
  { label: '5P7A',            icon: ClipboardList,  path: '/daily-plan', color: 'bg-orange-50 text-orange-600' },
  { label: 'Tasks & To-Do',   icon: ListChecks,     path: '/tasks',      color: 'bg-blue-50 text-blue-600' },
  { label: 'Announcements',   icon: Megaphone,      path: '/announcements', color: 'bg-purple-50 text-purple-600' },
];

export default function ShiftLeadDashboard() {
  const navigate = useNavigate();
  const { user, announcements } = useAppStore();

  const [quote, setQuote] = useState(loadCachedQuote());
  const [quoteLoading, setQuoteLoading] = useState(!loadCachedQuote());
  const [quoteError, setQuoteError] = useState(false);

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const today = format(new Date(), 'EEEE, MMMM d');

  const getLocalFallback = () => {
    const idx = new Date().getDay() % FALLBACK_QUOTES.length;
    return { ...FALLBACK_QUOTES[idx], date: getTodayString() };
  };

  const fetchQuote = async () => {
    setQuoteLoading(true);
    setQuoteError(false);
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
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    if (!loadCachedQuote()) {
      fetchQuote();
    }
  }, []);

  const recentAnnouncements = [...announcements]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header title="My Dashboard" />
      <DesktopPageHeader title="My Dashboard" />

      <div className="desktop-page-content p-4 lg:p-0 space-y-4">

        {/* Greeting */}
        <div className="bg-primary rounded-2xl p-5 text-white">
          <p className="text-sm opacity-80 mb-0.5">{today}</p>
          <h1 className="text-xl font-bold leading-tight">Hey, {firstName}! 👋</h1>
          <p className="text-sm opacity-75 mt-1">Ready to lead an amazing shift?</p>
        </div>

        {/* Daily Motivation */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
              <Sparkles size={16} className="text-yellow-500" />
              Today's Motivation
            </div>
            <button
              onClick={fetchQuote}
              disabled={quoteLoading}
              title="Refresh quote"
              className="p-1.5 text-gray-400 hover:text-primary rounded-lg disabled:opacity-40 transition-colors"
            >
              <RefreshCw size={15} className={quoteLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="p-5">
            {quoteLoading ? (
              <div className="flex flex-col items-center py-4 gap-2">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400">Generating your daily message…</p>
              </div>
            ) : quoteError ? (
              <div className="text-center py-3">
                <p className="text-sm text-gray-400 mb-2">Couldn't load today's message.</p>
                <button
                  onClick={fetchQuote}
                  className="text-xs text-primary font-semibold underline"
                >
                  Try again
                </button>
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

        {/* Quick Links */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quick Access</p>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_LINKS.map(link => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md active:scale-[0.98] transition-all text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${link.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 leading-tight">{link.label}</span>
                  <ChevronRight size={14} className="text-gray-300 ml-auto flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
              <Megaphone size={16} className="text-primary" />
              Latest Announcements
            </div>
            <button
              onClick={() => navigate('/announcements')}
              className="text-xs text-primary font-medium flex items-center gap-1"
            >
              View All <ChevronRight size={13} />
            </button>
          </div>

          <div className="p-4">
            {recentAnnouncements.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-gray-400">
                <Megaphone size={32} className="mb-2 text-gray-200" />
                <p className="text-sm">No announcements yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAnnouncements.map(ann => (
                  <div
                    key={ann.id}
                    className={`rounded-xl p-3 border-l-4 bg-gray-50 ${PRIORITY_LEFT[ann.priority] || PRIORITY_LEFT.Normal}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${PRIORITY_COLORS[ann.priority] || PRIORITY_COLORS.Normal}`}>
                        {ann.priority}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {ann.createdAt ? format(new Date(ann.createdAt), 'MMM d') : ''}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-800">{ann.title}</p>
                    {ann.body && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{ann.body}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
