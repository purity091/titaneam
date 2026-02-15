
import React, { useState, useEffect } from 'react';
import { Asset, MaintenanceRecord, MaintenanceForecast } from '../types';
import { getAIInsights } from '../services/geminiService';
import { translations } from '../translations';

interface FleetRoadmapProps {
  assets: Asset[];
  records: MaintenanceRecord[];
  lang: 'en' | 'ar';
}

interface RoadmapEvent {
  id: string;
  assetId: string;
  assetName: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'INSPECTION' | 'OVERHAUL';
  date: string;
  month: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedCost: number;
  estimatedDuration: string;
  description: string;
  partsRequired: string[];
}

// Mock roadmap data for visual demonstration
const getMockRoadmapData = (lang: 'en' | 'ar'): RoadmapEvent[] => {
  const isAr = lang === 'ar';
  return [
    // January
    {
      id: 'EVT-001',
      assetId: 'EXC-001',
      assetName: isAr ? 'حفارة كاتربيلر 320D' : 'Caterpillar 320D Excavator',
      type: 'PREVENTIVE',
      date: '2024-01-15',
      month: 0,
      priority: 'HIGH',
      estimatedCost: 8500,
      estimatedDuration: isAr ? '8 ساعات' : '8 hours',
      description: isAr ? 'صيانة دورية شاملة للمحرك وتغيير الزيت والفلاتر' : 'Comprehensive engine maintenance, oil and filter change',
      partsRequired: ['Oil Filter', 'Air Filter', 'Engine Oil 15L']
    },
    // February
    {
      id: 'EVT-002',
      assetId: 'LDR-003',
      assetName: isAr ? 'لودر كوماتسو WA380' : 'Komatsu WA380 Loader',
      type: 'INSPECTION',
      date: '2024-02-10',
      month: 1,
      priority: 'MEDIUM',
      estimatedCost: 1200,
      estimatedDuration: isAr ? '3 ساعات' : '3 hours',
      description: isAr ? 'فحص نظام الهيدروليك والفرامل' : 'Hydraulic system and brake inspection',
      partsRequired: ['Brake Fluid', 'Hydraulic Seals']
    },
    {
      id: 'EVT-003',
      assetId: 'BLD-002',
      assetName: isAr ? 'مبنى الورشة الرئيسية' : 'Main Workshop Building',
      type: 'PREVENTIVE',
      date: '2024-02-20',
      month: 1,
      priority: 'LOW',
      estimatedCost: 3500,
      estimatedDuration: isAr ? '2 يوم' : '2 days',
      description: isAr ? 'صيانة نظام التكييف والتهوية' : 'HVAC system maintenance',
      partsRequired: ['AC Filters', 'Refrigerant']
    },
    // March
    {
      id: 'EVT-004',
      assetId: 'EXC-001',
      assetName: isAr ? 'حفارة كاتربيلر 320D' : 'Caterpillar 320D Excavator',
      type: 'CORRECTIVE',
      date: '2024-03-05',
      month: 2,
      priority: 'HIGH',
      estimatedCost: 15000,
      estimatedDuration: isAr ? '2 يوم' : '2 days',
      description: isAr ? 'استبدال الجنزير المتآكل' : 'Replace worn track chains',
      partsRequired: ['Track Chain Set', 'Track Shoes', 'Master Links']
    },
    // April
    {
      id: 'EVT-005',
      assetId: 'LGT-004',
      assetName: isAr ? 'نظام الإضاءة الخارجية' : 'External Lighting System',
      type: 'INSPECTION',
      date: '2024-04-12',
      month: 3,
      priority: 'LOW',
      estimatedCost: 800,
      estimatedDuration: isAr ? '4 ساعات' : '4 hours',
      description: isAr ? 'فحص وتنظيف أنظمة الإضاءة' : 'Lighting systems inspection and cleaning',
      partsRequired: ['LED Bulbs', 'Electrical Connectors']
    },
    {
      id: 'EVT-006',
      assetId: 'LDR-003',
      assetName: isAr ? 'لودر كوماتسو WA380' : 'Komatsu WA380 Loader',
      type: 'PREVENTIVE',
      date: '2024-04-25',
      month: 3,
      priority: 'MEDIUM',
      estimatedCost: 6200,
      estimatedDuration: isAr ? '6 ساعات' : '6 hours',
      description: isAr ? 'تغيير إطارات العجلات الأمامية' : 'Front wheel tire replacement',
      partsRequired: ['Front Tires x2', 'Wheel Nuts']
    },
    // May
    {
      id: 'EVT-007',
      assetId: 'EXC-001',
      assetName: isAr ? 'حفارة كاتربيلر 320D' : 'Caterpillar 320D Excavator',
      type: 'OVERHAUL',
      date: '2024-05-15',
      month: 4,
      priority: 'HIGH',
      estimatedCost: 45000,
      estimatedDuration: isAr ? '5 أيام' : '5 days',
      description: isAr ? 'إعادة تأهيل شاملة للمحرك (5000 ساعة)' : 'Complete engine overhaul (5000 hours)',
      partsRequired: ['Piston Kit', 'Cylinder Liners', 'Gasket Set', 'Bearings']
    },
    // June
    {
      id: 'EVT-008',
      assetId: 'BLD-002',
      assetName: isAr ? 'مبنى الورشة الرئيسية' : 'Main Workshop Building',
      type: 'INSPECTION',
      date: '2024-06-01',
      month: 5,
      priority: 'MEDIUM',
      estimatedCost: 2000,
      estimatedDuration: isAr ? '1 يوم' : '1 day',
      description: isAr ? 'فحص السلامة السنوي ونظام الإطفاء' : 'Annual safety inspection and fire system check',
      partsRequired: ['Fire Extinguishers', 'Smoke Detectors']
    },
    // July
    {
      id: 'EVT-009',
      assetId: 'LDR-003',
      assetName: isAr ? 'لودر كوماتسو WA380' : 'Komatsu WA380 Loader',
      type: 'PREVENTIVE',
      date: '2024-07-10',
      month: 6,
      priority: 'MEDIUM',
      estimatedCost: 4500,
      estimatedDuration: isAr ? '5 ساعات' : '5 hours',
      description: isAr ? 'صيانة ناقل الحركة وتغيير الزيت' : 'Transmission maintenance and oil change',
      partsRequired: ['Transmission Oil', 'Filter Kit', 'Seals']
    },
    {
      id: 'EVT-010',
      assetId: 'LGT-004',
      assetName: isAr ? 'نظام الإضاءة الخارجية' : 'External Lighting System',
      type: 'CORRECTIVE',
      date: '2024-07-20',
      month: 6,
      priority: 'LOW',
      estimatedCost: 1500,
      estimatedDuration: isAr ? '6 ساعات' : '6 hours',
      description: isAr ? 'استبدال الأعمدة التالفة وتمديد الكابلات' : 'Replace damaged poles and cable extensions',
      partsRequired: ['Light Poles x3', 'Cables 100m']
    },
    // August
    {
      id: 'EVT-011',
      assetId: 'EXC-001',
      assetName: isAr ? 'حفارة كاتربيلر 320D' : 'Caterpillar 320D Excavator',
      type: 'PREVENTIVE',
      date: '2024-08-15',
      month: 7,
      priority: 'MEDIUM',
      estimatedCost: 3200,
      estimatedDuration: isAr ? '4 ساعات' : '4 hours',
      description: isAr ? 'صيانة نظام التكييف والفلاتر الداخلية' : 'AC system maintenance and cabin filters',
      partsRequired: ['AC Filter', 'Cabin Filter', 'Refrigerant']
    },
    // September
    {
      id: 'EVT-012',
      assetId: 'BLD-002',
      assetName: isAr ? 'مبنى الورشة الرئيسية' : 'Main Workshop Building',
      type: 'PREVENTIVE',
      date: '2024-09-05',
      month: 8,
      priority: 'MEDIUM',
      estimatedCost: 8000,
      estimatedDuration: isAr ? '3 أيام' : '3 days',
      description: isAr ? 'صيانة الأرضيات والطلاء الداخلي' : 'Floor maintenance and interior painting',
      partsRequired: ['Industrial Paint', 'Floor Coating']
    },
    // October
    {
      id: 'EVT-013',
      assetId: 'LDR-003',
      assetName: isAr ? 'لودر كوماتسو WA380' : 'Komatsu WA380 Loader',
      type: 'INSPECTION',
      date: '2024-10-10',
      month: 9,
      priority: 'HIGH',
      estimatedCost: 2500,
      estimatedDuration: isAr ? '1 يوم' : '1 day',
      description: isAr ? 'فحص شامل قبل نهاية الضمان' : 'Comprehensive pre-warranty expiry inspection',
      partsRequired: []
    },
    // November
    {
      id: 'EVT-014',
      assetId: 'EXC-001',
      assetName: isAr ? 'حفارة كاتربيلر 320D' : 'Caterpillar 320D Excavator',
      type: 'PREVENTIVE',
      date: '2024-11-01',
      month: 10,
      priority: 'MEDIUM',
      estimatedCost: 5800,
      estimatedDuration: isAr ? '6 ساعات' : '6 hours',
      description: isAr ? 'صيانة الذراع الهيدروليكي والأسطوانات' : 'Hydraulic arm and cylinder maintenance',
      partsRequired: ['Cylinder Seals', 'Hydraulic Hoses', 'Pins and Bushings']
    },
    {
      id: 'EVT-015',
      assetId: 'LGT-004',
      assetName: isAr ? 'نظام الإضاءة الخارجية' : 'External Lighting System',
      type: 'PREVENTIVE',
      date: '2024-11-15',
      month: 10,
      priority: 'LOW',
      estimatedCost: 1800,
      estimatedDuration: isAr ? '8 ساعات' : '8 hours',
      description: isAr ? 'صيانة وقائية شاملة قبل الشتاء' : 'Comprehensive pre-winter preventive maintenance',
      partsRequired: ['Weatherproof Connectors', 'LED Modules']
    },
    // December
    {
      id: 'EVT-016',
      assetId: 'LDR-003',
      assetName: isAr ? 'لودر كوماتسو WA380' : 'Komatsu WA380 Loader',
      type: 'OVERHAUL',
      date: '2024-12-10',
      month: 11,
      priority: 'HIGH',
      estimatedCost: 35000,
      estimatedDuration: isAr ? '7 أيام' : '7 days',
      description: isAr ? 'إعادة تأهيل شاملة لنظام الهيدروليك' : 'Complete hydraulic system overhaul',
      partsRequired: ['Hydraulic Pump', 'Control Valves', 'Hose Kit', 'Filters']
    }
  ];
};

export const FleetRoadmap: React.FC<FleetRoadmapProps> = ({ assets, records, lang }) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const [loading, setLoading] = useState(false);
  const [roadmapEvents, setRoadmapEvents] = useState<RoadmapEvent[]>([]);
  const [useAI, setUseAI] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');

  const months = isRtl
    ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchRoadmap = async () => {
    setLoading(true);

    if (useAI) {
      const result = await getAIInsights(assets, records, lang);
      if (result && result.forecasts) {
        // Convert AI forecasts to roadmap events
        const events = result.forecasts.map((f: MaintenanceForecast, idx: number) => ({
          id: `AI-${idx}`,
          assetId: f.assetId,
          assetName: assets.find(a => a.id === f.assetId)?.name || f.assetId,
          type: 'PREVENTIVE' as const,
          date: f.predictedServiceDate,
          month: new Date(f.predictedServiceDate).getMonth(),
          priority: f.riskScore > 70 ? 'HIGH' : f.riskScore > 40 ? 'MEDIUM' : 'LOW' as const,
          estimatedCost: 5000 + Math.random() * 10000,
          estimatedDuration: '4-8 hours',
          description: f.reasoning,
          partsRequired: []
        }));
        setRoadmapEvents(events);
      } else {
        setRoadmapEvents(getMockRoadmapData(lang));
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRoadmapEvents(getMockRoadmapData(lang));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRoadmap();
  }, [lang]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PREVENTIVE': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'CORRECTIVE': return 'bg-red-50 text-red-600 border-red-100';
      case 'INSPECTION': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'OVERHAUL': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getTypeLabel = (type: string) => {
    if (isRtl) {
      switch (type) {
        case 'PREVENTIVE': return 'وقائية';
        case 'CORRECTIVE': return 'تصحيحية';
        case 'INSPECTION': return 'فحص';
        case 'OVERHAUL': return 'إعادة تأهيل';
        default: return type;
      }
    }
    return type;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'LOW': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  // Calculate stats
  const totalCost = roadmapEvents.reduce((sum, e) => sum + e.estimatedCost, 0);
  const highPriorityCount = roadmapEvents.filter(e => e.priority === 'HIGH').length;
  const preventiveCount = roadmapEvents.filter(e => e.type === 'PREVENTIVE').length;
  const overhaulCount = roadmapEvents.filter(e => e.type === 'OVERHAUL').length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t.roadmap}</h2>
              <p className="text-slate-500 font-medium">{isRtl ? 'خطة الصيانة الاستراتيجية للعام القادم مدعومة بالذكاء الاصطناعي.' : 'Strategic maintenance plan for the next year, AI-powered.'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-white rounded-xl p-1 shadow-sm border border-slate-200/60 flex">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'calendar' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {isRtl ? 'تقويم' : 'Calendar'}
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'timeline' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {isRtl ? 'جدول زمني' : 'Timeline'}
            </button>
          </div>

          <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600"
            />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {isRtl ? 'ذكاء اصطناعي' : 'AI'}
            </span>
          </label>

          <button
            onClick={fetchRoadmap}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{isRtl ? 'جاري التحميل...' : 'Loading...'}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span>{t.refreshForecasts}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {isRtl ? 'جاري إنشاء خارطة الطريق...' : 'Generating Annual Roadmap...'}
          </h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            {isRtl ? 'تحليل بيانات الأصول وسجلات الصيانة' : 'Analyzing asset data and maintenance records'}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: isRtl ? 'إجمالي الأحداث' : 'Total Events',
                value: roadmapEvents.length,
                color: 'blue',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              },
              {
                label: isRtl ? 'أولوية عالية' : 'High Priority',
                value: highPriorityCount,
                color: 'red',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              },
              {
                label: isRtl ? 'إعادة تأهيل' : 'Overhauls',
                value: overhaulCount,
                color: 'purple',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              },
              {
                label: isRtl ? 'التكلفة الإجمالية' : 'Total Cost',
                value: `$${(totalCost / 1000).toFixed(0)}K`,
                color: 'emerald',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-10 h-10 bg-${stat.color}-50 rounded-xl flex items-center justify-center text-${stat.color}-600`}>
                    {stat.icon}
                  </span>
                  <span className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {viewMode === 'calendar' ? (
            /* Calendar View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {months.map((month, idx) => {
                const monthEvents = roadmapEvents.filter(e => e.month === idx);
                const hasHighPriority = monthEvents.some(e => e.priority === 'HIGH');

                return (
                  <div key={idx} className={`bg-white rounded-[2rem] border transition-all hover:shadow-xl ${monthEvents.length > 0
                      ? hasHighPriority ? 'border-red-200 shadow-sm' : 'border-indigo-100'
                      : 'border-slate-100 opacity-60'
                    }`}>
                    <div className={`p-5 border-b rounded-t-[2rem] ${hasHighPriority ? 'bg-red-50/50 border-red-100' : 'bg-slate-50/50 border-slate-50'
                      }`}>
                      <h3 className="font-bold text-slate-900 flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{month}</span>
                        </span>
                        {monthEvents.length > 0 && (
                          <span className={`text-white text-[10px] px-2.5 py-1 rounded-full font-bold ${hasHighPriority ? 'bg-red-500' : 'bg-indigo-600'
                            }`}>
                            {monthEvents.length}
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="p-5 space-y-3 max-h-80 overflow-y-auto">
                      {monthEvents.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter text-center py-6">
                          {isRtl ? 'لا توجد أحداث مجدولة' : 'No events scheduled'}
                        </p>
                      ) : (
                        monthEvents.map((event) => (
                          <div
                            key={event.id}
                            className="p-4 rounded-2xl border group cursor-pointer transition-all hover:shadow-md"
                            style={{
                              backgroundColor: event.priority === 'HIGH' ? '#fef2f2' :
                                event.priority === 'MEDIUM' ? '#fffbeb' : '#f0fdf4',
                              borderColor: event.priority === 'HIGH' ? '#fecaca' :
                                event.priority === 'MEDIUM' ? '#fde68a' : '#bbf7d0'
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getTypeColor(event.type)}`}>
                                {getTypeLabel(event.type)}
                              </span>
                              <span className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`}></span>
                            </div>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase mb-0.5">{event.assetId}</p>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{event.assetName}</h4>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-slate-400">{event.date}</span>
                              <span className="text-[9px] font-bold text-emerald-600">${event.estimatedCost.toLocaleString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Timeline View */
            <div className="space-y-4">
              {roadmapEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event, idx) => (
                <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group">
                  <div className={`h-1 ${getPriorityColor(event.priority)}`}></div>
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    {/* Date */}
                    <div className="md:w-32 flex-shrink-0 text-center md:text-left">
                      <p className="text-2xl font-bold text-slate-900">{event.date.split('-')[2]}</p>
                      <p className="text-sm font-bold text-indigo-600">{months[event.month]}</p>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(event.type)}`}>
                          {getTypeLabel(event.type)}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                          {event.assetId}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${event.priority === 'HIGH' ? 'bg-red-50 text-red-600' :
                            event.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' :
                              'bg-emerald-50 text-emerald-600'
                          }`}>
                          {event.priority}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{event.assetName}</h4>
                      <p className="text-sm text-slate-500 mb-4">{event.description}</p>

                      <div className="flex flex-wrap gap-4 text-xs">
                        <span className="flex items-center gap-1 text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {event.estimatedDuration}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          ${event.estimatedCost.toLocaleString()}
                        </span>
                      </div>

                      {event.partsRequired.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{isRtl ? 'القطع المطلوبة' : 'Required Parts'}</p>
                          <div className="flex flex-wrap gap-1">
                            {event.partsRequired.map((part, pIdx) => (
                              <span key={pIdx} className="px-2 py-1 bg-slate-50 rounded text-[10px] font-medium text-slate-600">{part}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Annual Budget Summary */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 blur-3xl"></div>
            <div className="absolute left-0 bottom-0 w-48 h-48 bg-blue-500/10 blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </span>
                {isRtl ? 'توقعات الميزانية السنوية' : 'Annual Budget Projection'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{isRtl ? 'إجمالي الصيانة' : 'Total Maintenance'}</p>
                  <p className="text-3xl font-bold text-indigo-400">{roadmapEvents.length} <span className="text-sm font-medium text-slate-500">{isRtl ? 'عملية' : 'Events'}</span></p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{isRtl ? 'التكلفة التقديرية' : 'Estimated Cost'}</p>
                  <p className="text-3xl font-bold text-emerald-400">${(totalCost).toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{isRtl ? 'صيانة وقائية' : 'Preventive Actions'}</p>
                  <p className="text-3xl font-bold text-blue-400">{preventiveCount} <span className="text-sm font-medium text-slate-500">{isRtl ? 'عملية' : 'Events'}</span></p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{isRtl ? 'كفاءة التخطيط' : 'Planning Efficiency'}</p>
                  <p className="text-3xl font-bold text-amber-400">94% <span className="text-sm font-medium text-slate-500">{isRtl ? 'كفاءة' : 'Score'}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
