import React, { useEffect, useRef, useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';

// ── NoteUploadProgress ────────────────────────────────────────────────────────
// Floating bottom bar that appears while note attachments are being uploaded to
// Firebase Storage.  Shows per-file progress bars and an overall progress ring.
//
// Also registers a beforeunload handler so the browser warns the user if they
// try to close/refresh while an upload is still in flight.
// ─────────────────────────────────────────────────────────────────────────────
export default function NoteUploadProgress() {
  const noteUploads = useAppStore(s => s.noteUploads);
  const _clearNoteUpload = useAppStore(s => s._clearNoteUpload);

  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState({}); // noteIds manually dismissed after done

  const entries = Object.entries(noteUploads); // [[noteId, { noteTitle, files, allDone }]]
  const visible = entries.filter(([id, e]) => !dismissed[id] && !(e.allDone && dismissed[id]));

  // Auto-collapse when all done
  useEffect(() => {
    const allDone = entries.length > 0 && entries.every(([, e]) => e.allDone);
    if (allDone) setExpanded(false);
  }, [noteUploads]);

  // ── beforeunload guard ────────────────────────────────────────────────────
  const hasActive = entries.some(([, e]) => !e.allDone);
  const hasActiveRef = useRef(hasActive);
  hasActiveRef.current = hasActive;

  useEffect(() => {
    const handler = e => {
      if (!hasActiveRef.current) return;
      e.preventDefault();
      e.returnValue = 'Attachments are still uploading. If you leave now, image previews may not be saved. Are you sure?';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  if (visible.length === 0) return null;

  // Overall progress across all files across all notes
  const allFiles   = visible.flatMap(([, e]) => e.files);
  const totalFiles = allFiles.length;
  const doneFiles  = allFiles.filter(f => f.done || f.error).length;
  const avgPct     = totalFiles === 0 ? 0
    : Math.round(allFiles.reduce((s, f) => s + (f.done ? 100 : f.error ? 100 : f.pct), 0) / totalFiles);
  const allDoneNow = visible.every(([, e]) => e.allDone);
  const hasError   = allFiles.some(f => f.error);

  const handleDismiss = (noteId) => {
    setDismissed(d => ({ ...d, [noteId]: true }));
    _clearNoteUpload(noteId);
  };

  return (
    <div
      className={`fixed bottom-[72px] lg:bottom-4 left-1/2 -translate-x-1/2 z-[90]
        w-[calc(100%-2rem)] max-w-sm
        bg-gray-900 text-white rounded-2xl shadow-2xl
        transition-all duration-300 overflow-hidden`}
      style={{ maxWidth: 360 }}
    >
      {/* ── Header bar ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Icon / spinner */}
        <div className="relative w-8 h-8 flex-shrink-0">
          {/* Background circle */}
          <svg className="absolute inset-0 w-8 h-8 -rotate-90" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
            <circle
              cx="16" cy="16" r="13"
              fill="none"
              stroke={hasError ? '#f87171' : allDoneNow ? '#4ade80' : '#60a5fa'}
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 13}`}
              strokeDashoffset={`${2 * Math.PI * 13 * (1 - avgPct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {allDoneNow
              ? <CheckCircle2 size={14} className={hasError ? 'text-red-400' : 'text-green-400'} />
              : <Upload size={12} className="text-blue-400 animate-pulse" />
            }
          </div>
        </div>

        {/* Label */}
        <div className="flex-1 min-w-0">
          {allDoneNow ? (
            <p className={`text-sm font-semibold ${hasError ? 'text-red-400' : 'text-green-400'}`}>
              {hasError ? 'Some uploads failed' : 'Upload complete!'}
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-white">
                Uploading {doneFiles}/{totalFiles} file{totalFiles !== 1 ? 's' : ''}…
              </p>
              <p className="text-xs text-white/50">Don't close the app yet</p>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono text-white/60 w-8 text-right">{avgPct}%</span>
          {allDoneNow
            ? <button onClick={e => { e.stopPropagation(); visible.forEach(([id]) => handleDismiss(id)); }}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white">
                <X size={16} />
              </button>
            : (expanded
                ? <ChevronDown size={18} className="text-white/50" />
                : <ChevronUp   size={18} className="text-white/50" />
              )
          }
        </div>
      </div>

      {/* ── Expanded file list ── */}
      {expanded && (
        <div className="px-4 pb-3 space-y-2.5 max-h-48 overflow-y-auto">
          {visible.map(([noteId, entry]) => (
            <div key={noteId}>
              {/* Note title */}
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-white/60 font-medium truncate max-w-[220px]">
                  📝 {entry.noteTitle || 'Untitled'}
                </p>
                {entry.allDone && (
                  <button
                    onClick={() => handleDismiss(noteId)}
                    className="text-white/40 hover:text-white/70 p-0.5 rounded"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Per-file bars */}
              {entry.files.map((file, i) => (
                <div key={i} className="mb-1.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-white/70 truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs font-mono text-white/50 ml-2 flex-shrink-0">
                      {file.error
                        ? <span className="text-red-400 flex items-center gap-0.5"><AlertCircle size={10}/> Failed</span>
                        : file.done
                          ? <span className="text-green-400 flex items-center gap-0.5"><CheckCircle2 size={10}/> Done</span>
                          : `${file.pct}%`
                      }
                    </span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        file.error ? 'bg-red-400' : file.done ? 'bg-green-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${file.done || file.error ? 100 : file.pct}%` }}
                    />
                  </div>
                  {/* Show error code so we know what went wrong */}
                  {file.error && file.errorMsg && (
                    <p className="text-[10px] text-red-300/70 mt-0.5 truncate">
                      {file.errorMsg.includes('unauthorized') || file.errorMsg.includes('permission')
                        ? '⚠️ Storage permission denied — check Firebase Storage rules'
                        : file.errorMsg.includes('quota')
                          ? '⚠️ Storage quota exceeded'
                          : `⚠️ ${file.errorMsg}`
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
