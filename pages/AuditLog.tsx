
import React from 'react';
import { AuditEntry } from '../types';
import { translations } from '../translations';
import { MOCK_AUDIT_LOGS } from '../constants';

interface AuditLogProps {
  lang: 'en' | 'ar';
}

export const AuditLog: React.FC<AuditLogProps> = ({ lang }) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t.auditLog}</h2>
        <p className="text-slate-500 mt-1 font-medium">{isRtl ? 'سجل زمني غير قابل للتعديل لكافة العمليات والأحداث.' : 'Immutable timeline of all operations and events.'}</p>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 whitespace-nowrap">
                <th className="px-4 py-3 md:px-8 md:py-5">{t.timestamp}</th>
                <th className="px-4 py-3 md:px-8 md:py-5">Asset ID</th>
                <th className="px-4 py-3 md:px-8 md:py-5">{t.user}</th>
                <th className="px-4 py-3 md:px-8 md:py-5">{t.action}</th>
                <th className="px-4 py-3 md:px-8 md:py-5">{t.details}</th>
                <th className="px-4 py-3 md:px-8 md:py-5">{t.location}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_AUDIT_LOGS.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 md:px-8 md:py-5 font-mono text-[10px] md:text-xs text-slate-500 whitespace-nowrap">{entry.timestamp}</td>
                  <td className="px-4 py-3 md:px-8 md:py-5">
                    <span className="font-mono text-[10px] md:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded whitespace-nowrap">{entry.assetId}</span>
                  </td>
                  <td className="px-4 py-3 md:px-8 md:py-5 text-xs md:text-sm font-bold text-slate-900 whitespace-nowrap">{entry.userId}</td>
                  <td className="px-4 py-3 md:px-8 md:py-5">
                    <span className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 whitespace-nowrap">
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 md:px-8 md:py-5 text-xs md:text-sm text-slate-600 max-w-xs truncate">{entry.details}</td>
                  <td className="px-4 py-3 md:px-8 md:py-5 text-[10px] md:text-xs text-slate-400 whitespace-nowrap">{entry.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
