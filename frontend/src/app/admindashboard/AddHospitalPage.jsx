'use client';

import { useState } from 'react';

const API = 'http://localhost:5000/api';

function authHeaders() {
  const token = localStorage.getItem('zentrix_token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

// ── Reusable field wrapper ───────────────────────────────────────────────────
function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-[11.5px] font-semibold text-[#0F5C5C]/60 uppercase tracking-widest mb-1.5">
        {label} {required && <span className="text-[#0F5C5C]">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

const inp =
  'w-full bg-[#f4fafa] border border-[#e6f4f4] rounded-xl px-4 py-2.5 text-[#1a3333] text-sm placeholder:text-gray-400 outline-none transition-all focus:border-[#0F5C5C]/50 focus:ring-2 focus:ring-[#0F5C5C]/10 focus:bg-white';

const textarea =
  'w-full bg-[#f4fafa] border border-[#e6f4f4] rounded-xl px-4 py-2.5 text-[#1a3333] text-sm placeholder:text-gray-400 outline-none transition-all focus:border-[#0F5C5C]/50 focus:ring-2 focus:ring-[#0F5C5C]/10 focus:bg-white resize-none';

// ── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ['Basic Info', 'Details', 'Media', 'Doctors', 'Review'];

function StepBar({ current }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${i < current  ? 'bg-[#0F5C5C] border-[#0F5C5C] text-white'
                : i === current ? 'bg-[#e6f4f4] border-[#0F5C5C] text-[#0F5C5C]'
                : 'bg-white border-[#e6f4f4] text-gray-400'}`}
            >
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`mt-1.5 text-[10.5px] font-semibold whitespace-nowrap
              ${i === current ? 'text-[#0F5C5C]' : i < current ? 'text-[#0F5C5C]/60' : 'text-gray-400'}`}>
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-2 mb-5 transition-all ${i < current ? 'bg-[#0F5C5C]/40' : 'bg-[#e6f4f4]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Tag input ────────────────────────────────────────────────────────────────
function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const add = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput('');
  };
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input className={inp} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder} />
        <button type="button" onClick={add}
          className="px-4 py-2.5 rounded-xl bg-[#e6f4f4] border border-[#0F5C5C]/20 text-[#0F5C5C] text-sm font-semibold hover:bg-[#0F5C5C] hover:text-white transition-all shrink-0">
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f4f4] border border-[#0F5C5C]/20 text-[#0F5C5C] text-xs font-semibold">
              {t}
              <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}
                className="text-[#0F5C5C]/60 hover:text-red-400 transition-colors">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Timing row ───────────────────────────────────────────────────────────────
function TimingRow({ timing, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-center">
      <input className={inp + ' flex-1'} placeholder="e.g. Monday – Friday"
        value={timing.day} onChange={(e) => onChange({ ...timing, day: e.target.value })} />
      <input className={inp + ' flex-1'} placeholder="e.g. 8:00 AM – 9:00 PM"
        value={timing.time} onChange={(e) => onChange({ ...timing, time: e.target.value })} />
      <button type="button" onClick={onRemove}
        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl border border-red-200 text-red-400/60 hover:text-red-500 hover:border-red-400 hover:bg-red-50 transition-all text-lg">
        ×
      </button>
    </div>
  );
}

// ── Doctor row ───────────────────────────────────────────────────────────────
function DoctorRow({ doc, onChange, onRemove }) {
  return (
    <div className="bg-[#f4fafa] border border-[#e6f4f4] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#0F5C5C]/60 uppercase tracking-widest">Doctor</span>
        <button type="button" onClick={onRemove} className="text-red-400/60 hover:text-red-500 text-sm transition-colors font-semibold">Remove</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className={inp} placeholder="Full Name *" value={doc.name} onChange={(e) => onChange({ ...doc, name: e.target.value })} />
        <input className={inp} placeholder="Specialization" value={doc.specialization} onChange={(e) => onChange({ ...doc, specialization: e.target.value })} />
        <input className={inp} placeholder="Experience (e.g. 12 yrs)" value={doc.experience} onChange={(e) => onChange({ ...doc, experience: e.target.value })} />
        <input className={inp} placeholder="Phone" value={doc.phone} onChange={(e) => onChange({ ...doc, phone: e.target.value })} />
        <input className={inp} placeholder="Email" value={doc.email} onChange={(e) => onChange({ ...doc, email: e.target.value })} />
        <input className={inp} placeholder="Photo URL" value={doc.image} onChange={(e) => onChange({ ...doc, image: e.target.value })} />
      </div>
    </div>
  );
}

// ── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ label, value, onChange, description }) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#f4fafa] border border-[#e6f4f4] rounded-xl">
      <div>
        <p className="text-sm font-semibold text-[#1a3333]">{label}</p>
        {description && <p className="text-[11.5px] text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button type="button" onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${value ? 'bg-[#0F5C5C]' : 'bg-gray-200'}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

// ── ReviewRow ─────────────────────────────────────────────────────────────────
function ReviewRow({ label, value }) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-[#e6f4f4] last:border-0">
      <span className="text-[11.5px] font-bold text-[#0F5C5C]/50 uppercase tracking-wider w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-[#1a3333] leading-relaxed break-all">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </span>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AddHospitalPage({ onBack, onSuccess }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', city: '', state: '', address: '', phone: '', email: '',
    about: '', tag: '', rating: '', reviews: '',
    verified: false, emergency: false,
    opening: '', closing: '', map_embed: '',
    specialities: [],
    timings: [{ day: '', time: '' }],
    image: '',
    gallery: ['', '', ''],
    doctors: [],
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    if (step === 0 && !form.name.trim()) { setError('Hospital name is required'); return false; }
    setError(''); return true;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const back = () => { setError(''); setStep((s) => s - 1); };

  const submit = async () => {
    setSubmitting(true); setError('');
    try {
      const payload = {
        ...form,
        gallery: form.gallery.filter(Boolean),
        rating: form.rating ? parseFloat(form.rating) : 0,
        reviews: form.reviews ? parseInt(form.reviews) : 0,
        timings: form.timings.filter((t) => t.day.trim()),
        doctors: form.doctors.filter((d) => d.name.trim()),
      };
      const res = await fetch(`${API}/hospitals`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add hospital');
      onSuccess?.('Hospital added successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Steps ──────────────────────────────────────────────────────────────────
  const steps = [
    // Step 0 — Basic Info
    <div key="0" className="space-y-4">
      <Field label="Hospital Name" required>
        <input className={inp} placeholder="e.g. Apollo Hospital" value={form.name}
          onChange={(e) => set('name', e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="City">
          <input className={inp} placeholder="Moradabad" value={form.city} onChange={(e) => set('city', e.target.value)} />
        </Field>
        <Field label="State">
          <input className={inp} placeholder="Uttar Pradesh" value={form.state} onChange={(e) => set('state', e.target.value)} />
        </Field>
      </div>
      <Field label="Full Address">
        <textarea className={textarea} rows={2} placeholder="123, Main Road, Near Bus Stand..." value={form.address}
          onChange={(e) => set('address', e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone">
          <input className={inp} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" className={inp} placeholder="info@hospital.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Opening Time">
          <input className={inp} placeholder="8:00 AM" value={form.opening} onChange={(e) => set('opening', e.target.value)} />
        </Field>
        <Field label="Closing Time">
          <input className={inp} placeholder="9:00 PM" value={form.closing} onChange={(e) => set('closing', e.target.value)} />
        </Field>
      </div>
    </div>,

    // Step 1 — Details
    <div key="1" className="space-y-4">
      <Field label="About" hint="Describe the hospital's history, capabilities, patient count, etc.">
        <textarea className={textarea} rows={4}
          placeholder="Apollo Hospital Moradabad is a premier multi-speciality hospital..."
          value={form.about} onChange={(e) => set('about', e.target.value)} />
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Tag / Badge">
          <input className={inp} placeholder="Best for Heart" value={form.tag} onChange={(e) => set('tag', e.target.value)} />
        </Field>
        <Field label="Rating (0–5)">
          <input className={inp} type="number" step="0.1" min="0" max="5" placeholder="4.8"
            value={form.rating} onChange={(e) => set('rating', e.target.value)} />
        </Field>
        <Field label="Total Reviews">
          <input className={inp} type="number" placeholder="312" value={form.reviews} onChange={(e) => set('reviews', e.target.value)} />
        </Field>
      </div>
      <Field label="Specialities" hint="Press Enter or click Add after each speciality">
        <TagInput tags={form.specialities} onChange={(v) => set('specialities', v)} placeholder="e.g. Cardiology" />
      </Field>
      <div>
        <label className="block text-[11.5px] font-bold text-[#0F5C5C]/60 uppercase tracking-widest mb-2">Timings</label>
        <div className="space-y-2">
          {form.timings.map((t, i) => (
            <TimingRow key={i} timing={t}
              onChange={(v) => set('timings', form.timings.map((x, j) => j === i ? v : x))}
              onRemove={() => set('timings', form.timings.filter((_, j) => j !== i))} />
          ))}
        </div>
        <button type="button" onClick={() => set('timings', [...form.timings, { day: '', time: '' }])}
          className="mt-2 text-[12px] text-[#0F5C5C] hover:text-[#177a7a] transition-colors flex items-center gap-1 font-semibold">
          + Add timing row
        </button>
      </div>
      <Field label="Google Maps Embed URL" hint="Paste the src URL from a Google Maps embed iframe">
        <input className={inp} placeholder="https://www.google.com/maps/embed?pb=..." value={form.map_embed}
          onChange={(e) => set('map_embed', e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Toggle label="Verified" description="Show verified badge on listing" value={form.verified} onChange={(v) => set('verified', v)} />
        <Toggle label="24/7 Emergency" description="Show emergency badge on listing" value={form.emergency} onChange={(v) => set('emergency', v)} />
      </div>
    </div>,

    // Step 2 — Media
    <div key="2" className="space-y-5">
      <Field label="Main Cover Image URL" hint="Primary image on listing cards">
        <input className={inp} placeholder="https://example.com/hospital.jpg" value={form.image}
          onChange={(e) => set('image', e.target.value)} />
        {form.image && (
          <div className="mt-3 rounded-xl overflow-hidden border border-[#e6f4f4] h-40">
            <img src={form.image} alt="preview" className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </Field>
      <div>
        <label className="block text-[11.5px] font-bold text-[#0F5C5C]/60 uppercase tracking-widest mb-2">
          Gallery Images <span className="normal-case font-normal text-gray-400">(up to 3)</span>
        </label>
        <div className="space-y-3">
          {form.gallery.map((url, i) => (
            <div key={i}>
              <input className={inp} placeholder={`Gallery image ${i + 1} URL`} value={url}
                onChange={(e) => { const g = [...form.gallery]; g[i] = e.target.value; set('gallery', g); }} />
              {url && (
                <div className="mt-2 rounded-lg overflow-hidden border border-[#e6f4f4] h-24">
                  <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>,

    // Step 3 — Doctors
    <div key="3" className="space-y-4">
      <p className="text-[13px] text-gray-400">
        Add doctors at this hospital. You can also manage doctors later from the Doctors section.
      </p>
      {form.doctors.map((doc, i) => (
        <DoctorRow key={i} doc={doc}
          onChange={(v) => set('doctors', form.doctors.map((x, j) => j === i ? v : x))}
          onRemove={() => set('doctors', form.doctors.filter((_, j) => j !== i))} />
      ))}
      <button type="button"
        onClick={() => set('doctors', [...form.doctors, { name: '', specialization: '', experience: '', phone: '', email: '', image: '' }])}
        className="w-full py-3 rounded-xl border border-dashed border-[#0F5C5C]/25 text-[#0F5C5C]/50 hover:text-[#0F5C5C] hover:border-[#0F5C5C]/50 hover:bg-[#e6f4f4] text-sm font-semibold transition-all">
        + Add a Doctor
      </button>
    </div>,

    // Step 4 — Review
    <div key="4" className="space-y-4">
      <div className="bg-[#f4fafa] border border-[#e6f4f4] rounded-xl p-5">
        <h4 className="text-xs font-bold text-[#0F5C5C]/60 uppercase tracking-widest mb-3">Basic Info</h4>
        <ReviewRow label="Name" value={form.name} />
        <ReviewRow label="City / State" value={[form.city, form.state].filter(Boolean).join(', ')} />
        <ReviewRow label="Address" value={form.address} />
        <ReviewRow label="Phone" value={form.phone} />
        <ReviewRow label="Email" value={form.email} />
        <ReviewRow label="Hours" value={form.opening && form.closing ? `${form.opening} – ${form.closing}` : null} />
      </div>
      <div className="bg-[#f4fafa] border border-[#e6f4f4] rounded-xl p-5">
        <h4 className="text-xs font-bold text-[#0F5C5C]/60 uppercase tracking-widest mb-3">Details</h4>
        <ReviewRow label="Tag" value={form.tag} />
        <ReviewRow label="Rating" value={form.rating || '0'} />
        <ReviewRow label="Verified" value={form.verified ? 'Yes ✓' : 'No'} />
        <ReviewRow label="Emergency" value={form.emergency ? '24/7 ✓' : 'No'} />
        <ReviewRow label="Specialities" value={form.specialities.join(', ')} />
        <ReviewRow label="Timings" value={form.timings.filter((t) => t.day).map((t) => `${t.day}: ${t.time}`).join(' · ')} />
      </div>
      <div className="bg-[#f4fafa] border border-[#e6f4f4] rounded-xl p-5">
        <h4 className="text-xs font-bold text-[#0F5C5C]/60 uppercase tracking-widest mb-3">Media & Doctors</h4>
        <ReviewRow label="Cover Image" value={form.image} />
        <ReviewRow label="Gallery" value={`${form.gallery.filter(Boolean).length} images`} />
        <ReviewRow label="Doctors" value={`${form.doctors.filter((d) => d.name).length} added`} />
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-[#f4fafa]">
      {/* Sticky header */}
      <div className="border-b border-[#e6f4f4] bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={onBack} className="text-gray-400 hover:text-[#0F5C5C] transition-colors flex items-center gap-1.5 text-sm font-semibold">
            ← Back
          </button>
          <div className="w-px h-4 bg-[#e6f4f4]" />
          <div>
            <h1 className="text-base font-bold text-[#0F5C5C]">Add New Hospital</h1>
            <p className="text-[11.5px] text-gray-400">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <StepBar current={step} />

        {/* Form card */}
        <div className="bg-white border border-[#e6f4f4] rounded-2xl p-7 shadow-sm">
          <h2 className="text-lg font-bold text-[#0F5C5C] mb-1">{STEPS[step]}</h2>
          <p className="text-[12.5px] text-gray-400 mb-6">
            {['Fill in the core contact details about the hospital.',
              'Add description, specialities, timings and more.',
              'Upload images that appear on the public listing.',
              'Optionally add doctors associated with this hospital.',
              'Review all details before submitting.'][step]}
          </p>

          {steps[step]}

          {error && (
            <div className="mt-5 flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-500">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold shrink-0">✕</span>
              {error}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-5">
          <button type="button" onClick={step === 0 ? onBack : back}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#e6f4f4] text-gray-500 hover:text-[#0F5C5C] hover:border-[#0F5C5C]/30 text-sm font-semibold transition-all">
            {step === 0 ? 'Cancel' : '← Back'}
          </button>

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next}
              className="px-6 py-2.5 rounded-xl bg-[#0F5C5C] hover:bg-[#177a7a] text-white text-sm font-semibold shadow-lg shadow-[#0F5C5C]/20 transition-all">
              Continue →
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#0F5C5C] hover:bg-[#177a7a] text-white text-sm font-semibold shadow-lg shadow-[#0F5C5C]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all">
              {submitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {submitting ? 'Saving...' : '✓ Add Hospital'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}