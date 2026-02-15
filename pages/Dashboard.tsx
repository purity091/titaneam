
import React from 'react';
import { Asset, AssetStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { translations } from '../translations';

interface DashboardProps {
  assets: Asset[];
  lang: 'en' | 'ar';
}

export const Dashboard: React.FC<DashboardProps> = ({ assets, lang }) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  
  const stats = {
    total: assets.length,
    operational: assets.filter(a => a.status === AssetStatus.OPERATIONAL).length,
    maintenance: assets.filter(a => a.status === AssetStatus.MAINTENANCE).length,
    down: assets.filter(a => a.status === AssetStatus.DOWN).length,
  };

  const statusData = [
    { name: t.operational, value: stats.operational, color: '#3b82f6' },
    { name: t.underMaintenance, value: stats.maintenance, color: '#f59e0b' },
    { name: t.assetDowntime, value: stats.down, color: '#ef4444' },
    { name: lang === 'ar' ? 'وضع الاستعداد' : 'Standby', value: assets.filter(a => a.status === AssetStatus.STANDBY).length, color: '#94a3b8' }
  ];

  const usageData = assets
    .filter(a => a.usageHours > 0)
    .map(a => ({ name: a.id, hours: a.usageHours, limit: a.maxHoursBeforeService }));

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t.operationalOverview}</h2>
          <p className="text-slate-500 mt-1 font-medium">{lang === 'ar' ? 'تحليل مباشر لأسطول الأصول والمعدات الصناعية.' : 'Real-time analysis of the industrial fleet and equipment.'}</p>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex -space-x-2 rtl:space-x-reverse">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'فريق العمل النشط' : 'Active Team'}</span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: t.totalAssets, val: stats.total, sub: '+2 last week', color: 'blue' },
            { label: t.operational, val: stats.operational, sub: '92% Efficiency', color: 'emerald' },
            { label: t.underMaintenance, val: stats.maintenance, sub: '3 Scheduled', color: 'amber' },
            { label: t.assetDowntime, val: stats.down, sub: 'Immediate attention', color: 'red' }
        ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                    <div className={`w-8 h-8 rounded-lg bg-${kpi.color}-50 flex items-center justify-center text-${kpi.color}-600`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    </div>
                </div>
                <p className="text-4xl font-bold mt-3 text-slate-900">{kpi.val}</p>
                <p className={`text-[10px] font-bold mt-2 text-${kpi.color}-600 uppercase tracking-tight`}>{kpi.sub}</p>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">{t.usageVsLimit}</h3>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'ar' ? 'ساعات العمل' : 'Hours Used'}</span>
              </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} fontWeight={700} stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={10} fontWeight={700} stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="hours" fill="url(#colorUsage)" radius={[6, 6, 0, 0]} barSize={32}>
                    <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={1}/>
                        </linearGradient>
                    </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-8">{t.statusBreakdown}</h3>
          <div className="flex-1 flex flex-col justify-center items-center">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                      {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 w-full">
                {statusData.map((item) => (
                  <div key={item.name} className="flex flex-col">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.name}</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
