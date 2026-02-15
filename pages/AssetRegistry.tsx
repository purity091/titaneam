
import React, { useState } from 'react';
import { Asset, AssetStatus, AssetType } from '../types';
import { translations } from '../translations';
import { Link } from 'react-router-dom';

interface AssetRegistryProps {
  assets: Asset[];
  lang: 'en' | 'ar';
}

export const AssetRegistry: React.FC<AssetRegistryProps> = ({ assets, lang }) => {
  const t = translations[lang];
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<AssetType | 'ALL'>('ALL');

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(filter.toLowerCase()) || a.id.toLowerCase().includes(filter.toLowerCase());
    const matchesType = typeFilter === 'ALL' || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.OPERATIONAL:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">Operational</span>;
      case AssetStatus.MAINTENANCE:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">Maintenance</span>;
      case AssetStatus.DOWN:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100">Down</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t.registry}</h2>
        <p className="text-slate-500 mt-1 font-medium">{lang === 'ar' ? 'جرد كامل لكافة الأصول والمعدات الصناعية.' : 'Full inventory of all industrial assets and equipment.'}</p>
      </header>

      <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 md:pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <svg className={`w-5 h-5 absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-3.5 text-slate-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <select
          className="w-full md:w-56 px-5 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as AssetType | 'ALL')}
        >
          <option value="ALL">{t.allTypes}</option>
          {Object.values(AssetType).map(t => (
            <option key={t} value={t}>{t.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 whitespace-nowrap">
                <th className="px-4 py-4 md:px-6 md:py-5">Asset ID</th>
                <th className="px-4 py-4 md:px-6 md:py-5">Name / Model</th>
                <th className="px-4 py-4 md:px-6 md:py-5">Type</th>
                <th className="px-4 py-4 md:px-6 md:py-5">Status</th>
                <th className="px-4 py-4 md:px-6 md:py-5">Usage</th>
                <th className="px-4 py-4 md:px-6 md:py-5 text-right rtl:text-left">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-4 py-3 md:px-6 md:py-5">
                    <span className="font-mono text-[10px] md:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-blue-100/50 whitespace-nowrap">{asset.id}</span>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-5 min-w-[140px]">
                    <div>
                      <Link to={`/assets/${asset.id}`} className="font-bold text-sm md:text-base text-slate-900 group-hover:text-blue-600 transition-colors">{asset.name}</Link>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{asset.model}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-5 text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-tight whitespace-nowrap">{asset.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3 md:px-6 md:py-5 whitespace-nowrap">{getStatusBadge(asset.status)}</td>
                  <td className="px-4 py-3 md:px-6 md:py-5 min-w-[120px]">
                    <div className="w-24 md:w-32">
                      <div className="flex justify-between text-[9px] md:text-[10px] font-bold mb-1.5">
                        <span className="text-slate-400 uppercase tracking-tighter">{asset.usageHours}h</span>
                        <span className="text-slate-300">/ {asset.maxHoursBeforeService}h</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${asset.usageHours / asset.maxHoursBeforeService > 0.9 ? 'bg-red-500' : 'bg-blue-600'}`}
                          style={{ width: `${Math.min((asset.usageHours / asset.maxHoursBeforeService) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-5 text-right rtl:text-left whitespace-nowrap">
                    <Link to={`/assets/${asset.id}`} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all inline-block">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAssets.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
              🔍
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No matching assets found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
