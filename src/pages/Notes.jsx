import React, { useState, useRef, useCallback } from 'react';
import {
  Plus, X, Search, Pin, PinOff, Pencil, Trash2, StickyNote,
  Image, FileText, Paperclip, ZoomIn, ZoomOut, Download,
  RotateCcw, ChevronLeft, ChevronRight, Eye, File,
  Upload, FileImage, FileType, FileBadge, RefreshCw, User, Printer
} from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { openPrintWindow, statsRowHtml, badgeHtml } from '../lib/printReport';

const CATEGORIES = ['All Categories', 'General', 'Operations', 'HR', 'Food Safety', 'Reminder', 'Other'];
const CAT_COLORS = {
  General:      'bg-blue-100 text-blue-700 border-blue-200',
  Operations:   'bg-green-100 text-green-700 border-green-200',
  HR:           'bg-purple-100 text-purple-700 border-purple-200',
  'Food Safety':'bg-red-100 text-red-700 border-red-200',
  Reminder:     'bg-yellow-100 text-yellow-700 border-yellow-200',
  Other:        'bg-gray-100 text-gray-600 border-gray-200',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ACCEPTED_FILE_TYPES = [
  ...ACCEPTED_IMAGE_TYPES,
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

function fileIcon(type) {
  if (!type) return <File size={18} className="text-gray-400" />;
  if (type.startsWith('image/')) return <FileImage size={18} className="text-blue-500" />;
  if (type === 'application/pdf') return <FileType size={18} className="text-red-500" />;
  if (type.includes('word')) return <FileText size={18} className="text-blue-600" />;
  if (type.includes('excel') || type.includes('sheet')) return <FileBadge size={18} className="text-green-600" />;
  return <File size={18} className="text-gray-400" />;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Lightbox / Zoom Viewer ──────────────────────────────────────────────────
function LightboxViewer({ attachments, startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const current = attachments[idx];
  const isImage = current?.type?.startsWith('image/');
  const total = attachments.length;

  const prev = () => { setIdx(i => (i - 1 + total) % total); resetZoom(); };
  const next = () => { setIdx(i => (i + 1) % total); resetZoom(); };
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const zoomIn  = () => setZoom(z => Math.min(z + 0.25, 5));
  const zoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));

  // Keyboard nav
  React.useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // Mouse drag for pan
  const onMouseDown = e => {
    if (zoom <= 1) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = e => {
    if (!dragging.current) return;
    setPan(p => ({ x: p.x + e.clientX - lastPos.current.x, y: p.y + e.clientY - lastPos.current.y }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => { dragging.current = false; };

  // Touch pinch / pan
  const touches = useRef([]);
  const lastDist = useRef(null);
  const onTouchStart = e => { touches.current = Array.from(e.touches); };
  const onTouchMove = e => {
    if (e.touches.length === 2) {
      const a = e.touches[0]; const b = e.touches[1];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (lastDist.current !== null) {
        const delta = dist - lastDist.current;
        setZoom(z => Math.min(Math.max(z + delta * 0.01, 0.5), 5));
      }
      lastDist.current = dist;
    } else if (e.touches.length === 1 && zoom > 1) {
      const t = e.touches[0];
      const prev2 = touches.current[0];
      if (prev2) setPan(p => ({ x: p.x + t.clientX - prev2.clientX, y: p.y + t.clientY - prev2.clientY }));
      touches.current = [t];
    }
  };
  const onTouchEnd = () => { lastDist.current = null; };

  // Use storageUrl (permanent, survives reload) with dataUrl as session-only fallback
  const currentSrc = current?.storageUrl || current?.dataUrl || null;

  const handleDownload = () => {
    if (!currentSrc) return;
    const a = document.createElement('a');
    a.href = currentSrc;
    a.download = current.name || 'attachment';
    a.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[100] flex flex-col select-none"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10">
            <X size={22} />
          </button>
          <div className="text-white">
            <div className="font-semibold text-sm truncate max-w-[200px] md:max-w-none">{current?.name}</div>
            {total > 1 && <div className="text-xs text-white/50">{idx + 1} / {total}</div>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isImage && (
            <>
              <button onClick={zoomOut} disabled={zoom <= 0.5}
                className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 flex items-center gap-1 text-xs">
                <ZoomOut size={18} />
                <span className="hidden sm:inline">Out</span>
              </button>
              <span className="text-white/60 text-xs font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={zoomIn} disabled={zoom >= 5}
                className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 flex items-center gap-1 text-xs">
                <ZoomIn size={18} />
                <span className="hidden sm:inline">In</span>
              </button>
              <button onClick={resetZoom} className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
                <RotateCcw size={16} />
              </button>
            </>
          )}
          <button onClick={handleDownload} className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Main viewer */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden relative"
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
      >
        {isImage && currentSrc ? (
          <img
            src={currentSrc}
            alt={current.name}
            draggable={false}
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transition: dragging.current ? 'none' : 'transform 0.15s ease',
              maxWidth: '100%', maxHeight: '100%',
              objectFit: 'contain',
              userSelect: 'none',
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-white p-8">
            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
              {isImage ? <Image size={40} className="text-white/40" /> : fileIcon(current?.type)}
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">{current?.name}</p>
              <p className="text-white/50 text-sm mt-1">{current?.size ? (current.size / 1024).toFixed(1) + ' KB' : ''}</p>
              <p className="text-white/40 text-xs mt-2">
                {isImage && !currentSrc
                  ? 'Image preview not available — reopen to reload from cloud'
                  : 'Preview not available for this file type'}
              </p>
            </div>
            {currentSrc && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm mt-2"
              >
                <Download size={16} /> Download File
              </button>
            )}
          </div>
        )}

        {/* Side navigation arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="flex items-center gap-2 p-3 bg-black/60 overflow-x-auto flex-shrink-0">
          {attachments.map((att, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); resetZoom(); }}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              {att.type?.startsWith('image/') && (att.storageUrl || att.dataUrl) ? (
                <img src={att.storageUrl || att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                  {fileIcon(att.type)}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Attachment Uploader ─────────────────────────────────────────────────────
function AttachmentUploader({ attachments, onChange }) {
  const fileInputRef = useRef(null);
  const [draggingOver, setDraggingOver] = useState(false);

  const processFiles = async (files) => {
    const results = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`"${file.name}" exceeds 10 MB limit. Skipping.`);
        continue;
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        alert(`"${file.name}" file type is not supported. Skipping.`);
        continue;
      }
      try {
        const dataUrl = await readFileAsDataURL(file);
        results.push({
          id: `att_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl,
        });
      } catch {
        alert(`Failed to read "${file.name}".`);
      }
    }
    if (results.length > 0) onChange([...attachments, ...results]);
  };

  const handleInputChange = e => processFiles(Array.from(e.target.files || []));
  const handleRemove = id => onChange(attachments.filter(a => a.id !== id));

  const handleDrop = e => {
    e.preventDefault();
    setDraggingOver(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-gray-600 block">Attachments</label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDraggingOver(true); }}
        onDragLeave={() => setDraggingOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-all ${
          draggingOver
            ? 'border-primary bg-red-50'
            : 'border-gray-200 bg-gray-50 hover:border-primary hover:bg-red-50/30'
        }`}
      >
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <Upload size={20} className="text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">Drop files here or click to upload</p>
          <p className="text-xs text-gray-400 mt-0.5">Images, PDF, Word, Excel, TXT · Max 10 MB each</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES.join(',')}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Attachment list */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((att, i) => (
            <div key={att.id || i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
              {att.type?.startsWith('image/') ? (
                <img src={att.storageUrl || att.dataUrl} alt={att.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  {fileIcon(att.type)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{att.name}</p>
                <p className="text-xs text-gray-400">{att.size ? (att.size / 1024).toFixed(1) + ' KB' : ''}</p>
              </div>
              <button
                onClick={() => handleRemove(att.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Note Modal (Add / Edit) ─────────────────────────────────────────────────
function NoteModal({ note, onClose, onSave }) {
  const [form, setForm] = useState(note || {
    title: '', category: 'General', body: '', pinned: false, attachments: []
  });

  const handleSave = () => {
    if (!form.title.trim()) return alert('Title is required');
    onSave({ ...form, attachments: form.attachments || [] });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-lg text-gray-800">{note ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X size={20} /></button>
        </div>

        <div className="modal-body p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Title *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="Note title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.slice(1).map(cat => (
                <button
                  key={cat}
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    form.category === cat
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                  }`}
                >{cat}</button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Body</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={6}
              placeholder="Note content..."
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
            />
          </div>

          {/* Attachments */}
          <AttachmentUploader
            attachments={form.attachments || []}
            onChange={atts => setForm({ ...form, attachments: atts })}
          />

          {/* Pin toggle */}
          <button
            onClick={() => setForm({ ...form, pinned: !form.pinned })}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              form.pinned ? 'bg-accent text-white border-accent' : 'bg-white text-gray-600 border-gray-200 hover:border-accent'
            }`}
          >
            {form.pinned ? <Pin size={14} /> : <PinOff size={14} />}
            {form.pinned ? 'Pinned' : 'Pin Note'}
          </button>
        </div>

        <div className="modal-footer">
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
          >
            {note ? 'Save Changes' : '+ Add Note'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Attachment Thumbnail Row ────────────────────────────────────────────────
function AttachmentRow({ attachments, onOpenLightbox }) {
  if (!attachments || attachments.length === 0) return null;
  const images = attachments.filter(a => a.type?.startsWith('image/'));
  const files  = attachments.filter(a => !a.type?.startsWith('image/'));

  return (
    <div className="mt-3 space-y-2">
      {/* Image thumbnails grid */}
      {images.length > 0 && (
        <div className={`grid gap-1.5 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {images.map((img, i) => {
            const imgSrc = img.storageUrl || img.dataUrl || null;
            return (
            <div
              key={img.id || i}
              className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 group ${imgSrc ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={() => imgSrc && onOpenLightbox(attachments, attachments.indexOf(img))}
            >
              {imgSrc ? (
                <>
                  <img src={imgSrc} alt={img.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </>
              ) : (
                /* Placeholder: no preview available yet */
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
                  <Image size={22} className="text-gray-300 flex-shrink-0" />
                  <span className="text-[10px] text-gray-400 text-center leading-tight break-all line-clamp-2">{img.name}</span>
                </div>
              )}
              {i === 2 && images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">+{images.length - 3}</span>
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((file, i) => (
            <button
              key={file.id || i}
              onClick={() => onOpenLightbox(attachments, attachments.indexOf(file))}
              className="w-full flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl px-3 py-2 transition-all text-left"
            >
              {fileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                <p className="text-[10px] text-gray-400">{file.size ? (file.size / 1024).toFixed(1) + ' KB' : ''}</p>
              </div>
              <Eye size={14} className="text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Note Card ───────────────────────────────────────────────────────────────
function NoteCard({ note, onPin, onEdit, onDelete, onOpenLightbox, showCreator }) {
  const [expanded, setExpanded] = useState(false);
  const preview = note.body?.substring(0, 140);
  const hasMore = note.body?.length > 140;
  const attachCount = note.attachments?.length || 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 transition-all hover:shadow-md ${
      note.pinned ? 'border-accent' : 'border-transparent'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {note.pinned && <Pin size={13} className="text-accent flex-shrink-0" />}
            <h3 className="font-semibold text-sm text-gray-800 break-words">{note.title}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${CAT_COLORS[note.category] || CAT_COLORS.Other}`}>
              {note.category}
            </span>
            <span className="text-xs text-gray-400">
              {note.createdAt ? format(new Date(note.createdAt), 'MMM d, yyyy') : ''}
            </span>
            {showCreator && note.createdBy?.name && (
              <span className="flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                <User size={10} />
                {note.createdBy.name}
              </span>
            )}
            {attachCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Paperclip size={11} /> {attachCount} {attachCount === 1 ? 'file' : 'files'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onPin(note)} title={note.pinned ? 'Unpin' : 'Pin'}
            className="p-1.5 text-gray-400 hover:text-accent rounded-lg transition-colors">
            {note.pinned ? <Pin size={15} className="text-accent" /> : <PinOff size={15} />}
          </button>
          <button onClick={() => onEdit(note)} title="Edit"
            className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => onDelete(note.id)} title="Delete"
            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Body */}
      {note.body && (
        <div className="mt-1">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {expanded ? note.body : preview}
            {!expanded && hasMore && '...'}
          </p>
          {hasMore && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary mt-1 font-medium hover:underline">
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {/* Attachments */}
      <AttachmentRow
        attachments={note.attachments}
        onOpenLightbox={onOpenLightbox}
      />
    </div>
  );
}

// ─── Main Notes Page ─────────────────────────────────────────────────────────
export default function Notes() {
  const {
    teamNotes, myNotes,
    addTeamNote, updateTeamNote, deleteTeamNote,
    addMyNote, updateMyNote, deleteMyNote,
    dbMode, dbReady, dbConnecting, needsRelogin, connectFirestore,
    user,
  } = useAppStore();
  const isCloudSync  = dbReady && dbMode === 'firestore';
  const isRealUser   = user && user.uid && user.uid !== 'demo_user';
  // Syncing = real user is logged in AND Firestore isn't ready yet
  const isSyncing    = isRealUser && !isCloudSync;

  const [activeTab, setActiveTab]   = useState('team');
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('All Categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editNote, setEditNote]     = useState(null);
  const [lightbox, setLightbox]     = useState(null); // { attachments, index }

  const notes      = activeTab === 'team' ? (teamNotes  || []) : (myNotes  || []);
  const addNote    = activeTab === 'team' ? addTeamNote    : addMyNote;
  const updateNote = activeTab === 'team' ? updateTeamNote : updateMyNote;
  const deleteNote = activeTab === 'team' ? deleteTeamNote : deleteMyNote;

  const filtered = notes
    .filter(n => {
      const matchSearch = n.title?.toLowerCase().includes(search.toLowerCase()) ||
        n.body?.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'All Categories' || n.category === catFilter;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const pinnedCount = notes.filter(n => n.pinned).length;

  const handlePin    = note => updateNote(note.id, { pinned: !note.pinned });
  const handleDelete = id => { if (window.confirm('Delete this note?')) deleteNote(id); };
  const openLightbox = (attachments, index) => setLightbox({ attachments, index });

  const handlePrint = () => {
    const CAT_BADGE = {
      General: 'blue', Operations: 'orange', HR: 'red',
      'Food Safety': 'green', Reminder: 'yellow', Other: 'gray',
    };
    const list = filtered;
    const pinned = list.filter(n => n.pinned).length;
    const html = `
      ${statsRowHtml([
        { value: notes.length, label: 'Total Notes' },
        { value: pinned,       label: 'Pinned' },
        { value: list.filter(n => (n.attachments || []).length > 0).length, label: 'With Attachments' },
      ])}
      <h2 class="section-title">${activeTab === 'team' ? 'Team' : 'My'} Notes</h2>
      ${list.map(n => `
        <div style="border:1px solid #e0e0e0;border-radius:6px;padding:10px 14px;margin-bottom:10px;page-break-inside:avoid">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            ${n.pinned ? '<span style="color:#f59e0b;font-size:11px">&#x1F4CC; Pinned</span>' : ''}
            ${badgeHtml(n.category || 'General', CAT_BADGE[n.category] || 'gray')}
            <span style="font-size:10px;color:#888;margin-left:auto">${n.createdAt ? format(new Date(n.createdAt), 'MMM d, yyyy') : ''}</span>
          </div>
          <p style="font-weight:bold;font-size:13px;margin-bottom:4px">${n.title || '(No Title)'}</p>
          ${n.body ? '<p style="font-size:11px;color:#444;white-space:pre-wrap">' + n.body + '</p>' : ''}
          ${(n.attachments || []).length > 0 ? '<p style="font-size:10px;color:#888;margin-top:6px">&#x1F4CE; ' + n.attachments.length + ' attachment(s): ' + n.attachments.map(a => a.name).join(', ') + '</p>' : ''}
          ${n.createdBy?.name ? '<p class="sub-label" style="margin-top:4px">Added by ' + n.createdBy.name + '</p>' : ''}
        </div>`).join('')}`;
    openPrintWindow({
      title: (activeTab === 'team' ? 'Team Notes' : 'My Notes') + ' Report',
      subtitle: list.length + ' notes',
      html,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Notes" onAdd={() => setShowAddModal(true)} />
      <DesktopPageHeader title="Notes" onAdd={() => setShowAddModal(true)} addLabel="+ New Note" onPrint={handlePrint} />

      <div className="desktop-page-content p-4 lg:p-0 space-y-3 max-w-full">
        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'team' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            👥 Team Notes
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'my' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            👤 My Notes
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-blue-700">
            <span>{activeTab === 'team' ? '👥' : '👤'}</span>
            <span>
              <strong>{activeTab === 'team' ? 'Team Notes' : 'My Notes'}</strong>
              {' — '}{activeTab === 'team'
                ? (isCloudSync ? '☁️ synced across all devices' : 'shared with all team members')
                : (isCloudSync ? '🔒 private · backed up to your account' : 'private to you')
              }
            </span>
          </div>
          {pinnedCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-accent font-semibold">
              <Pin size={11} /> {pinnedCount} pinned
            </span>
          )}
        </div>

        {/* ── Syncing banner (My Notes tab, real user, not yet connected) ── */}
        {activeTab === 'my' && isRealUser && (
          <div className={`rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 text-xs ${
            isCloudSync
              ? 'bg-green-50 border border-green-100 text-green-700'
              : needsRelogin
              ? 'bg-red-50 border border-red-100 text-red-700'
              : 'bg-amber-50 border border-amber-100 text-amber-700'
          }`}>
            <div className="flex items-center gap-2">
              {isCloudSync ? (
                <span>☁️ <strong>Cloud sync active</strong> — {myNotes?.length || 0} note{myNotes?.length !== 1 ? 's' : ''} backed up to your account</span>
              ) : needsRelogin ? (
                <span>🔐 <strong>Session expired</strong> — please sign out and sign in again to sync your notes</span>
              ) : dbConnecting ? (
                <>
                  <RefreshCw size={13} className="animate-spin shrink-0" />
                  <span><strong>Connecting to cloud…</strong> Loading your private notes</span>
                </>
              ) : (
                <span>⚠️ <strong>Not synced yet</strong> — tap to load {myNotes?.length || 0} note{myNotes?.length !== 1 ? 's' : ''} from cloud</span>
              )}
            </div>
            {!isCloudSync && !needsRelogin && (
              <button
                onClick={() => connectFirestore()}
                disabled={dbConnecting}
                className="shrink-0 flex items-center gap-1 bg-amber-100 hover:bg-amber-200 disabled:opacity-50 text-amber-800 px-2 py-1 rounded-lg font-semibold transition-colors"
              >
                <RefreshCw size={11} className={dbConnecting ? 'animate-spin' : ''} />
                {dbConnecting ? 'Syncing…' : 'Sync to Cloud'}
              </button>
            )}
          </div>
        )}

        {/* Search + Filter + Print row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white shadow-sm"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 flex-shrink-0 lg:hidden"
          >
            <Printer size={14} />
          </button>
        </div>

        {/* Count */}
        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 px-1">
            {filtered.length} {filtered.length === 1 ? 'note' : 'notes'}
            {search || catFilter !== 'All Categories' ? ' found' : ''}
          </p>
        )}

        {/* Notes list / empty state */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-10 flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <StickyNote size={30} className="text-gray-300" />
            </div>
            {notes.length === 0 ? (
              <>
                <h3 className="font-semibold text-gray-700 mb-1">No Notes Yet</h3>
                <p className="text-xs text-gray-400 mb-5">Create your first note — add text, images, or files.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
                >
                  <Plus size={16} /> New Note
                </button>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-gray-700 mb-1">No Results Found</h3>
                <p className="text-xs text-gray-400 mb-5">Try adjusting your search or category filter.</p>
                <button
                  onClick={() => { setSearch(''); setCatFilter('All Categories'); }}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onPin={handlePin}
                onEdit={setEditNote}
                onDelete={handleDelete}
                onOpenLightbox={openLightbox}
                showCreator={activeTab === 'team'}
              />
            ))}
          </div>
        )}

        <div className="h-4" />
      </div>

      {/* Modals */}
      {showAddModal && (
        <NoteModal
          onClose={() => setShowAddModal(false)}
          onSave={data => addNote({ ...data, attachments: data.attachments || [] })}
        />
      )}
      {editNote && (
        <NoteModal
          note={editNote}
          onClose={() => setEditNote(null)}
          onSave={data => updateNote(editNote.id, { ...data, attachments: data.attachments || [] })}
        />
      )}

      {/* Lightbox */}
      {lightbox && (
        <LightboxViewer
          attachments={lightbox.attachments}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
