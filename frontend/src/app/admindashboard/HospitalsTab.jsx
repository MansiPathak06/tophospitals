'use client';

import { useState } from 'react';
import AddHospitalPage from './AddHospitalPage';

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
              {['Name', 'City', 'State', 'Phone', 'Email', 'Verified', 'Emergency', 'Action'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-2.5 text-left text-[11px] uppercase tracking-wider text-teal-700 font-semibold border-b border-teal-500/[0.1]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-teal-700 text-sm">Loading...</td>
              </tr>
            ) : hospitals.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="py-12 text-center">
                    <div className="text-3xl opacity-30 mb-2">🏥</div>
                    <p className="text-[13.5px] text-teal-700">No hospitals yet. Add one to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              hospitals.map((h) => (
                <tr key={h.id} className="hover:bg-teal-500/[0.04] transition-colors">
                  <td className="px-5 py-3.5 text-[13.5px] font-medium text-teal-50 border-b border-teal-500/[0.08]">{h.name}</td>
                  <td className="px-5 py-3.5 text-[13.5px] text-teal-300/70 border-b border-teal-500/[0.08]">{h.city || '—'}</td>
                  <td className="px-5 py-3.5 text-[13.5px] text-teal-300/70 border-b border-teal-500/[0.08]">{h.state || '—'}</td>
                  <td className="px-5 py-3.5 text-[13.5px] text-teal-300/70 border-b border-teal-500/[0.08]">{h.phone || '—'}</td>
                  <td className="px-5 py-3.5 text-[12.5px] text-teal-400/50 border-b border-teal-500/[0.08]">{h.email || '—'}</td>
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
                    <button
                      onClick={() => deleteHospital(h.id)}
                      className="text-[12px] text-red-300/60 border border-red-500/20 hover:border-red-500/40 hover:text-red-300 hover:bg-red-500/[0.08] px-3 py-1.5 rounded-lg transition-all"
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