
import React from 'react';
import { SparePart, PartCondition } from '../types';
import { translations } from '../translations';
import { MOCK_PARTS } from '../constants';

interface PartsManagementProps {
  lang: 'en' | 'ar';
}

export const PartsManagement: React.FC<PartsManagementProps> = ({ lang }) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t.parts}</h2>
          <p className="text-slate-500 mt-1 font-medium">{isRtl ? 'تتبع دقيق لكافة قطع الغيار والأرقام التسلسلية.' : 'Precise tracking of all spare parts and serial numbers.'}</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
          {t.scanPart}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_PARTS.map((part) => (
          <div key={part.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl">
                  ⚙️
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${part.condition === PartCondition.NEW ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                  {part.condition}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 mb-1">{part.name}</h4>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{part.serialNumber}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Inventory: OK</span>
              <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:underline">{isRtl ? 'عرض السجل' : 'View History'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
