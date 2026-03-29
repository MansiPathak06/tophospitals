'use client';

import { useState, useRef } from 'react';
import AddHospitalPage from './AddHospitalPage';

const API = 'http://localhost:5000/api';

function authHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

// ─── Reusable field label wrapper ─────────────────────────────────────────────
function MField({ label, children }) {
  return (
    <div className="mb-3.5">
      <label className="block text-[11px] font-bold text-[#0F5C5C]/60 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-[#f4fafa] border border-[#e6f4f4] rounded-[10px] px-3.5 py-2.5 text-[#1a3333] text-[13.5px] placeholder:text-gray-400 outline-none transition-all focus:border-[#0F5C5C]/50 focus:bg-white focus:ring-2 focus:ring-[#0F5C5C]/10';

const textareaCls =
  'w-full bg-[#f4fafa] border border-[#e6f4f4] rounded-[10px] px-3.5 py-2.5 text-[#1a3333] text-[13.5px] placeholder:text-gray-400 outline-none transition-all focus:border-[#0F5C5C]/50 focus:bg-white focus:ring-2 focus:ring-[#0F5C5C]/10 resize-none';

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ label, value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] border text-[13px] font-semibold transition-all w-full ${
        value
          ? 'bg-[#0F5C5C] border-[#0F5C5C] text-white'
          : 'bg-[#f4fafa] border-[#e6f4f4] text-gray-400 hover:border-[#0F5C5C]/30'
      }`}
    >
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] transition-all ${value ? 'border-white bg-white/20' : 'border-gray-300'}`}>
        {value ? '✓' : ''}
      </span>
      {label}
    </button>
  );
}

// ─── Gallery URL Manager (comma-separated textarea + individual inputs) ───────
// ── GalleryManager — supports device upload + URL input ──────────────────────
// const API = 'http://localhost:5000/api'; // already defined at top of each file

function GalleryManager({ gallery, onChange, token }) {
  const [tab, setTab]           = useState('url');      // 'url' | 'upload'
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef            = useRef(null);

  // ── URL helpers ────────────────────────────────────────────────────────────
  const addUrl    = ()      => onChange([...gallery, '']);
  const removeUrl = (i)     => onChange(gallery.filter((_, idx) => idx !== i));
  const updateUrl = (i, v)  => { const n = [...gallery]; n[i] = v; onChange(n); };

  const applyBulk = () => {
    const urls = bulkText.split(/,|\n/).map(u => u.trim()).filter(Boolean);
    const merged = Array.from(new Set([...gallery.filter(Boolean), ...urls]));
    onChange(merged);
    setBulkText('');
    setBulkMode(false);
  };

  // ── Upload helpers ─────────────────────────────────────────────────────────
  const uploadFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('images', f));

      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token || localStorage.getItem('zentrix_token')}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      onChange([...gallery, ...data.urls]);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => uploadFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    uploadFiles(files);
  };

  const filled = gallery.filter(Boolean);

  return (
    <div className="space-y-3">

      {/* ── Tab switcher ── */}
      <div className="flex items-center gap-1 p-1 bg-[#f4fafa] border border-[#e6f4f4] rounded-xl w-fit">
        {[['url', '🔗 URL'], ['upload', '📁 Device']].map(([key, label]) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`px-3.5 py-1.5 rounded-lg text-[11.5px] font-bold transition-all ${
              tab === key
                ? 'bg-[#0F5C5C] text-white shadow-sm'
                : 'text-gray-400 hover:text-[#0F5C5C]'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── URL Tab ── */}
      {tab === 'url' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-semibold">
              {filled.length} image{filled.length !== 1 ? 's' : ''} added
            </span>
            <button type="button" onClick={() => setBulkMode(m => !m)}
              className="text-[11px] font-bold text-[#0F5C5C]/60 hover:text-[#0F5C5C] transition-colors">
              {bulkMode ? '← One by one' : 'Paste multiple →'}
            </button>
          </div>

          {bulkMode ? (
            <>
              <textarea
                className="w-full bg-[#f4fafa] border border-[#e6f4f4] rounded-xl px-4 py-2.5 text-[#1a3333] text-sm placeholder:text-gray-400 outline-none transition-all focus:border-[#0F5C5C]/50 focus:ring-2 focus:ring-[#0F5C5C]/10 resize-none min-h-[90px]"
                placeholder={`Paste URLs separated by commas or new lines:\nhttps://img1.jpg, https://img2.jpg`}
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="button" onClick={applyBulk}
                  className="px-4 py-2 rounded-xl bg-[#0F5C5C] text-white text-[12px] font-semibold hover:bg-[#177a7a] transition-all">
                  ✓ Apply URLs
                </button>
                <button type="button" onClick={() => setBulkMode(false)}
                  className="px-4 py-2 rounded-xl bg-[#f4fafa] border border-[#e6f4f4] text-gray-400 text-[12px] font-semibold hover:text-[#0F5C5C] transition-all">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {gallery.map((url, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex gap-2 items-center">
                      <span className="text-[10px] font-bold text-[#0F5C5C]/30 w-4 shrink-0 text-right">{i+1}</span>
                      <input
                        className="flex-1 bg-[#f4fafa] border border-[#e6f4f4] rounded-[10px] px-3.5 py-2 text-[#1a3333] text-[13px] placeholder:text-gray-400 outline-none transition-all focus:border-[#0F5C5C]/50 focus:bg-white focus:ring-2 focus:ring-[#0F5C5C]/10"
                        placeholder="https://example.com/image.jpg"
                        value={url}
                        onChange={e => updateUrl(i, e.target.value)}
                      />
                      <button type="button" onClick={() => removeUrl(i)}
                        className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border border-red-200 text-red-400/60 hover:text-red-500 hover:border-red-400 hover:bg-red-50 transition-all">
                        ×
                      </button>
                    </div>
                    {url && (
                      <div className="ml-6 h-14 rounded-lg overflow-hidden border border-[#e6f4f4]">
                        <img src={url} alt="" className="w-full h-full object-cover"
                          onError={e => { e.target.style.display='none'; }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addUrl}
                className="w-full py-2.5 rounded-xl border border-dashed border-[#0F5C5C]/25 text-[#0F5C5C]/50 hover:text-[#0F5C5C] hover:border-[#0F5C5C]/50 hover:bg-[#e6f4f4] text-[12px] font-semibold transition-all">
                + Add Image URL
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Upload Tab ── */}
      {tab === 'upload' && (
        <div className="space-y-3">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all p-8 text-center
              ${dragOver
                ? 'border-[#0F5C5C] bg-[#e6f4f4] scale-[1.01]'
                : 'border-[#0F5C5C]/20 bg-[#f4fafa] hover:border-[#0F5C5C]/50 hover:bg-[#e6f4f4]/50'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-[#0F5C5C]/20 border-t-[#0F5C5C] rounded-full animate-spin" />
                <p className="text-[13px] text-[#0F5C5C] font-semibold">Uploading…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#e6f4f4] border border-[#0F5C5C]/20 flex items-center justify-center text-2xl">
                  📤
                </div>
                <p className="text-[13.5px] font-semibold text-[#0F5C5C]">
                  {dragOver ? 'Drop images here' : 'Click or drag & drop images'}
                </p>
                <p className="text-[11.5px] text-gray-400">JPG, PNG, WebP — up to 5MB each · multiple allowed</p>
              </div>
            )}
          </div>

          {/* Uploaded previews */}
          {filled.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {filled.map((url, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-[#e6f4f4] aspect-square bg-[#f4fafa]">
                  <img src={url} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                  <button
                    type="button"
                    onClick={() => onChange(gallery.filter((_, idx) => idx !== gallery.indexOf(url)))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
                  >×</button>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-gray-400">{filled.length} image{filled.length !== 1 ? 's' : ''} in gallery</p>
        </div>
      )}
    </div>
  );
}

// ─── Edit Hospital Modal ───────────────────────────────────────────────────────
function EditHospitalModal({ hospital, onClose, onSuccess, token }) {
  const [form, setForm] = useState({
    name:        hospital.name        || '',
    city:        hospital.city        || '',
    state:       hospital.state       || '',
    address:     hospital.address     || '',
    phone:       hospital.phone       || '',
    email:       hospital.email       || '',
    about:       hospital.about       || '',
    tag:         hospital.tag         || '',
    rating:      hospital.rating      ?? '',
    reviews:     hospital.reviews     ?? '',
    verified:    hospital.verified    || false,
    emergency:   hospital.emergency   || false,
    opening:     hospital.opening     || '',
    closing:     hospital.closing     || '',
    map_embed:   hospital.map_embed   || '',
    image:       hospital.image       || '',
    gallery:     Array.isArray(hospital.gallery) ? hospital.gallery : [],
    specialities: Array.isArray(hospital.specialities) ? hospital.specialities : [],
  });

  const [specialityInput, setSpecialityInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const addSpeciality = () => {
    const v = specialityInput.trim();
    if (v && !form.specialities.includes(v)) {
      set('specialities', [...form.specialities, v]);
    }
    setSpecialityInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Hospital name is required'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/hospitals/${hospital.id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify({
          ...form,
          gallery:     form.gallery.filter(Boolean),
          rating:      form.rating  ? parseFloat(form.rating)  : 0,
          reviews:     form.reviews ? parseInt(form.reviews)   : 0,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update');
      }
      onSuccess('Hospital updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { key: 'basic',   label: 'Basic Info' },
    { key: 'details', label: 'Details'    },
    { key: 'media',   label: 'Media'      },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F5C5C]/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[580px] mx-4 bg-white border border-[#e6f4f4] rounded-2xl shadow-2xl shadow-[#0F5C5C]/10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#e6f4f4] shrink-0">
          <div>
            <h3 className="text-lg font-bold text-[#0F5C5C]">Edit Hospital</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">{hospital.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#0F5C5C] hover:bg-[#e6f4f4] rounded-lg px-2 py-1 text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e6f4f4] shrink-0 px-7">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`py-3 px-4 text-[12px] font-bold uppercase tracking-wider border-b-2 transition-all -mb-px ${
                activeTab === t.key
                  ? 'border-[#0F5C5C] text-[#0F5C5C]'
                  : 'border-transparent text-gray-400 hover:text-[#0F5C5C]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-7 py-5">
          <form id="edit-hospital-form" onSubmit={handleSubmit}>

            {/* ── Basic Info ── */}
            {activeTab === 'basic' && (
              <div className="space-y-3">
                <MField label="Hospital Name *">
                  <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Apollo Hospital" />
                </MField>
                <div className="grid grid-cols-2 gap-3">
                  <MField label="City">
                    <input className={inputCls} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Moradabad" />
                  </MField>
                  <MField label="State">
                    <input className={inputCls} value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="Uttar Pradesh" />
                  </MField>
                </div>
                <MField label="Address">
                  <textarea className={textareaCls} rows={2} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="123 Main Road..." />
                </MField>
                <div className="grid grid-cols-2 gap-3">
                  <MField label="Phone">
                    <input className={inputCls} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
                  </MField>
                  <MField label="Email">
                    <input type="email" className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="info@hospital.com" />
                  </MField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MField label="Opening Time">
                    <input className={inputCls} value={form.opening} onChange={(e) => set('opening', e.target.value)} placeholder="8:00 AM" />
                  </MField>
                  <MField label="Closing Time">
                    <input className={inputCls} value={form.closing} onChange={(e) => set('closing', e.target.value)} placeholder="9:00 PM" />
                  </MField>
                </div>
              </div>
            )}

            {/* ── Details ── */}
            {activeTab === 'details' && (
              <div className="space-y-3">
                <MField label="About">
                  <textarea className={textareaCls} rows={4} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="Describe the hospital…" />
                </MField>
                <div className="grid grid-cols-3 gap-3">
                  <MField label="Tag / Badge">
                    <input className={inputCls} value={form.tag} onChange={(e) => set('tag', e.target.value)} placeholder="Best for Heart" />
                  </MField>
                  <MField label="Rating (0–5)">
                    <input type="number" step="0.1" min="0" max="5" className={inputCls} value={form.rating} onChange={(e) => set('rating', e.target.value)} placeholder="4.8" />
                  </MField>
                  <MField label="Reviews">
                    <input type="number" className={inputCls} value={form.reviews} onChange={(e) => set('reviews', e.target.value)} placeholder="312" />
                  </MField>
                </div>
                <MField label="Specialities">
                  <div className="flex gap-2 mb-2">
                    <input
                      className={inputCls}
                      value={specialityInput}
                      onChange={(e) => setSpecialityInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSpeciality(); } }}
                      placeholder="e.g. Cardiology"
                    />
                    <button type="button" onClick={addSpeciality}
                      className="px-4 py-2.5 rounded-[10px] bg-[#e6f4f4] border border-[#0F5C5C]/20 text-[#0F5C5C] text-sm font-semibold hover:bg-[#0F5C5C] hover:text-white transition-all shrink-0">
                      Add
                    </button>
                  </div>
                  {form.specialities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.specialities.map((s) => (
                        <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f4f4] text-[#0F5C5C] text-xs font-semibold">
                          {s}
                          <button type="button" onClick={() => set('specialities', form.specialities.filter((x) => x !== s))}
                            className="text-[#0F5C5C]/60 hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </MField>
                <MField label="Google Maps Embed URL">
                  <input className={inputCls} value={form.map_embed} onChange={(e) => set('map_embed', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
                </MField>
                <div className="grid grid-cols-2 gap-3">
                  <MField label="Verified">
                    <Toggle label="Verified ✓" value={form.verified} onChange={(v) => set('verified', v)} />
                  </MField>
                  <MField label="24/7 Emergency">
                    <Toggle label="Emergency 24/7" value={form.emergency} onChange={(v) => set('emergency', v)} />
                  </MField>
                </div>
              </div>
            )}

            {/* ── Media ── */}
            {activeTab === 'media' && (
              <div className="space-y-4">
                <MField label="Cover Image URL">
                  <input className={inputCls} value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://example.com/hospital.jpg" />
                  {form.image && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-[#e6f4f4] h-32">
                      <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                </MField>
                <MField label={`Gallery Images (${form.gallery.filter(Boolean).length} added)`}>
                  <GalleryManager
  gallery={form.gallery}
  onChange={(v) => set('gallery', v)}
  token={token}   // already available in EditHospitalModal props
/>
                </MField>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-500">
                <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold shrink-0">✕</span>
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-7 py-4 border-t border-[#e6f4f4] shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2.5 rounded-[10px] bg-[#f4fafa] border border-[#e6f4f4] text-gray-500 hover:text-[#0F5C5C] text-sm font-semibold transition-all">
            Cancel
          </button>
          <button type="submit" form="edit-hospital-form" disabled={submitting}
            className="px-5 py-2.5 rounded-[10px] bg-[#0F5C5C] hover:bg-[#177a7a] text-white text-sm font-semibold disabled:opacity-50 transition-all flex items-center gap-2">
            {submitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main HospitalsTab ────────────────────────────────────────────────────────
export default function HospitalsTab({ token, hospitals, loading, onRefresh, showToast }) {
  const [showAdd, setShowAdd]         = useState(false);
  const [editingHospital, setEditing] = useState(null);

  const deleteHospital = async (id) => {
    if (!confirm('Delete this hospital? Assigned doctors will become unassigned.')) return;
    await fetch(`${API}/hospitals/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    onRefresh();
    showToast('Hospital deleted');
  };

  if (showAdd) {
    return (
      <AddHospitalPage
        onBack={() => setShowAdd(false)}
        onSuccess={(msg) => { setShowAdd(false); onRefresh(); showToast(msg); }}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2 className="text-[26px] text-gray-800 font-semibold tracking-tight">Hospitals</h2>
          <p className="text-[13px] text-teal-600 mt-1">Manage all registered hospitals in the network.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-400 text-white text-[13.5px] font-semibold shadow-lg shadow-teal-500/20 hover:opacity-90 transition-all"
        >
          + Add Hospital
        </button>
      </div>

      {/* Table */}
      <div className="bg-teal-800 border border-teal-500/[0.15] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-teal-500/[0.04]">
              {['Name', 'City', 'State', 'Phone', 'Email', 'Verified', 'Emergency', 'Actions'].map((h) => (
                <th key={h} className="px-5 py-2.5 text-left text-[11px] uppercase tracking-wider text-teal-200 font-semibold border-b border-teal-500/[0.1]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-12 text-teal-200 text-sm">Loading...</td></tr>
            ) : hospitals.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="py-12 text-center">
                    <div className="text-3xl opacity-30 mb-2">🏥</div>
                    <p className="text-[13.5px] text-teal-200">No hospitals yet. Add one to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              hospitals.map((h) => (
                <tr key={h.id} className="hover:bg-teal-500/[0.04] transition-colors">
                  <td className="px-5 py-3.5 text-[13.5px] font-medium text-teal-50 border-b border-teal-500/[0.08]">{h.name}</td>
                  <td className="px-5 py-3.5 text-[13.5px] text-teal-200/70 border-b border-teal-500/[0.08]">{h.city || '—'}</td>
                  <td className="px-5 py-3.5 text-[13.5px] text-teal-200/70 border-b border-teal-500/[0.08]">{h.state || '—'}</td>
                  <td className="px-5 py-3.5 text-[13.5px] text-teal-200/70 border-b border-teal-500/[0.08]">{h.phone || '—'}</td>
                  <td className="px-5 py-3.5 text-[12.5px] text-teal-200/50 border-b border-teal-500/[0.08]">{h.email || '—'}</td>
                  <td className="px-5 py-3.5 border-b border-teal-500/[0.08]">
                    {h.verified
                      ? <span className="px-2.5 py-0.5 rounded-full text-xs bg-teal-500/10 text-teal-400">✓ Yes</span>
                      : <span className="text-teal-800 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3.5 border-b border-teal-500/[0.08]">
                    {h.emergency
                      ? <span className="px-2.5 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400">24/7</span>
                      : <span className="text-teal-800 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3.5 border-b border-teal-500/[0.08]">
                    <div className="flex items-center gap-1.5">
                      {/* ── Edit button ── */}
                      <button
                        onClick={() => setEditing(h)}
                        className="text-[12px] text-cyan-300/70 border border-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-200 hover:bg-cyan-500/[0.08] px-3 py-1.5 rounded-lg transition-all font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteHospital(h.id)}
                        className="text-[12px] text-red-300/60 border border-red-500/20 hover:border-red-500/40 hover:text-red-300 hover:bg-red-500/[0.08] px-3 py-1.5 rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editingHospital && (
        <EditHospitalModal
          hospital={editingHospital}
          token={token}
          onClose={() => setEditing(null)}
          onSuccess={(msg) => { setEditing(null); onRefresh(); showToast(msg); }}
        />
      )}
    </div>
  );
}