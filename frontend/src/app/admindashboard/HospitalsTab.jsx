'use client';


import { useState } from 'react';
import AddHospitalPage from './AddHospitalPage'; // adjust path as needed

const API = 'http://localhost:5000/api';

function authHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export default function HospitalsTab({ token, hospitals, loading, onRefresh, showToast }) {
  const [showAdd, setShowAdd] = useState(false);

  const deleteHospital = async (id) => {
    if (!confirm('Delete this hospital? Assigned doctors will become unassigned.')) return;
    await fetch(`${API}/hospitals/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    onRefresh();
    showToast('Hospital deleted');
  };

  // ── Full-screen add form ──────────────────────────────────────────────────
  if (showAdd) {
    return (
      <AddHospitalPage
        onBack={() => setShowAdd(false)}
        onSuccess={(msg) => {
          setShowAdd(false);
          onRefresh();
          showToast(msg);
        }}
      />
    );
  }

  // ── Hospitals table ───────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2 className="text-[26px] font-semibold text-slate-100 tracking-tight">Hospitals</h2>
          <p className="text-[13px] text-slate-500 mt-1">Manage all registered hospitals in the network.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-[13.5px] font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all"
        >
          + Add Hospital
        </button>
      </div>

      <div className="bg-[#0d1425] border border-white/[0.07] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.015]">
              {['Name', 'City', 'State', 'Phone', 'Email', 'Verified', 'Emergency', 'Action'].map((h) => (
                <th key={h} className="px-5 py-2.5 text-left text-[11px] uppercase tracking-wider text-slate-600 font-semibold border-b border-white/[0.05]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-600 text-sm">Loading...</td>
              </tr>
            ) : hospitals.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="py-12 text-center">
                    <div className="text-3xl opacity-30 mb-2">🏥</div>
                    <p className="text-[13.5px] text-slate-600">No hospitals yet. Add one to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              hospitals.map((h) => (
                <tr key={h.id} className="hover:bg-white/[0.015] transition-colors">
                  <td className="px-5 py-3.5 text-[13.5px] font-medium text-slate-200 border-b border-white/[0.04]">{h.name}</td>
                  <td className="px-5 py-3.5 text-[13.5px] text-slate-400 border-b border-white/[0.04]">{h.city || '—'}</td>
                  <td className="px-5 py-3.5 text-[13.5px] text-slate-400 border-b border-white/[0.04]">{h.state || '—'}</td>
                  <td className="px-5 py-3.5 text-[13.5px] text-slate-400 border-b border-white/[0.04]">{h.phone || '—'}</td>
                  <td className="px-5 py-3.5 text-[12.5px] text-slate-500 border-b border-white/[0.04]">{h.email || '—'}</td>
                  <td className="px-5 py-3.5 border-b border-white/[0.04]">
                    {h.verified
                      ? <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400">✓ Yes</span>
                      : <span className="text-slate-600 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3.5 border-b border-white/[0.04]">
                    {h.emergency
                      ? <span className="px-2.5 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400">24/7</span>
                      : <span className="text-slate-600 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3.5 border-b border-white/[0.04]">
                    <button
                      onClick={() => deleteHospital(h.id)}
                      className="text-[12px] text-red-300/60 border border-red-500/20 hover:border-red-500/40 hover:text-red-300 hover:bg-red-500/8 px-3 py-1.5 rounded-lg transition-all"
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
  );
}