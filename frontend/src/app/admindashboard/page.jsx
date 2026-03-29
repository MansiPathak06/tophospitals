'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import HospitalsTab from './HospitalsTab';
import BlogsTab from './BlogsTab';
import Navbar from '@/components/Navbar';

const API = 'http://localhost:5000/api';

function authHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, visible }) {
  return (
    <div
      className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl text-[13.5px] shadow-2xl transition-all duration-300 pointer-events-none
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
        ${type === 'success'
          ? 'bg-[#0F5C5C] text-white border border-[#2ec4a0]/40'
          : 'bg-red-500 text-white border border-red-400/40'}`}
    >
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 bg-white/20">
        {type === 'success' ? '✓' : '✕'}
      </span>
      {message}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F5C5C]/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full sm:max-w-[480px] sm:mx-4 bg-white border border-[#e6f4f4] rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#0F5C5C]/10 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[#0F5C5C]">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#0F5C5C] hover:bg-[#e6f4f4] rounded-lg px-2 py-1 text-sm transition-all"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function MField({ label, children }) {
  return (
    <div className="mb-3.5">
      <label className="block text-[11.5px] font-semibold text-[#0F5C5C]/60 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-[#f4fafa] border border-[#e6f4f4] rounded-[10px] px-3.5 py-2.5 text-[#1a3333] text-[13.5px] placeholder:text-gray-400 outline-none transition-all focus:border-[#0F5C5C]/50 focus:bg-white focus:ring-2 focus:ring-[#0F5C5C]/10';

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ children, color = 'teal' }) {
  const colors = {
    teal:  'bg-[#e6f4f4] text-[#0F5C5C]',
    green: 'bg-[#2ec4a0]/15 text-[#0a7a5c]',
    gray:  'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, accent }) {
  const accents = {
    teal:  'bg-[#e6f4f4]',
    green: 'bg-[#2ec4a0]/15',
    amber: 'bg-amber-50',
  };
  return (
    <div className="bg-white border border-[#e6f4f4] rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-md hover:border-[#0F5C5C]/20 transition-all duration-200">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-[13px] ${accents[accent]} flex items-center justify-center text-lg sm:text-xl shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-bold text-[#0F5C5C] leading-none">{value}</div>
        <div className="text-[11.5px] sm:text-[12.5px] text-gray-400 mt-1.5">{label}</div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ icon, text }) {
  return (
    <tr>
      <td colSpan={99}>
        <div className="py-12 text-center">
          <div className="text-3xl opacity-30 mb-2">{icon}</div>
          <p className="text-[13.5px] text-gray-400">{text}</p>
        </div>
      </td>
    </tr>
  );
}

// ─── Edit Doctor Modal ────────────────────────────────────────────────────────
function EditDoctorModal({ doctor, hospitals, token, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name:           doctor.name           || '',
    specialization: doctor.specialization || '',
    experience:     doctor.experience     || '',
    phone:          doctor.phone          || '',
    email:          doctor.email          || '',
    image:          doctor.image          || '',
    hospital_id:    doctor.hospital_id    ? String(doctor.hospital_id) : '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Doctor name is required'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/doctors/${doctor.id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify({
          ...form,
          hospital_id: form.hospital_id || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update');
      }
      onSuccess('Doctor updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Edit Doctor">
      <form onSubmit={handleSubmit}>
        <MField label="Doctor Name *">
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Dr. Arun Sharma" />
        </MField>
        <MField label="Specialization">
          <input className={inputCls} value={form.specialization} onChange={(e) => set('specialization', e.target.value)} placeholder="Cardiologist" />
        </MField>
        <MField label="Experience">
          <input className={inputCls} value={form.experience} onChange={(e) => set('experience', e.target.value)} placeholder="12 years" />
        </MField>
        <MField label="Assign to Hospital">
          <select
            value={form.hospital_id}
            onChange={(e) => set('hospital_id', e.target.value)}
            className={inputCls + ' [&>option]:bg-white'}
          >
            <option value="">— Unassigned —</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </MField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MField label="Phone">
            <input className={inputCls} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
          </MField>
          <MField label="Email">
            <input type="email" className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="doctor@hospital.com" />
          </MField>
        </div>
        <MField label="Photo URL">
          <input className={inputCls} value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://example.com/photo.jpg" />
          {form.image && (
            <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-[#e6f4f4]">
              <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}
        </MField>

        {error && (
          <div className="mb-4 flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-500">
            <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold shrink-0">✕</span>
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[#e6f4f4]">
          <button type="button" onClick={onClose}
            className="px-4 py-2.5 rounded-[10px] bg-[#f4fafa] border border-[#e6f4f4] text-gray-500 hover:text-[#0F5C5C] text-sm transition-all">
            Cancel
          </button>
          <button type="submit" disabled={submitting}
            className="px-5 py-2.5 rounded-[10px] bg-[#0F5C5C] hover:bg-[#177a7a] text-white text-sm font-semibold disabled:opacity-50 transition-all flex items-center gap-2">
            {submitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('zentrix_token') || '';
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [activePage, setActivePage] = useState('overview');
  const [hospitals, setHospitals]   = useState([]);
  const [doctors, setDoctors]       = useState([]);
  const [loading, setLoading]       = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false); // ← mobile sidebar toggle

  const [hospitalModal, setHospitalModal] = useState(false);
  const [doctorModal, setDoctorModal]     = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [submitting, setSubmitting]       = useState(false);

  // Hospital form
  const [hName, setHName]       = useState('');
  const [hCity, setHCity]       = useState('');
  const [hState, setHState]     = useState('');
  const [hAddress, setHAddress] = useState('');
  const [hPhone, setHPhone]     = useState('');
  const [hEmail, setHEmail]     = useState('');

  // Doctor form (add new)
  const [dName, setDName]         = useState('');
  const [dSpec, setDSpec]         = useState('');
  const [dPhone, setDPhone]       = useState('');
  const [dEmail, setDEmail]       = useState('');
  const [dHospital, setDHospital] = useState('');

  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = localStorage.getItem('zentrix_token');
    const e = localStorage.getItem('zentrix_email');
    if (!t) { router.replace('/login'); return; }
    setToken(t);
    setAdminEmail(e || '');
  }, [router]);

  // ── Close sidebar on route change (mobile) ──────────────────────────────────
  useEffect(() => {
    setSidebarOpen(false);
  }, [activePage]);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchHospitals = useCallback(async (t) => {
    const res = await fetch(`${API}/hospitals`, { headers: authHeaders(t) });
    if (res.status === 401) { logout(); return []; }
    return res.json();
  }, []);

  const fetchDoctors = useCallback(async (t) => {
    const res = await fetch(`${API}/doctors`, { headers: authHeaders(t) });
    if (res.status === 401) { logout(); return []; }
    return res.json();
  }, []);

  const loadAll = useCallback(async (t) => {
    setLoading(true);
    try {
      const [h, d] = await Promise.all([fetchHospitals(t), fetchDoctors(t)]);
      setHospitals(h || []);
      setDoctors(d || []);
    } finally {
      setLoading(false);
    }
  }, [fetchHospitals, fetchDoctors]);

  useEffect(() => {
    if (token) loadAll(token);
  }, [token, loadAll]);

  // ── Toast ───────────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3000);
  }, []);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('zentrix_token');
    localStorage.removeItem('zentrix_email');
    router.replace('/login');
  };

  // ── Add Hospital ────────────────────────────────────────────────────────────
  const addHospital = async (e) => {
    e.preventDefault();
    if (!hName.trim()) { showToast('Hospital name is required', 'error'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/hospitals`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ name: hName, city: hCity, state: hState, address: hAddress, phone: hPhone, email: hEmail }),
      });
      if (!res.ok) throw new Error();
      setHospitalModal(false);
      setHName(''); setHCity(''); setHState(''); setHAddress(''); setHPhone(''); setHEmail('');
      await loadAll(token);
      showToast('Hospital added successfully');
    } catch { showToast('Error adding hospital', 'error'); }
    finally { setSubmitting(false); }
  };

  // ── Add Doctor ──────────────────────────────────────────────────────────────
  const addDoctor = async (e) => {
    e.preventDefault();
    if (!dName.trim()) { showToast('Doctor name is required', 'error'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/doctors`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ name: dName, specialization: dSpec, phone: dPhone, email: dEmail, hospital_id: dHospital || null }),
      });
      if (!res.ok) throw new Error();
      setDoctorModal(false);
      setDName(''); setDSpec(''); setDPhone(''); setDEmail(''); setDHospital('');
      await loadAll(token);
      showToast('Doctor added successfully');
    } catch { showToast('Error adding doctor', 'error'); }
    finally { setSubmitting(false); }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const deleteHospital = async (id) => {
    if (!confirm('Delete this hospital? Assigned doctors will become unassigned.')) return;
    await fetch(`${API}/hospitals/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    await loadAll(token);
    showToast('Hospital deleted');
  };

  const deleteDoctor = async (id) => {
    if (!confirm('Delete this doctor?')) return;
    await fetch(`${API}/doctors/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    await loadAll(token);
    showToast('Doctor deleted');
  };

  const assignedCount = doctors.filter((d) => d.hospital_id).length;

  const navItems = [
    { key: 'overview',  label: 'Dashboard',  icon: '⊞'  },
    { key: 'hospitals', label: 'Hospitals',   icon: '🏥' },
    { key: 'doctors',   label: 'Doctors',     icon: '👨‍⚕️' },
    { key: 'blogs',     label: 'Blog Posts',  icon: '📝' },
  ];

  return (
    <div className="min-h-screen bg-[#f4fafa] flex font-sans text-[#1a3333]">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Top Navbar ── */}
      <div className="fixed top-0 left-0 lg:left-[236px] right-0 z-40">
        {/* Mobile hamburger bar */}
        <div className="flex items-center lg:hidden bg-[#0F5C5C] px-4 py-3 gap-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-white text-xl w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all"
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <span className="text-white font-bold text-[15px]  tracking-tight">Admin Panel</span>
        </div>
        {/* Original Navbar rendered only on lg+ */}
        <div className="hidden lg:block">
          <Navbar />
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[236px] bg-[#0F5C5C] flex flex-col z-50 shadow-xl shadow-[#0F5C5C]/20
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
      >
        {/* Mobile close button inside sidebar */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 lg:hidden">
          <span className="text-white font-bold text-sm tracking-widest uppercase opacity-60">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/60 hover:text-white text-lg w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 mt-2">
          <p className="hidden lg:block px-3 mb-2 text-[10.5px] uppercase tracking-widest text-white/40 font-semibold">Menu</p>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] mb-0.5 text-[13.5px] text-left transition-all
                ${activePage === item.key
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 bg-white/10 border border-white/10 rounded-[11px] px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2ec4a0] flex items-center justify-center text-xs font-bold text-white shrink-0">
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-medium text-white/80 truncate">{adminEmail}</p>
              <p className="text-[11px] text-white/40 mt-0.5">Administrator</p>
            </div>
            <button onClick={logout} title="Logout" className="text-white/40 hover:text-red-300 text-sm transition-colors p-1">↩</button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      {/* On mobile: no left margin (sidebar is overlay). On lg+: ml-[236px] */}
      <main className="w-full lg:ml-[236px] flex-1 p-4 sm:p-6 lg:p-9 min-h-screen pt-[56px] lg:pt-[80px]">

        {/* ── Overview ── */}
        {activePage === 'overview' && (
          <div>
            <div className="mb-6 sm:mb-7">
              <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest mt-2 uppercase mb-1">Admin Panel</p>
              <h2 className="text-[22px] sm:text-[26px] font-bold text-[#0F5C5C] tracking-tight">Welcome back 👋</h2>
              <p className="text-[13px] text-gray-400 mt-1">Here's a snapshot of your hospital network.</p>
            </div>
            {/* Stat cards: 1 col on xs, 2 on sm, 3 on md+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-7">
              <StatCard icon="🏥" value={hospitals.length} label="Total Hospitals" accent="teal" />
              <StatCard icon="👨‍⚕️" value={doctors.length} label="Total Doctors" accent="green" />
              <StatCard icon="🔗" value={assignedCount} label="Assigned Doctors" accent="amber" />
            </div>
            <div className="bg-white border border-[#e6f4f4] rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 sm:px-5 py-4 border-b border-[#e6f4f4] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F5C5C] uppercase tracking-wide">Recent Hospitals</h3>
                <button onClick={() => setActivePage('hospitals')} className="text-xs text-[#0F5C5C] font-semibold hover:underline">View All →</button>
              </div>
              {/* Scrollable table on small screens */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="bg-[#f4fafa]">
                      {['Name', 'City', 'Phone', 'Added'].map((h) => (
                        <th key={h} className="px-4 sm:px-5 py-2.5 text-left text-[11px] uppercase tracking-wider text-[#0F5C5C]/50 font-bold border-b border-[#e6f4f4]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={4} className="text-center py-12 text-gray-400 text-sm">Loading...</td></tr>
                    ) : hospitals.length === 0 ? (
                      <EmptyState icon="🏥" text="No hospitals added yet." />
                    ) : (
                      hospitals.slice(0, 5).map((h) => (
                        <tr key={h.id} className="hover:bg-[#f4fafa] transition-colors">
                          <td className="px-4 sm:px-5 py-3.5 text-[13.5px] font-semibold text-[#0F5C5C] border-b border-[#e6f4f4]">{h.name}</td>
                          <td className="px-4 sm:px-5 py-3.5 text-[13.5px] text-gray-500 border-b border-[#e6f4f4]">{h.city || '—'}</td>
                          <td className="px-4 sm:px-5 py-3.5 text-[13.5px] text-gray-500 border-b border-[#e6f4f4]">{h.phone || '—'}</td>
                          <td className="px-4 sm:px-5 py-3.5 text-[12px] text-gray-400 border-b border-[#e6f4f4]">{new Date(h.created_at).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Hospitals Tab ── */}
        {activePage === 'hospitals' && (
          <HospitalsTab
            token={token}
            hospitals={hospitals}
            loading={loading}
            onRefresh={() => loadAll(token)}
            showToast={showToast}
          />
        )}

        {/* ── Doctors ── */}
        {activePage === 'doctors' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 sm:mb-7">
              <div>
                <p className="text-[#0F5C5C] text-[11px] font-bold mt-2 tracking-widest uppercase mb-1">Manage</p>
                <h2 className="text-[22px] sm:text-[26px] font-bold text-[#0F5C5C] tracking-tight">Doctors</h2>
                <p className="text-[13px] text-gray-400 mt-1">Manage doctors and their hospital assignments.</p>
              </div>
              <button
                onClick={() => setDoctorModal(true)}
                className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F5C5C] hover:bg-[#177a7a] text-white text-[13.5px] font-semibold shadow-lg shadow-[#0F5C5C]/20 transition-all whitespace-nowrap"
              >
                + Add Doctor
              </button>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white border border-[#e6f4f4] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-[#f4fafa]">
                      {['Name', 'Specialization', 'Hospital', 'Phone', 'Email', 'Actions'].map((h) => (
                        <th key={h} className="px-5 py-2.5 text-left text-[11px] uppercase tracking-wider text-[#0F5C5C]/50 font-bold border-b border-[#e6f4f4]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Loading...</td></tr>
                    ) : doctors.length === 0 ? (
                      <EmptyState icon="👨‍⚕️" text="No doctors yet. Add one to get started." />
                    ) : (
                      doctors.map((d) => (
                        <tr key={d.id} className="hover:bg-[#f4fafa] transition-colors">
                          <td className="px-5 py-3.5 text-[13.5px] font-semibold text-[#0F5C5C] border-b border-[#e6f4f4]">
                            <div className="flex items-center gap-2.5">
                              {d.image && (
                                <img src={d.image} alt="" className="w-8 h-8 rounded-full object-cover border border-[#e6f4f4]"
                                  onError={(e) => { e.target.style.display = 'none'; }} />
                              )}
                              {d.name}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 border-b border-[#e6f4f4]">
                            {d.specialization ? <Badge color="teal">{d.specialization}</Badge> : <Badge color="gray">General</Badge>}
                          </td>
                          <td className="px-5 py-3.5 border-b border-[#e6f4f4]">
                            {d.hospital_name ? <Badge color="green">{d.hospital_name}</Badge> : <span className="text-[13px] text-gray-400">Unassigned</span>}
                          </td>
                          <td className="px-5 py-3.5 text-[13.5px] text-gray-500 border-b border-[#e6f4f4]">{d.phone || '—'}</td>
                          <td className="px-5 py-3.5 text-[12.5px] text-gray-400 border-b border-[#e6f4f4]">{d.email || '—'}</td>
                          <td className="px-5 py-3.5 border-b border-[#e6f4f4]">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setEditingDoctor(d)}
                                className="text-[12px] text-[#0F5C5C]/70 border border-[#0F5C5C]/20 hover:border-[#0F5C5C]/50 hover:bg-[#e6f4f4] hover:text-[#0F5C5C] px-3 py-1.5 rounded-lg transition-all font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteDoctor(d.id)}
                                className="text-[12px] text-red-400 border border-red-200 hover:border-red-400 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
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
            </div>

            {/* Mobile card list */}
            <div className="md:hidden space-y-3">
              {loading ? (
                <div className="text-center py-15 text-gray-400 text-sm bg-white rounded-2xl border border-[#e6f4f4]">Loading...</div>
              ) : doctors.length === 0 ? (
                <div className="py-12 text-center bg-white rounded-2xl border border-[#e6f4f4]">
                  <div className="text-3xl opacity-30 mb-2">👨‍⚕️</div>
                  <p className="text-[13.5px] text-gray-400">No doctors yet. Add one to get started.</p>
                </div>
              ) : (
                doctors.map((d) => (
                  <div key={d.id} className="bg-white border border-[#e6f4f4] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      {d.image && (
                        <img src={d.image} alt="" className="w-10 h-10 rounded-full object-cover border border-[#e6f4f4] shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-[#0F5C5C] truncate">{d.name}</p>
                        <div className="mt-1">
                          {d.specialization ? <Badge color="teal">{d.specialization}</Badge> : <Badge color="gray">General</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-[12.5px] mb-3">
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-[#0F5C5C]/40 w-4">🏥</span>
                        {d.hospital_name ? <Badge color="green">{d.hospital_name}</Badge> : <span className="text-gray-400">Unassigned</span>}
                      </div>
                      {d.phone && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <span className="text-[#0F5C5C]/40 w-4">📞</span>
                          {d.phone}
                        </div>
                      )}
                      {d.email && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="text-[#0F5C5C]/40 w-4">✉</span>
                          <span className="truncate">{d.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-[#e6f4f4]">
                      <button
                        onClick={() => setEditingDoctor(d)}
                        className="flex-1 text-[12.5px] text-[#0F5C5C] border border-[#0F5C5C]/20 hover:bg-[#e6f4f4] px-3 py-2 rounded-lg transition-all font-semibold text-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteDoctor(d.id)}
                        className="flex-1 text-[12.5px] text-red-400 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-lg transition-all text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activePage === 'blogs' && (
          <BlogsTab token={token} showToast={showToast} />
        )}
      </main>

      {/* ── Add Hospital Modal ── */}
      <Modal open={hospitalModal} onClose={() => setHospitalModal(false)} title="Add New Hospital">
        <form onSubmit={addHospital}>
          <MField label="Hospital Name *">
            <input className={inputCls} placeholder="e.g. Apollo Hospitals" value={hName} onChange={(e) => setHName(e.target.value)} />
          </MField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MField label="City">
              <input className={inputCls} placeholder="Moradabad" value={hCity} onChange={(e) => setHCity(e.target.value)} />
            </MField>
            <MField label="State">
              <input className={inputCls} placeholder="Uttar Pradesh" value={hState} onChange={(e) => setHState(e.target.value)} />
            </MField>
          </div>
          <MField label="Address">
            <input className={inputCls} placeholder="123, Main Road..." value={hAddress} onChange={(e) => setHAddress(e.target.value)} />
          </MField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MField label="Phone">
              <input className={inputCls} placeholder="+91 98765 43210" value={hPhone} onChange={(e) => setHPhone(e.target.value)} />
            </MField>
            <MField label="Email">
              <input type="email" className={inputCls} placeholder="info@hospital.com" value={hEmail} onChange={(e) => setHEmail(e.target.value)} />
            </MField>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[#e6f4f4]">
            <button type="button" onClick={() => setHospitalModal(false)}
              className="px-4 py-2.5 rounded-[10px] bg-[#f4fafa] border border-[#e6f4f4] text-gray-500 hover:text-[#0F5C5C] text-sm transition-all">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="px-5 py-2.5 rounded-[10px] bg-[#0F5C5C] hover:bg-[#177a7a] text-white text-sm font-semibold disabled:opacity-50 transition-all">
              {submitting ? 'Adding...' : 'Add Hospital'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Add Doctor Modal ── */}
      <Modal open={doctorModal} onClose={() => setDoctorModal(false)} title="Add New Doctor">
        <form onSubmit={addDoctor}>
          <MField label="Doctor Name *">
            <input className={inputCls} placeholder="Dr. Arun Sharma" value={dName} onChange={(e) => setDName(e.target.value)} />
          </MField>
          <MField label="Specialization">
            <input className={inputCls} placeholder="Cardiologist" value={dSpec} onChange={(e) => setDSpec(e.target.value)} />
          </MField>
          <MField label="Assign to Hospital">
            <select value={dHospital} onChange={(e) => setDHospital(e.target.value)} className={inputCls + ' [&>option]:bg-white'}>
              <option value="">— Select Hospital —</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </MField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MField label="Phone">
              <input className={inputCls} placeholder="+91 98765 43210" value={dPhone} onChange={(e) => setDPhone(e.target.value)} />
            </MField>
            <MField label="Email">
              <input type="email" className={inputCls} placeholder="doctor@hospital.com" value={dEmail} onChange={(e) => setDEmail(e.target.value)} />
            </MField>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[#e6f4f4]">
            <button type="button" onClick={() => setDoctorModal(false)}
              className="px-4 py-2.5 rounded-[10px] bg-[#f4fafa] border border-[#e6f4f4] text-gray-500 hover:text-[#0F5C5C] text-sm transition-all">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="px-5 py-2.5 rounded-[10px] bg-[#0F5C5C] hover:bg-[#177a7a] text-white text-sm font-semibold disabled:opacity-50 transition-all">
              {submitting ? 'Adding...' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Edit Doctor Modal ── */}
      {editingDoctor && (
        <EditDoctorModal
          doctor={editingDoctor}
          hospitals={hospitals}
          token={token}
          onClose={() => setEditingDoctor(null)}
          onSuccess={(msg) => { setEditingDoctor(null); loadAll(token); showToast(msg); }}
        />
      )}

      {/* ── Toast ── */}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </div>
  );
}