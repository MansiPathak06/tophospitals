'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import HospitalsTab from './HospitalsTab';
import Navbar from '@/components/Navbar';

const API = 'http://localhost:5000/api';

function authHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}
  
// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, visible }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl text-[13.5px] shadow-2xl transition-all duration-300 pointer-events-none
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
        ${type === 'success'
          ? 'bg-[#0F5C5C] text-white border border-[#2ec4a0]/40'
          : 'bg-red-500 text-white border border-red-400/40'}`}
    >
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0
          ${type === 'success' ? 'bg-white/20 text-white' : 'bg-white/20 text-white'}`}
      >
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F5C5C]/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[480px] mx-4 bg-white border border-[#e6f4f4] rounded-2xl p-8 shadow-2xl shadow-[#0F5C5C]/10 max-h-[92vh] overflow-y-auto">
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
    <div className="bg-white border border-[#e6f4f4] rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:border-[#0F5C5C]/20 transition-all duration-200">
      <div className={`w-12 h-12 rounded-[13px] ${accents[accent]} flex items-center justify-center text-xl shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-[#0F5C5C] leading-none">{value}</div>
        <div className="text-[12.5px] text-gray-400 mt-1.5">{label}</div>
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
  

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken]           = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [activePage, setActivePage] = useState('overview');
  const [hospitals, setHospitals]   = useState([]);
  const [doctors, setDoctors]       = useState([]);
  const [loading, setLoading]       = useState(true);

  const [hospitalModal, setHospitalModal] = useState(false);
  const [doctorModal, setDoctorModal]     = useState(false);
  const [submitting, setSubmitting]       = useState(false);

  // Hospital form
  const [hName, setHName]       = useState('');
  const [hCity, setHCity]       = useState('');
  const [hState, setHState]     = useState('');
  const [hAddress, setHAddress] = useState('');
  const [hPhone, setHPhone]     = useState('');
  const [hEmail, setHEmail]     = useState('');

  // Doctor form
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
  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3000);
  };

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
    { key: 'overview',  label: 'Dashboard', icon: '⊞' },
    { key: 'hospitals', label: 'Hospitals',  icon: '🏥' },
    { key: 'doctors',   label: 'Doctors',    icon: '👨‍⚕️' },
  ];

  return (
    <div className="min-h-screen bg-[#f4fafa] flex font-sans text-[#1a3333]">
        
      {/* ── Sidebar ── */}
      <aside className="fixed top-0 left-0 bottom-0 w-[236px] bg-[#0F5C5C] flex flex-col z-50 shadow-xl shadow-[#0F5C5C]/20">

        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-[11px] bg-white/15 flex items-center justify-center text-lg shrink-0">
            ⚕
          </div>
          <span className="text-[18px] font-bold text-white">Zentrix</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2">
          <p className="px-3 mb-2 text-[10.5px] uppercase tracking-widest text-white/40 font-semibold">
            Menu
          </p>
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
            <button
              onClick={logout}
              title="Logout"
              className="text-white/40 hover:text-red-300 text-sm transition-colors p-1"
            >
              ↩
            </button>
          </div>
        </div>
      </aside>
      

      {/* ── Main ── */}
      <main className="ml-[236px] flex-1 p-9 min-h-screen">
       

        {/* ── Overview ── */}
        {activePage === 'overview' && (
          <div>
            <div className="mb-7">
              <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase mb-1">
                Admin Panel
              </p>
              <h2 className="text-[26px] font-bold text-[#0F5C5C] tracking-tight">Welcome back 👋</h2>
              <p className="text-[13px] text-gray-400 mt-1">Here's a snapshot of your hospital network.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-7">
              <StatCard icon="🏥" value={hospitals.length} label="Total Hospitals" accent="teal" />
              <StatCard icon="👨‍⚕️" value={doctors.length} label="Total Doctors" accent="green" />
              <StatCard icon="🔗" value={assignedCount} label="Assigned Doctors" accent="amber" />
            </div>

            {/* Recent Hospitals Table */}
            <div className="bg-white border border-[#e6f4f4] rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#e6f4f4] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F5C5C] uppercase tracking-wide">Recent Hospitals</h3>
                <button
                  onClick={() => setActivePage('hospitals')}
                  className="text-xs text-[#0F5C5C] font-semibold hover:underline"
                >
                  View All →
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f4fafa]">
                    {['Name', 'City', 'Phone', 'Added'].map((h) => (
                      <th key={h} className="px-5 py-2.5 text-left text-[11px] uppercase tracking-wider text-[#0F5C5C]/50 font-bold border-b border-[#e6f4f4]">
                        {h}
                      </th>
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
                        <td className="px-5 py-3.5 text-[13.5px] font-semibold text-[#0F5C5C] border-b border-[#e6f4f4]">{h.name}</td>
                        <td className="px-5 py-3.5 text-[13.5px] text-gray-500 border-b border-[#e6f4f4]">{h.city || '—'}</td>
                        <td className="px-5 py-3.5 text-[13.5px] text-gray-500 border-b border-[#e6f4f4]">{h.phone || '—'}</td>
                        <td className="px-5 py-3.5 text-[12px] text-gray-400 border-b border-[#e6f4f4]">
                          {new Date(h.created_at).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
            <div className="flex items-start justify-between mb-7">
              <div>
                <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase mb-1">Manage</p>
                <h2 className="text-[26px] font-bold text-[#0F5C5C] tracking-tight">Doctors</h2>
                <p className="text-[13px] text-gray-400 mt-1">Manage doctors and their hospital assignments.</p>
              </div>
              <button
                onClick={() => setDoctorModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F5C5C] hover:bg-[#177a7a] text-white text-[13.5px] font-semibold shadow-lg shadow-[#0F5C5C]/20 transition-all"
              >
                + Add Doctor
              </button>
            </div>

            <div className="bg-white border border-[#e6f4f4] rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f4fafa]">
                    {['Name', 'Specialization', 'Hospital', 'Phone', 'Email', 'Action'].map((h) => (
                      <th key={h} className="px-5 py-2.5 text-left text-[11px] uppercase tracking-wider text-[#0F5C5C]/50 font-bold border-b border-[#e6f4f4]">
                        {h}
                      </th>
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
                        <td className="px-5 py-3.5 text-[13.5px] font-semibold text-[#0F5C5C] border-b border-[#e6f4f4]">{d.name}</td>
                        <td className="px-5 py-3.5 border-b border-[#e6f4f4]">
                          {d.specialization
                            ? <Badge color="teal">{d.specialization}</Badge>
                            : <Badge color="gray">General</Badge>}
                        </td>
                        <td className="px-5 py-3.5 border-b border-[#e6f4f4]">
                          {d.hospital_name
                            ? <Badge color="green">{d.hospital_name}</Badge>
                            : <span className="text-[13px] text-gray-400">Unassigned</span>}
                        </td>
                        <td className="px-5 py-3.5 text-[13.5px] text-gray-500 border-b border-[#e6f4f4]">{d.phone || '—'}</td>
                        <td className="px-5 py-3.5 text-[12.5px] text-gray-400 border-b border-[#e6f4f4]">{d.email || '—'}</td>
                        <td className="px-5 py-3.5 border-b border-[#e6f4f4]">
                          <button
                            onClick={() => deleteDoctor(d.id)}
                            className="text-[12px] text-red-400 border border-red-200 hover:border-red-400 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── Hospital Modal ── */}
      <Modal open={hospitalModal} onClose={() => setHospitalModal(false)} title="Add New Hospital">
        <form onSubmit={addHospital}>
          <MField label="Hospital Name *">
            <input className={inputCls} placeholder="e.g. Apollo Hospitals" value={hName} onChange={(e) => setHName(e.target.value)} />
          </MField>
          <div className="grid grid-cols-2 gap-3">
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
          <div className="grid grid-cols-2 gap-3">
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

      {/* ── Doctor Modal ── */}
      <Modal open={doctorModal} onClose={() => setDoctorModal(false)} title="Add New Doctor">
        <form onSubmit={addDoctor}>
          <MField label="Doctor Name *">
            <input className={inputCls} placeholder="Dr. Arun Sharma" value={dName} onChange={(e) => setDName(e.target.value)} />
          </MField>
          <MField label="Specialization">
            <input className={inputCls} placeholder="Cardiologist" value={dSpec} onChange={(e) => setDSpec(e.target.value)} />
          </MField>
          <MField label="Assign to Hospital">
            <select
              value={dHospital}
              onChange={(e) => setDHospital(e.target.value)}
              className={inputCls + ' [&>option]:bg-white'}
            >
              <option value="">— Select Hospital —</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </MField>
          <div className="grid grid-cols-2 gap-3">
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

      {/* ── Toast ── */}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </div>
  );
}