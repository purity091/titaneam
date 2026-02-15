
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AssetRegistry } from './pages/AssetRegistry';
import { FleetBoard } from './pages/FleetBoard';
import { Insights } from './pages/Insights';
import { AuditLog } from './pages/AuditLog';
import { CorruptionControl } from './pages/CorruptionControl';
import { PartsManagement } from './pages/PartsManagement';
import { AssetDetail } from './pages/AssetDetail';
import { FleetRoadmap } from './pages/FleetRoadmap';
import { IntegrityForecast } from './pages/IntegrityForecast';
import { Brainstorm } from './pages/Brainstorm';
import { TitanSimulator } from './pages/TitanSimulator';
import { Asset, MaintenanceRecord } from './types';
import { MOCK_ASSETS, MOCK_RECORDS, MOCK_AUDIT_LOGS } from './constants';
import { translations } from './translations';

const App: React.FC = () => {
  const [assets] = useState<Asset[]>(MOCK_ASSETS);
  const [records] = useState<MaintenanceRecord[]>(MOCK_RECORDS);
  const [lang, setLang] = useState<'en' | 'ar'>('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <BrowserRouter>
      <Layout lang={lang} setLang={setLang}>
        <Routes>
          <Route path="/" element={<Dashboard assets={assets} lang={lang} />} />
          <Route path="/fleet-board" element={<FleetBoard assets={assets} lang={lang} />} />
          <Route path="/assets" element={<AssetRegistry assets={assets} lang={lang} />} />
          <Route path="/assets/:id" element={<AssetDetail assets={assets} records={records} auditLogs={MOCK_AUDIT_LOGS} lang={lang} />} />
          <Route path="/fleet-roadmap" element={<FleetRoadmap assets={assets} records={records} lang={lang} />} />
          <Route path="/insights" element={<Insights assets={assets} records={records} lang={lang} />} />
          <Route path="/integrity-forecast" element={<IntegrityForecast lang={lang} />} />
          <Route path="/brainstorm" element={<Brainstorm assets={assets} records={records} lang={lang} />} />
          <Route path="/titan-simulator" element={<TitanSimulator assets={assets} lang={lang} />} />
          <Route path="/audit-log" element={<AuditLog lang={lang} />} />
          <Route path="/corruption-control" element={<CorruptionControl lang={lang} />} />
          <Route path="/parts" element={<PartsManagement lang={lang} />} />
          <Route path="/maintenance" element={
            <div className="space-y-6">
              <header>
                <h2 className="text-2xl font-bold text-slate-900">{translations[lang].maintenance}</h2>
                <p className="text-slate-500">{lang === 'ar' ? 'سجلات شاملة لكافة إجراءات الخدمة السابقة.' : 'Comprehensive logs of all past service actions.'}</p>
              </header>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left rtl:text-right">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">{translations[lang].date}</th>
                      <th className="px-6 py-4">{lang === 'ar' ? 'معرف الأصل' : 'Asset ID'}</th>
                      <th className="px-6 py-4">{lang === 'ar' ? 'النوع' : 'Type'}</th>
                      <th className="px-6 py-4">{translations[lang].technician}</th>
                      <th className="px-6 py-4">{translations[lang].cost}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">{r.date}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{r.assetId}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.type === 'CORRECTIVE' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{r.type}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{r.technician}</td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">${r.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
