'use client';

import { useState, useEffect } from 'react';
import {
  Trash2, ArrowUp, ArrowDown, Settings, Plus, X,
  Image as ImageIcon, Type, Video, List, Minus, Quote, Highlighter,
  Share2, AlignLeft, ListOrdered, AlignCenter, AlignRight,
   Globe, Eye, EyeOff,
  ChevronLeft, Save, Send, Layers, Hash,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  'Health Tips', 'Hospital News', 'Nutrition', 'Mental Health',
  'Surgery', 'Cardiology', 'Neurology', 'Orthopaedics',
];

const BG_COLORS = [
  { name: 'White',      value: 'bg-white',    hex: '#ffffff' },
  { name: 'Light Gray', value: 'bg-gray-50',  hex: '#f9fafb' },
  { name: 'Teal Faint', value: 'bg-teal-50',  hex: '#f0fdfa' },
  { name: 'Teal Light', value: 'bg-teal-100', hex: '#ccfbf1' },
  { name: 'Teal Mid',   value: 'bg-teal-600', hex: '#0d9488' },
  { name: 'Teal Dark',  value: 'bg-teal-900', hex: '#134e4a' },
  { name: 'Dark',       value: 'bg-gray-900', hex: '#111827' },
];

const TEXT_COLORS = [
  { name: 'Dark',      value: 'text-gray-900' },
  { name: 'Muted',     value: 'text-gray-500' },
  { name: 'Teal',      value: 'text-teal-600' },
  { name: 'Teal Dark', value: 'text-teal-900' },
  { name: 'White',     value: 'text-white'    },
];

const ACCENT_COLORS = [
  'border-teal-500', 'border-teal-700', 'border-cyan-500',
  'border-emerald-500', 'border-teal-300', 'border-gray-400',
];

const BLOCK_TYPES = [
  { type: 'subheading',    icon: <Hash size={13} />,        label: 'Heading H2'   },
  { type: 'h3',            icon: <Type size={13} />,        label: 'Heading H3'   },
  { type: 'paragraph',     icon: <AlignLeft size={13} />,   label: 'Paragraph'    },
  { type: 'highlight',     icon: <Highlighter size={13} />, label: 'Callout Box'  },
  { type: 'quote',         icon: <Quote size={13} />,       label: 'Quote'        },
  { type: 'step',          icon: <Layers size={13} />,      label: 'Numbered Step'},
  { type: 'list',          icon: <List size={13} />,        label: 'Bullet List'  },
  { type: 'numbered-list', icon: <ListOrdered size={13} />, label: 'Ordered List' },
  { type: 'image',         icon: <ImageIcon size={13} />,   label: 'Image'        },
  { type: 'video',         icon: <Video size={13} />,       label: 'Video'        },
  { type: 'divider',       icon: <Minus size={13} />,       label: 'Divider'      },
  { type: 'social',        icon: <Share2 size={13} />,      label: 'Social Links' },
];

const DEFAULT_HEADER = {
  title: '', subtitle: '', tag: '', author: '', author_role: '',
  readTime: '', bgImage: '', overlayOpacity: 0.55,
  align: 'text-left', textColor: 'text-white',
};

const getDefaultStyles = (type) => {
  const base = {
    backgroundColor: 'bg-white', textColor: 'text-gray-900',
    accentColor: 'border-teal-500', padding: 'p-4',
    rounded: 'rounded-lg', shadow: 'shadow-none',
    textAlign: 'text-left', accentBorder: false, underline: false,
  };
  if (type === 'highlight') return { ...base, backgroundColor: 'bg-teal-50', textColor: 'text-teal-900', accentBorder: true, padding: 'p-6', rounded: 'rounded-xl' };
  if (type === 'quote')     return { ...base, backgroundColor: 'bg-teal-50', textColor: 'text-teal-800', accentBorder: true, padding: 'p-6' };
  if (type === 'step')      return { ...base, accentBorder: true, padding: 'p-5' };
  if (type === 'subheading' || type === 'h3') return { ...base, padding: 'p-0' };
  return base;
};

// ─── Convert blocks → inline-styled HTML (body only, no hero) ─────────────────
// Uses inline styles so it renders correctly in the blog detail page
// without needing any Tailwind classes in the stored HTML.
function blocksToHtml(blocks) {
  if (!blocks || !blocks.length) return '';
  const parts = [];
  let stepCounter = 0;

  blocks.forEach((block) => {
    if (block.type === 'social') return; // social rendered separately

    switch (block.type) {
      case 'subheading': {
        const id = 'section-' + block.id;
        parts.push(
          `<h2 id="${id}" style="font-size:1.6rem;font-weight:800;color:#134e4a;margin:2.5rem 0 1rem;line-height:1.25;">${block.content || ''}</h2>`
        );
        break;
      }
      case 'h3': {
        const id = 'section-' + block.id;
        parts.push(
          `<h3 id="${id}" style="font-size:1.25rem;font-weight:700;color:#0f766e;margin:2rem 0 0.75rem;">${block.content || ''}</h3>`
        );
        break;
      }
      case 'paragraph':
        parts.push(
          `<p style="font-size:1rem;line-height:1.85;color:#374151;margin:0 0 1.25rem;">${(block.content || '').replace(/\n/g, '<br/>')}</p>`
        );
        break;
      case 'highlight':
        parts.push(
          `<div style="background:#f0fdfa;border-left:4px solid #0d9488;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">` +
          `<p style="margin:0;font-size:1rem;font-weight:500;color:#134e4a;line-height:1.7;">${block.content || ''}</p></div>`
        );
        break;
      case 'divider':
        parts.push(`<hr style="border:none;border-top:1px solid #ccfbf1;margin:2.5rem 0;"/>`);
        break;
      case 'image':
        if (block.content) {
          parts.push(
            `<figure style="margin:2rem 0;"><img src="${block.content}" alt="" style="width:100%;border-radius:0.75rem;display:block;"/></figure>`
          );
        }
        break;
      case 'list': {
        const items = (block.content || '').split('\n').filter(Boolean)
          .map(l => `<li style="margin-bottom:0.5rem;line-height:1.7;font-size:1rem;">${l}</li>`).join('');
        parts.push(`<ul style="padding-left:1.5rem;margin:1rem 0 1.5rem;color:#374151;">${items}</ul>`);
        break;
      }
      case 'numbered-list': {
        const items = (block.content || '').split('\n').filter(Boolean)
          .map(l => `<li style="margin-bottom:0.5rem;line-height:1.7;font-size:1rem;">${l}</li>`).join('');
        parts.push(`<ol style="padding-left:1.5rem;margin:1rem 0 1.5rem;color:#374151;">${items}</ol>`);
        break;
      }
      case 'quote': {
        const q = typeof block.content === 'object' ? block.content : { text: block.content || '', author: '' };
        parts.push(
          `<blockquote style="border-left:4px solid #0d9488;background:#f0fdfa;margin:2rem 0;padding:1.25rem 1.5rem;border-radius:0.5rem;">` +
          `<p style="font-style:italic;font-size:1.1rem;color:#134e4a;margin:0 0 ${q.author ? '0.5rem' : '0'};">"${q.text}"</p>` +
          (q.author ? `<cite style="font-size:0.85rem;font-weight:600;color:#0f766e;font-style:normal;">— ${q.author}</cite>` : '') +
          `</blockquote>`
        );
        break;
      }
      case 'step': {
        stepCounter++;
        const s = typeof block.content === 'object' ? block.content : { title: '', description: block.content || '' };
        parts.push(
          `<div style="border-left:4px solid #0d9488;background:#f0fdfa;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem 0;">` +
          `<p style="font-size:0.65rem;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#0d9488;margin:0 0 0.4rem;">Step ${stepCounter}</p>` +
          `<h4 style="font-size:1.1rem;font-weight:700;color:#134e4a;margin:0 0 0.5rem;">${s.title || ''}</h4>` +
          `<p style="font-size:0.95rem;color:#374151;line-height:1.7;margin:0;">${s.description || ''}</p></div>`
        );
        break;
      }
      case 'video': {
        if (block.content) {
          const embedUrl = block.content
            .replace('watch?v=', 'embed/')
            .replace('youtu.be/', 'www.youtube.com/embed/');
          parts.push(
            `<div style="position:relative;padding-bottom:56.25%;height:0;margin:2rem 0;border-radius:0.75rem;overflow:hidden;background:#134e4a;">` +
            `<iframe src="${embedUrl}" title="Video" style="position:absolute;inset:0;width:100%;height:100%;border:none;" allowfullscreen></iframe></div>`
          );
        }
        break;
      }
      default: break;
    }
  });

  return parts.join('\n');
}

// ─── Style Panel ──────────────────────────────────────────────────────────────
const StylePanel = ({ styles, onChange, type }) => {
  if (!styles) return null;
  const set = (k, v) => onChange({ ...styles, [k]: v });

  return (
    <div className="p-4 bg-[#071a1a] border-t border-teal-500/10 space-y-4 text-xs">
      <div>
        <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest mb-2">Background</p>
        <div className="flex flex-wrap gap-1.5">
          {BG_COLORS.map(c => (
            <button key={c.value} title={c.name} onClick={() => set('backgroundColor', c.value)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${styles.backgroundColor === c.value ? 'ring-2 ring-offset-1 ring-teal-400 scale-110 border-white' : 'border-white/20 hover:scale-105'}`}
              style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>

      {!['image', 'video', 'divider'].includes(type) && (
        <div>
          <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest mb-2">Text Color</p>
          <div className="flex gap-2 flex-wrap">
            {TEXT_COLORS.map(c => (
              <button key={c.value} onClick={() => set('textColor', c.value)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${styles.textColor === c.value ? 'border-teal-400 bg-teal-500/10 text-teal-300' : 'border-teal-500/10 text-teal-700 hover:border-teal-400/40'}`}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {['subheading', 'h3', 'highlight', 'step', 'quote'].includes(type) && (
        <div>
          <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest mb-2">Accent Color</p>
          <div className="flex gap-1.5 flex-wrap">
            {ACCENT_COLORS.map(c => (
              <button key={c} onClick={() => set('accentColor', c)}
                className={`w-5 h-5 rounded-full border-2 ${c} ${styles.accentColor === c ? 'ring-2 ring-offset-1 ring-teal-400' : ''}`} />
            ))}
          </div>
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" checked={!!styles.accentBorder} onChange={e => set('accentBorder', e.target.checked)} className="rounded border-teal-700 bg-teal-900 text-teal-500" />
            <span className="text-teal-600">Show accent border</span>
          </label>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest mb-1.5">Padding</p>
          <div className="flex bg-[#0a2222] rounded border border-teal-500/10 overflow-hidden">
            {['p-2', 'p-4', 'p-6', 'p-8'].map(p => (
              <button key={p} onClick={() => set('padding', p)}
                className={`flex-1 py-1 text-[10px] font-medium transition-all ${styles.padding === p ? 'bg-teal-500/10 text-teal-300' : 'text-teal-800 hover:text-teal-500'}`}>
                {p.replace('p-', '')}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest mb-1.5">Corners</p>
          <div className="flex bg-[#0a2222] rounded border border-teal-500/10 overflow-hidden">
            {['rounded-none', 'rounded-lg', 'rounded-xl', 'rounded-3xl'].map(r => (
              <button key={r} onClick={() => set('rounded', r)}
                className={`flex-1 py-1 text-[10px] font-medium transition-all ${styles.rounded === r ? 'bg-teal-500/10 text-teal-300' : 'text-teal-800 hover:text-teal-500'}`}>
                {r === 'rounded-none' ? '0' : r.replace('rounded-', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {['subheading', 'h3', 'paragraph'].includes(type) && (
        <div>
          <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest mb-1.5">Align</p>
          <div className="flex gap-1.5">
            {[['text-left', <AlignLeft size={12}/>], ['text-center', <AlignCenter size={12}/>], ['text-right', <AlignRight size={12}/>]].map(([val, icon]) => (
              <button key={val} onClick={() => set('textAlign', val)}
                className={`p-1.5 rounded border transition-all ${styles.textAlign === val ? 'border-teal-400 bg-teal-500/10 text-teal-300' : 'border-teal-500/10 text-teal-700 hover:border-teal-400/40'}`}>
                {icon}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={styles.shadow === 'shadow-md'} onChange={e => set('shadow', e.target.checked ? 'shadow-md' : 'shadow-none')} className="rounded border-teal-700 bg-teal-900 text-teal-500" />
          <span className="text-teal-600">Shadow</span>
        </label>
        {['subheading', 'h3'].includes(type) && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!styles.underline} onChange={e => set('underline', e.target.checked)} className="rounded border-teal-700 bg-teal-900 text-teal-500" />
            <span className="text-teal-600">Underline</span>
          </label>
        )}
      </div>
    </div>
  );
};

// ─── Block Editor Row ─────────────────────────────────────────────────────────
const BlockRow = ({ block, index, total, updateBlock, removeBlock, moveBlock }) => {
  const [showSettings, setShowSettings] = useState(false);

  const iCls = 'w-full bg-teal-500/[0.03] border border-teal-500/10 rounded-lg px-3 py-2.5 text-teal-100 text-[13px] placeholder:text-teal-800 outline-none focus:border-teal-400/50 transition-all resize-y';

  const setContent = (val) => updateBlock(block.id, val, undefined);
  const setStyle   = (s)   => updateBlock(block.id, undefined, s);

  const renderInput = () => {
    switch (block.type) {
      case 'paragraph':
        return <textarea className={`${iCls} min-h-[90px]`} placeholder="Write your paragraph…" value={block.content} onChange={e => setContent(e.target.value)} />;
      case 'subheading':
        return <input type="text" className={`${iCls} font-bold text-lg`} placeholder="Section heading (H2)…" value={block.content} onChange={e => setContent(e.target.value)} />;
      case 'h3':
        return <input type="text" className={`${iCls} font-semibold`} placeholder="Sub-section heading (H3)…" value={block.content} onChange={e => setContent(e.target.value)} />;
      case 'highlight':
        return <textarea className={`${iCls} min-h-[70px]`} placeholder="Important callout text…" value={block.content} onChange={e => setContent(e.target.value)} />;
      case 'quote': {
        const q = typeof block.content === 'object' ? block.content : { text: block.content || '', author: '' };
        return (
          <div className="space-y-2">
            <textarea className={`${iCls} min-h-[70px]`} placeholder="Quote text…" value={q.text} onChange={e => setContent({ ...q, text: e.target.value })} />
            <input type="text" className={iCls} placeholder="Author (optional)" value={q.author} onChange={e => setContent({ ...q, author: e.target.value })} />
          </div>
        );
      }
      case 'step': {
        const s = typeof block.content === 'object' ? block.content : { title: '', description: '' };
        return (
          <div className="space-y-2">
            <input type="text" className={`${iCls} font-bold`} placeholder="Step title…" value={s.title} onChange={e => setContent({ ...s, title: e.target.value })} />
            <textarea className={`${iCls} min-h-[70px]`} placeholder="Step description…" value={s.description} onChange={e => setContent({ ...s, description: e.target.value })} />
          </div>
        );
      }
      case 'list':
      case 'numbered-list':
        return <textarea className={`${iCls} min-h-[90px]`} placeholder="One item per line…" value={block.content} onChange={e => setContent(e.target.value)} />;
      case 'image':
        return (
          <div className="space-y-2">
            <input type="text" className={iCls} placeholder="Paste image URL…" value={block.content} onChange={e => setContent(e.target.value)} />
            {block.content && <img src={block.content} alt="preview" className="max-h-32 rounded-lg object-cover opacity-70" />}
          </div>
        );
      case 'video':
        return <input type="text" className={iCls} placeholder="YouTube or video URL…" value={block.content} onChange={e => setContent(e.target.value)} />;
      case 'social': {
        const links = Array.isArray(block.content) ? block.content : [];
        return (
          <div className="space-y-2">
            <p className="text-[11px] text-teal-700">Shown at the bottom of your post.</p>
            {links.map((link, i) => (
              <div key={i} className="flex gap-2">
                <select value={link.platform} onChange={e => { const n=[...links]; n[i].platform=e.target.value; setContent(n); }}
                  className="bg-teal-500/[0.03] border border-teal-500/10 rounded-lg px-2 py-2 text-teal-300 text-[12px] outline-none">
                  {['website','twitter','instagram','linkedin','youtube'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input type="text" className={`${iCls} flex-1`} placeholder="URL…" value={link.url} onChange={e => { const n=[...links]; n[i].url=e.target.value; setContent(n); }} />
                <button onClick={() => setContent(links.filter((_,idx)=>idx!==i))} className="text-red-400/50 hover:text-red-400 transition-colors"><X size={14}/></button>
              </div>
            ))}
            <button onClick={() => setContent([...links, { platform:'website', url:'' }])}
              className="flex items-center gap-1.5 text-[12px] text-teal-500 hover:text-teal-300 transition-colors">
              <Plus size={13}/> Add link
            </button>
          </div>
        );
      }
      case 'divider':
        return <div className="py-3 text-center text-teal-800 text-xs border-t border-teal-500/10">— divider line —</div>;
      default: return null;
    }
  };

  return (
    <div className="border border-teal-500/[0.08] rounded-xl overflow-hidden mb-3 bg-[#071a1a]">
      <div className="flex items-center justify-between px-3 py-2 bg-teal-500/[0.03] border-b border-teal-500/[0.07]">
        <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest">
          {BLOCK_TYPES.find(b => b.type === block.type)?.label ?? block.type}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowSettings(p => !p)}
            className={`p-1 rounded transition-all ${showSettings ? 'text-teal-300 bg-teal-500/10' : 'text-teal-700 hover:text-teal-400'}`}>
            <Settings size={13}/>
          </button>
          {block.type !== 'social' && (
            <>
              <button onClick={() => moveBlock(index, -1)} disabled={index === 0}
                className="p-1 rounded text-teal-700 hover:text-teal-400 disabled:opacity-20 transition-all"><ArrowUp size={13}/></button>
              <button onClick={() => moveBlock(index, 1)} disabled={index === total - 1}
                className="p-1 rounded text-teal-700 hover:text-teal-400 disabled:opacity-20 transition-all"><ArrowDown size={13}/></button>
            </>
          )}
          <button onClick={() => removeBlock(block.id)} className="p-1 rounded text-teal-800 hover:text-red-400 transition-all ml-1"><X size={13}/></button>
        </div>
      </div>
      <div className="p-3">{renderInput()}</div>
      {showSettings && <StylePanel styles={block.styles} onChange={setStyle} type={block.type}/>}
    </div>
  );
};

// ─── Preview Panel ────────────────────────────────────────────────────────────
const PreviewPanel = ({ header, blocks }) => {
  const renderBlock = (block) => {
    switch (block.type) {
      case 'subheading':
        return (
          <h2 key={block.id} style={{ fontSize:'1.5rem', fontWeight:800, color:'#134e4a', margin:'2rem 0 0.75rem', lineHeight:1.25 }}>
            {block.content || <span style={{opacity:0.3,fontStyle:'italic'}}>Heading…</span>}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={block.id} style={{ fontSize:'1.2rem', fontWeight:700, color:'#0f766e', margin:'1.5rem 0 0.6rem' }}>
            {block.content || <span style={{opacity:0.3,fontStyle:'italic'}}>Sub-heading…</span>}
          </h3>
        );
      case 'paragraph':
        return (
          <p key={block.id} style={{ fontSize:'1rem', lineHeight:1.85, color:'#374151', marginBottom:'1.25rem', whiteSpace:'pre-wrap' }}>
            {block.content || <span style={{opacity:0.3,fontStyle:'italic'}}>Paragraph text…</span>}
          </p>
        );
      case 'highlight':
        return (
          <div key={block.id} style={{ background:'#f0fdfa', borderLeft:'4px solid #0d9488', borderRadius:'0.75rem', padding:'1.25rem 1.5rem', margin:'1.5rem 0' }}>
            <p style={{ margin:0, fontWeight:500, color:'#134e4a', lineHeight:1.7 }}>{block.content}</p>
          </div>
        );
      case 'quote': {
        const q = typeof block.content === 'object' ? block.content : { text:block.content||'', author:'' };
        return (
          <blockquote key={block.id} style={{ borderLeft:'4px solid #0d9488', background:'#f0fdfa', margin:'2rem 0', padding:'1.25rem 1.5rem', borderRadius:'0.5rem' }}>
            <p style={{ fontStyle:'italic', fontSize:'1.1rem', color:'#134e4a', margin:q.author?'0 0 0.5rem':0 }}>"{q.text}"</p>
            {q.author && <cite style={{ fontSize:'0.85rem', fontWeight:600, color:'#0f766e', fontStyle:'normal' }}>— {q.author}</cite>}
          </blockquote>
        );
      }
      case 'step': {
        const s = typeof block.content === 'object' ? block.content : { title:'', description:'' };
        const n = blocks.filter(b => b.type==='step').findIndex(b => b.id===block.id) + 1;
        return (
          <div key={block.id} style={{ borderLeft:'4px solid #0d9488', background:'#f0fdfa', borderRadius:'0.75rem', padding:'1.25rem 1.5rem', margin:'1.5rem 0' }}>
            <p style={{ fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', color:'#0d9488', margin:'0 0 0.4rem' }}>Step {n}</p>
            <h4 style={{ fontSize:'1.1rem', fontWeight:700, color:'#134e4a', margin:'0 0 0.5rem' }}>{s.title}</h4>
            <p style={{ fontSize:'0.95rem', color:'#374151', lineHeight:1.7, margin:0 }}>{s.description}</p>
          </div>
        );
      }
      case 'list':
        return (
          <ul key={block.id} style={{ paddingLeft:'1.5rem', margin:'1rem 0 1.5rem', color:'#374151' }}>
            {(block.content||'').split('\n').filter(Boolean).map((l,i) => <li key={i} style={{ marginBottom:'0.5rem', lineHeight:1.7 }}>{l}</li>)}
          </ul>
        );
      case 'numbered-list':
        return (
          <ol key={block.id} style={{ paddingLeft:'1.5rem', margin:'1rem 0 1.5rem', color:'#374151' }}>
            {(block.content||'').split('\n').filter(Boolean).map((l,i) => <li key={i} style={{ marginBottom:'0.5rem', lineHeight:1.7 }}>{l}</li>)}
          </ol>
        );
      case 'image':
        return block.content ? (
          <figure key={block.id} style={{ margin:'2rem 0' }}>
            <img src={block.content} alt="" style={{ width:'100%', borderRadius:'0.75rem', display:'block' }}/>
          </figure>
        ) : null;
      case 'video':
        return block.content ? (
          <div key={block.id} style={{ position:'relative', paddingBottom:'56.25%', height:0, margin:'2rem 0', borderRadius:'0.75rem', overflow:'hidden', background:'#134e4a' }}>
            <iframe
              src={block.content.replace('watch?v=','embed/').replace('youtu.be/','www.youtube.com/embed/')}
              title="video" style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }} allowFullScreen />
          </div>
        ) : null;
      case 'social': {
        const links = Array.isArray(block.content) ? block.content : [];
        const icons = { twitter: Twitter, instagram: Instagram, linkedin: Linkedin, youtube: Youtube, website: Globe };
        return (
          <div key={block.id} style={{ borderTop:'1px solid #ccfbf1', paddingTop:'2rem', marginTop:'2.5rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
            <p style={{ fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.14em', textTransform:'uppercase', color:'#9ca3af' }}>Share this article</p>
            <div style={{ display:'flex', gap:'1rem' }}>
              {links.map((link, i) => {
                const Icon = icons[link.platform] ?? Globe;
                return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{ width:40, height:40, background:'#f0fdfa', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#0d9488', textDecoration:'none' }}>
                    <Icon size={18}/>
                  </a>
                );
              })}
            </div>
          </div>
        );
      }
      case 'divider':
        return <hr key={block.id} style={{ border:'none', borderTop:'1px solid #ccfbf1', margin:'2.5rem 0' }}/>;
      default: return null;
    }
  };

  return (
    <div style={{ height:'100%', overflowY:'auto', background:'#fff' }}>
      {/* Hero */}
      <div style={{
        position:'relative', minHeight:300, display:'flex', alignItems:'flex-end',
        backgroundImage: header.bgImage ? `url(${header.bgImage})` : undefined,
        backgroundSize:'cover', backgroundPosition:'center',
        backgroundColor: header.bgImage ? undefined : '#248d86',
      }}>
        <div style={{ position:'absolute', inset:0, background:`rgba(0,0,0,${header.overlayOpacity})` }}/>
        <div style={{ position:'relative', zIndex:1, padding:'2.5rem', maxWidth:700, color:'white', textAlign: header.align === 'text-center' ? 'center' : header.align === 'text-right' ? 'right' : 'left' }}>
          {header.tag && (
            <span style={{ display:'inline-block', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'white', fontSize:'0.65rem', fontWeight:800, padding:'0.25rem 0.75rem', borderRadius:'999px', marginBottom:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>
              {header.tag}
            </span>
          )}
          <h1 style={{ fontSize:'2rem', fontWeight:800, lineHeight:1.2, marginBottom:'0.75rem', textShadow:'0 2px 8px rgba(197, 141, 141, 0.3)' }}>
            {header.title || <span style={{opacity:0.35,fontStyle:'italic'}}>Article title…</span>}
          </h1>
          {header.subtitle && <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'1rem', marginBottom:'1rem', lineHeight:1.6 }}>{header.subtitle}</p>}
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', color:'rgba(255,255,255,0.6)', fontSize:'0.8rem', alignItems:'center', justifyContent: header.align === 'text-center' ? 'center' : 'flex-start' }}>
            {header.author && <span>{header.author}</span>}
            {header.author_role && <span style={{opacity:0.6}}>{header.author_role}</span>}
            {header.readTime && <span>⏱ {header.readTime}</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth:680, margin:'0 auto', padding:'2.5rem 1.5rem' }}>
        {blocks.length === 0 ? (
          <div style={{ height:160, display:'flex', alignItems:'center', justifyContent:'center', border:'2px dashed #ccfbf1', borderRadius:'0.75rem', color:'#99f6e4', fontSize:'0.875rem' }}>
            Add content blocks from the editor →
          </div>
        ) : (
          blocks.map(renderBlock)
        )}
      </div>
    </div>
  );
};

// ─── Main BlogBuilder ─────────────────────────────────────────────────────────
export default function BlogBuilder({ token, onBack, showToast, editingBlog = null }) {
  const API_URL = 'http://localhost:5000/api';

  const [header, setHeader] = useState(() => ({
    ...DEFAULT_HEADER,
    title:       editingBlog?.title       ?? '',
    subtitle:    editingBlog?.excerpt     ?? '',
    tag:         editingBlog?.category    ?? '',
    author:      editingBlog?.author      ?? '',
    author_role: editingBlog?.author_role ?? '',
    readTime:    editingBlog?.read_time   ?? '',
    bgImage:     editingBlog?.image_url   ?? '',
  }));

  const [blocks, setBlocks]       = useState([]);
  const [showPreview, setShowPreview] = useState(true);
  const [tab, setTab]             = useState('hero');
  const [submitting, setSubmitting] = useState(false);

  // If editing an existing blog with plain-text content, load it as a paragraph block
  useEffect(() => {
    if (editingBlog?.content && !editingBlog.content.startsWith('<')) {
      setBlocks([{
        id: `block-${Date.now()}`,
        type: 'paragraph',
        content: editingBlog.content,
        styles: getDefaultStyles('paragraph'),
      }]);
    }
    // If it's HTML content (built with builder before), we can't re-parse it easily,
    // so just show it as a note and let user rebuild
  }, []);

  const addBlock = (type) => {
    if (type === 'social' && blocks.some(b => b.type === 'social')) {
      showToast('Only one social block allowed', 'error'); return;
    }
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: type === 'social' ? [] : (type === 'quote' || type === 'step') ? { title:'', description:'', text:'', author:'' } : '',
      styles: getDefaultStyles(type),
    };
    if (type !== 'social') {
      const socialIdx = blocks.findIndex(b => b.type === 'social');
      if (socialIdx !== -1) {
        const n = [...blocks]; n.splice(socialIdx, 0, newBlock); setBlocks(n); return;
      }
    }
    setBlocks(p => [...p, newBlock]);
  };

  const updateBlock = (id, content, styles) => {
    setBlocks(p => p.map(b => b.id !== id ? b : {
      ...b,
      content: content !== undefined ? content : b.content,
      styles:  styles  !== undefined ? styles  : b.styles,
    }));
  };

  const removeBlock = (id) => setBlocks(p => p.filter(b => b.id !== id));

  const moveBlock = (index, dir) => {
    const newIdx = index + dir;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    if (blocks[newIdx]?.type === 'social' || blocks[index]?.type === 'social') return;
    const arr = [...blocks];
    [arr[index], arr[newIdx]] = [arr[newIdx], arr[index]];
    setBlocks(arr);
  };

  // ── Save: send structured fields + inline-styled HTML body ──────────────────
  const handleSave = async (published = true) => {
    if (!header.title.trim()) { showToast('Title is required', 'error'); return; }
    setSubmitting(true);
    try {
      // Only body blocks → HTML. Hero fields go as separate top-level columns.
      const htmlContent = blocksToHtml(blocks);

      const payload = {
        title:       header.title.trim(),
        excerpt:     header.subtitle.trim(),
        content:     htmlContent,           // inline-styled HTML body
        category:    header.tag,
        author:      header.author.trim(),
        author_role: header.author_role.trim(),
        image_url:   header.bgImage.trim(), // used by detail page hero
        read_time:   header.readTime.trim(),
        is_featured: false,
        published,
      };

      const url    = editingBlog ? `${API_URL}/blogs/${editingBlog.id}` : `${API_URL}/blogs`;
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Server error');
      }

      showToast(published ? '🎉 Blog published!' : 'Saved as draft');
      onBack?.();
    } catch (err) {
      console.error('BlogBuilder save error:', err);
      showToast(err.message || 'Failed to save blog', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const hSet = (field) => (e) =>
    setHeader(p => ({ ...p, [field]: e.target.type === 'range' ? parseFloat(e.target.value) : e.target.value }));

  const iCls = 'w-full bg-teal-500/[0.03] border border-teal-500/10 rounded-lg px-3 py-2.5 text-teal-100 text-[13px] placeholder:text-teal-200 outline-none focus:border-teal-400/50 focus:bg-teal-500/[0.06] transition-all';

  return (
    <div className="flex bg-[#050f0f]" style={{ height:'100vh', overflow:'hidden' }}>

      {/* ── Editor sidebar ── */}
      <div className="flex flex-col border-r border-teal-500/[0.08] bg-[#1f5151]" style={{ width:340, flexShrink:0 }}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-teal-500/[0.08]">
          <button onClick={onBack} className="flex items-center gap-1.5 text-teal-700 hover:text-teal-400 transition-colors text-xs font-medium">
            <ChevronLeft size={14}/> Back
          </button>
          <span className="text-teal-400 text-[12px] font-bold uppercase tracking-widest">
            {editingBlog ? 'Edit Post' : 'New Post'}
          </span>
          <button onClick={() => setShowPreview(p => !p)} className="text-teal-700 hover:text-teal-400 transition-colors" title={showPreview ? 'Hide preview' : 'Show preview'}>
            {showPreview ? <EyeOff size={14}/> : <Eye size={14}/>}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-teal-500/[0.08]">
          {[['hero','Hero & Meta'],['blocks','Content Blocks']].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${tab===key ? 'text-teal-300 border-b-2 border-teal-400 bg-teal-500/[0.04]' : 'text-teal-800 hover:text-teal-500'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Hero & Meta tab ── */}
          {tab === 'hero' && (
            <div className="p-4 space-y-3">
           <div>
  <label className="text-[10px] font-bold text-teal-200 uppercase tracking-widest block mb-1">
    Title *
  </label>
  <input
    type="text"
    className={`${iCls} placeholder:text-teal-200`}
    placeholder="Article title…"
    value={header.title}
    onChange={hSet('title')}
  />
</div>

<div>
  <label className="text-[10px] font-bold text-teal-200 uppercase tracking-widest block mb-1">
    Subtitle / Excerpt
  </label>
  <textarea
    className={`${iCls} min-h-[70px] placeholder:text-teal-200`}
    placeholder="Brief description shown on cards…"
    value={header.subtitle}
    onChange={hSet('subtitle')}
  />
</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-teal-200 uppercase tracking-widest block mb-1">Category</label>
                  <select className={`${iCls} [&>option]:bg-[#266262]`} value={header.tag} onChange={hSet('tag')}>
                    <option value="">— Select —</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-teal-200 uppercase tracking-widest block mb-1">Read Time</label>
                  <input type="text" className={iCls} placeholder="5 min read" value={header.readTime} onChange={hSet('readTime')}/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-teal-200 uppercase tracking-widest block mb-1">Author</label>
                  <input type="text" className={iCls} placeholder="Dr. Priya Sharma" value={header.author} onChange={hSet('author')}/>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-teal-200 uppercase tracking-widest block mb-1">Role</label>
                  <input type="text" className={iCls} placeholder="Senior Physician" value={header.author_role} onChange={hSet('author_role')}/>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-teal-200 uppercase tracking-widest block mb-1">Hero Image URL</label>
                <input type="text" className={iCls} placeholder="https://…" value={header.bgImage} onChange={hSet('bgImage')}/>
                {header.bgImage && <img src={header.bgImage} alt="" className="mt-2 w-full h-24 object-cover rounded-lg opacity-60"/>}
              </div>
              <div>
                <label className="text-[10px] font-bold text-teal-200 uppercase tracking-widest block mb-1">
                  Overlay Opacity: {header.overlayOpacity.toFixed(2)}
                </label>
                <input type="range" min="0" max="1" step="0.05" value={header.overlayOpacity} onChange={hSet('overlayOpacity')} className="w-full accent-teal-500"/>
              </div>
              <div>
                <label className="text-[10px] font-bold text-teal-200 uppercase tracking-widest block mb-1">Text Align</label>
                <div className="flex bg-[#0a2222] rounded border border-teal-500/10 overflow-hidden">
                  {[['text-left','Left'],['text-center','Center'],['text-right','Right']].map(([val,lbl]) => (
                    <button key={val} onClick={() => setHeader(p => ({ ...p, align: val }))}
                      className={`flex-1 py-1.5 text-[11px] font-medium transition-all ${header.align===val ? 'bg-teal-500/10 text-teal-300' : 'text-teal-800 hover:text-teal-500'}`}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Content Blocks tab ── */}
          {tab === 'blocks' && (
            <div className="p-4">
              {/* Block type picker */}
              <div className="grid grid-cols-3 gap-1.5 mb-4 p-3 bg-[#071a1a] border border-teal-500/[0.08] rounded-xl">
                {BLOCK_TYPES.map(({ type, icon, label }) => (
                  <button key={type} onClick={() => addBlock(type)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg bg-teal-500/[0.03] border border-teal-500/[0.08] text-teal-700 hover:bg-teal-500/[0.08] hover:text-teal-300 hover:border-teal-500/20 transition-all">
                    <span className="text-teal-500">{icon}</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wide leading-tight text-center">{label}</span>
                  </button>
                ))}
              </div>

              {blocks.length === 0 ? (
                <div className="py-10 text-center text-teal-800 text-xs">No blocks yet — pick one above to start writing.</div>
              ) : (
                blocks.map((block, i) => (
                  <BlockRow key={block.id} block={block} index={i} total={blocks.length}
                    updateBlock={updateBlock} removeBlock={removeBlock} moveBlock={moveBlock}/>
                ))
              )}
            </div>
          )}
        </div>

        {/* Save buttons */}
        <div className="p-3 border-t border-teal-500/[0.08] grid grid-cols-2 gap-2">
          <button onClick={() => handleSave(false)} disabled={submitting}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-teal-500/20 text-teal-400 text-[12px] font-semibold hover:border-teal-400/40 hover:bg-teal-500/[0.05] disabled:opacity-40 transition-all">
            <Save size={13}/> Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={submitting}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-[12px] font-bold disabled:opacity-40 hover:opacity-90 shadow-lg shadow-teal-500/20 transition-all">
            <Send size={13}/> {submitting ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>

      {/* ── Live Preview ── */}
      {showPreview && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-2.5 bg-[#071a1a] border-b border-teal-500/[0.08]">
            <Eye size={12} className="text-teal-700"/>
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest">Live Preview</span>
            <span className="ml-auto text-[10px] text-teal-800">{blocks.length} block{blocks.length!==1?'s':''}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <PreviewPanel header={header} blocks={blocks}/>
          </div>
        </div>
      )}
    </div>
  );
}