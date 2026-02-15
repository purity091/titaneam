
import React, { useState } from 'react';
import { Asset, AssetStatus, AssetType } from '../types';
import { translations } from '../translations';
import { Link } from 'react-router-dom';

interface FleetBoardProps {
  assets: Asset[];
  lang: 'en' | 'ar';
}

export const FleetBoard: React.FC<FleetBoardProps> = ({ assets, lang }) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<AssetType | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || asset.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate stats
  const stats = {
    total: assets.length,
    operational: assets.filter(a => a.status === AssetStatus.OPERATIONAL).length,
    maintenance: assets.filter(a => a.status === AssetStatus.MAINTENANCE).length,
    down: assets.filter(a => a.status === AssetStatus.DOWN).length,
    standby: assets.filter(a => a.status === AssetStatus.STANDBY).length,
  };

  const getStatusConfig = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.OPERATIONAL:
        return {
          color: 'bg-emerald-500',
          gradient: 'from-emerald-400 to-emerald-600',
          text: isRtl ? 'يعمل' : 'Operational',
          lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          ringColor: 'ring-emerald-100',
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case AssetStatus.MAINTENANCE:
        return {
          color: 'bg-amber-500',
          gradient: 'from-amber-400 to-amber-600',
          text: isRtl ? 'صيانة' : 'Maintenance',
          lightColor: 'bg-amber-50 text-amber-700 border-amber-200',
          ringColor: 'ring-amber-100',
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )
        };
      case AssetStatus.DOWN:
        return {
          color: 'bg-rose-500',
          gradient: 'from-rose-400 to-rose-600',
          text: isRtl ? 'متوقف' : 'Down',
          lightColor: 'bg-rose-50 text-rose-700 border-rose-200',
          ringColor: 'ring-rose-100',
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      case AssetStatus.STANDBY:
        return {
          color: 'bg-slate-400',
          gradient: 'from-slate-400 to-slate-500',
          text: isRtl ? 'انتظار' : 'Standby',
          lightColor: 'bg-slate-50 text-slate-600 border-slate-200',
          ringColor: 'ring-slate-100',
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const getTypeConfig = (type: AssetType) => {
    switch (type) {
      case AssetType.HEAVY_MACHINERY:
        return { icon: '🚜', label: isRtl ? 'معدات ثقيلة' : 'Heavy Machinery', gradient: 'from-amber-400 to-orange-500', bg: 'bg-orange-50', text: 'text-orange-600' };
      case AssetType.BUILDING:
        return { icon: '🏢', label: isRtl ? 'مبنى' : 'Building', gradient: 'from-blue-400 to-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600' };
      case AssetType.LIGHTING:
        return { icon: '💡', label: isRtl ? 'إضاءة' : 'Lighting', gradient: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-50', text: 'text-yellow-600' };
      case AssetType.FIXED_EQUIPMENT:
        return { icon: '⚙️', label: isRtl ? 'معدات ثابتة' : 'Fixed Equipment', gradient: 'from-slate-400 to-slate-600', bg: 'bg-slate-50', text: 'text-slate-600' };
      default:
        return { icon: '📦', label: isRtl ? 'أخرى' : 'Other', gradient: 'from-gray-400 to-gray-500', bg: 'bg-gray-50', text: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t.fleetBoard}</h2>
              <p className="text-slate-500 font-medium mt-1">
                {isRtl ? 'مراقبة حية وتفاعلية لحالة أصول المؤسسة' : 'Real-time interactive monitoring of enterprise assets'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200/60 flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'grid'
                  ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'list'
                  ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: isRtl ? 'الإجمالي' : 'Total Assets', value: stats.total, color: 'blue', gradient: 'from-blue-500 to-indigo-600', active: statusFilter === 'ALL' },
          { label: isRtl ? 'يعمل' : 'Operational', value: stats.operational, color: 'emerald', gradient: 'from-emerald-500 to-teal-500', active: statusFilter === AssetStatus.OPERATIONAL },
          { label: isRtl ? 'صيانة' : 'Maintenance', value: stats.maintenance, color: 'amber', gradient: 'from-amber-400 to-orange-500', active: statusFilter === AssetStatus.MAINTENANCE },
          { label: isRtl ? 'متوقف' : 'Down', value: stats.down, color: 'rose', gradient: 'from-rose-500 to-red-600', active: statusFilter === AssetStatus.DOWN },
          { label: isRtl ? 'انتظار' : 'Standby', value: stats.standby, color: 'slate', gradient: 'from-slate-500 to-slate-600', active: statusFilter === AssetStatus.STANDBY },
        ].map((stat, idx) => (
          <button
            key={idx}
            onClick={() => setStatusFilter(idx === 0 ? 'ALL' : Object.values(AssetStatus)[idx - 1])}
            className={`relative group p-5 rounded-2xl border transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-xl ${stat.active
              ? `bg-gradient-to-br ${stat.gradient} border-transparent shadow-lg ${isRtl ? 'shadow-[-5px_10px_30px_-10px_rgba(0,0,0,0.1)]' : 'shadow-[5px_10px_30px_-10px_rgba(0,0,0,0.1)]'}`
              : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-4xl font-extrabold tracking-tight ${stat.active ? 'text-white' : 'text-slate-900'}`}>
                {stat.value}
              </span>
              <div className={`p-2 rounded-lg ${stat.active ? 'bg-white/20 text-white' : `bg-${stat.color}-50 text-${stat.color}-500`}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className={`text-xs font-bold uppercase tracking-wider ${stat.active ? 'text-white/90' : 'text-slate-500'}`}>
              {stat.label}
            </p>
          </button>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl p-3 md:p-2 rounded-2xl shadow-sm border border-slate-200/50 flex flex-col md:flex-row gap-3 md:gap-2 md:items-center transition-all">
        <div className="relative w-full md:flex-1 md:min-w-[240px]">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-sm text-slate-800 placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className={`w-5 h-5 absolute ${isRtl ? 'right-4' : 'left-4'} top-3.5 text-slate-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-3 p-0.5 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        <div className="w-full h-px md:w-px md:h-8 bg-slate-200 hidden md:block"></div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:min-w-[160px]">
            <select
              className="w-full pl-4 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all hover:bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
            >
              <option value="ALL">{t.allTypes}</option>
              {Object.values(AssetType).map(type => (
                <option key={type} value={type}>{getTypeConfig(type).label}</option>
              ))}
            </select>
            <svg className={`w-4 h-4 absolute ${isRtl ? 'left-3' : 'right-3'} top-3.5 text-slate-400 pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {(statusFilter !== 'ALL' || typeFilter !== 'ALL' || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setTypeFilter('ALL');
                setSearchTerm('');
              }}
              className="px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-100 hover:border-red-200 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              <span className="hidden sm:inline">{isRtl ? 'مسح' : 'Clear'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => {
            const status = getStatusConfig(asset.status);
            const typeConfig = getTypeConfig(asset.type);
            const usagePercent = Math.min((asset.usageHours / asset.maxHoursBeforeService) * 100, 100);
            const isUrgent = usagePercent > 90;
            const isWarning = usagePercent > 70;

            return (
              <div key={asset.id} className="group relative bg-white rounded-3xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col">
                {/* Top decorative line */}
                <div className={`h-1 w-full bg-gradient-to-r ${status.gradient} opacity-80`}></div>

                <div className="p-6 flex-1 flex flex-col">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${typeConfig.gradient} rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}>
                      {typeConfig.icon}
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${status.lightColor} ring-1 ring-inset ${status.ringColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.color} animate-pulse`}></span>
                      {status.text}
                    </div>
                  </div>

                  {/* Asset Info */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold tracking-wider uppercase font-mono">
                        {asset.id}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                      {asset.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {asset.location}
                    </p>
                  </div>

                  {/* Operational Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t.model}</p>
                      <p className="font-semibold text-slate-700 text-sm truncate" title={asset.model}>{asset.model}</p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t.lastService}</p>
                      <p className="font-mono font-semibold text-slate-700 text-xs">{asset.lastMaintenanceDate}</p>
                    </div>
                  </div>

                  {/* Usage Progress */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.usageProgress}</span>
                      <span className={`text-xs font-bold font-mono ${isUrgent ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-700'}`}>
                        {usagePercent.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isUrgent ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'}`}
                        style={{ width: `${usagePercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card Actions - Reveal on hover or always visible? Always visible better for UX */}
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                  <Link
                    to={`/assets/${asset.id}`}
                    className="flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {t.details}
                  </Link>
                  <button className="flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-blue-600 transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2">
                    {t.logicAction}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredAssets.map((asset) => {
            const status = getStatusConfig(asset.status);
            const typeConfig = getTypeConfig(asset.type);
            const usagePercent = Math.min((asset.usageHours / asset.maxHoursBeforeService) * 100, 100);
            const isUrgent = usagePercent > 90;
            const isWarning = usagePercent > 70;

            return (
              <div key={asset.id} className="group bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Icon */}
                  <div className={`w-14 h-14 shrink-0 bg-gradient-to-br ${typeConfig.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-md text-white`}>
                    {typeConfig.icon}
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0 text-center md:text-left rtl:md:text-right">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors truncate">{asset.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.lightColor} whitespace-nowrap`}>
                        {status.text}
                      </span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {asset.location}
                      </span>
                      <span className="font-mono text-slate-400 text-xs">#{asset.id}</span>
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="w-full md:w-48 shrink-0">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{t.usageProgress}</span>
                      <span className={`text-xs font-bold font-mono ${isUrgent ? 'text-rose-600' : 'text-slate-700'}`}>{usagePercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isUrgent ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'}`}
                        style={{ width: `${usagePercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full md:w-auto shrink-0">
                    <Link
                      to={`/assets/${asset.id}`}
                      className="flex-1 md:flex-initial px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors text-center"
                    >
                      {t.details}
                    </Link>
                    <button className="flex-1 md:flex-initial px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-600 shadow-lg shadow-slate-900/10 transition-all text-center">
                      {t.logicAction}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-16 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {isRtl ? 'لم يتم العثور على أصول' : 'No Assets Found'}
          </h3>
          <p className="text-slate-400 font-medium max-w-md mx-auto mb-8">
            {isRtl ? 'جرب تغيير معايير البحث أو الفلترة للعثور على ما تبحث عنه.' : 'Try adjusting your search or filter criteria to find what you\'re looking for.'}
          </p>
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setTypeFilter('ALL');
              setSearchTerm('');
            }}
            className="px-8 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-1"
          >
            {isRtl ? 'مسح الفلاتر' : 'Clear Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
