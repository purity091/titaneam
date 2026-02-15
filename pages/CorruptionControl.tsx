
import React, { useState, useEffect } from 'react';
import { AuditEntry, Asset } from '../types';
import { detectCorruptionPatterns } from '../services/geminiService';
import { translations } from '../translations';
import { MOCK_AUDIT_LOGS, MOCK_ASSETS } from '../constants';

interface CorruptionControlProps {
  lang: 'en' | 'ar';
}

// Mock data for visual demonstration
const getMockCorruptionData = (lang: 'en' | 'ar') => {
  const isAr = lang === 'ar';
  return {
    summary: isAr
      ? 'تم اكتشاف 6 أنماط مشبوهة في سجلات الصيانة خلال الـ 30 يوماً الماضية. 2 منها تصنف كعالية الخطورة وتتطلب تحقيقاً فورياً. يُلاحظ تركز الأنشطة المشبوهة حول المعدات الثقيلة ذات القيمة العالية، مع وجود أنماط متكررة من نفس الفنيين. يُوصى بتفعيل نظام الفصل بين المهام وتطبيق سياسة التناوب الوظيفي.'
      : 'Detected 6 suspicious patterns in maintenance logs over the past 30 days. 2 are classified as high-risk requiring immediate investigation. Suspicious activities are concentrated around high-value heavy equipment, with recurring patterns from the same technicians. Recommended to activate separation of duties and implement job rotation policy.',
    alerts: [
      {
        id: 'ALT-001',
        type: isAr ? 'تبديل قطع غيار غير مصرح' : 'Unauthorized Parts Swap',
        severity: 'HIGH',
        status: 'PENDING',
        auditEntryId: 'AUD-2024-0847',
        description: isAr
          ? 'تم اكتشاف تبديل محرك أصلي (S/N: MTR-7892) من الحفارة EXC-001 بمحرك مستعمل (S/N: MTR-3201). الفني المسؤول: أحمد العمري. التاريخ: 15 يناير 2024. الفرق في القيمة المقدرة: 45,000 ريال.'
          : 'Detected swap of original engine (S/N: MTR-7892) from excavator EXC-001 with used engine (S/N: MTR-3201). Responsible technician: Ahmed Al-Omari. Date: January 15, 2024. Estimated value difference: $12,000.',
        affectedAssets: ['EXC-001'],
        technician: isAr ? 'أحمد العمري' : 'Ahmed Al-Omari',
        timestamp: '2024-01-15 14:32:00',
        financialImpact: isAr ? '45,000 ريال' : '$12,000'
      },
      {
        id: 'ALT-002',
        type: isAr ? 'صيانة وهمية' : 'Ghost Maintenance',
        severity: 'HIGH',
        status: 'INVESTIGATING',
        auditEntryId: 'AUD-2024-0912',
        description: isAr
          ? 'تم تسجيل 5 عمليات صيانة للمعدة LGT-004 بإجمالي تكلفة 18,500 ريال دون وجود أي تغيير في عداد ساعات التشغيل أو سجلات استهلاك الوقود. يُشتبه في تسجيل صيانة وهمية لصرف ميزانية.'
          : '5 maintenance operations logged for equipment LGT-004 totaling $5,000 with no change in operating hour meter or fuel consumption logs. Suspected ghost maintenance for budget disbursement.',
        affectedAssets: ['LGT-004'],
        technician: isAr ? 'محمد الحربي' : 'Mohammed Al-Harbi',
        timestamp: '2024-01-18 09:15:00',
        financialImpact: isAr ? '18,500 ريال' : '$5,000'
      },
      {
        id: 'ALT-003',
        type: isAr ? 'فواتير مضخمة' : 'Inflated Invoices',
        severity: 'MEDIUM',
        status: 'PENDING',
        auditEntryId: 'AUD-2024-0956',
        description: isAr
          ? 'تباين سعري بنسبة 60% في فواتير شراء قطع غيار للمعدة BLD-002 مقارنة بأسعار السوق. المورد: شركة الأمان لقطع الغيار. يُحتمل وجود اتفاق غير قانوني مع المورد.'
          : '60% price variance in spare parts purchase invoices for equipment BLD-002 compared to market prices. Supplier: Al-Aman Parts Co. Possible illegal agreement with supplier.',
        affectedAssets: ['BLD-002'],
        technician: isAr ? 'خالد المطيري' : 'Khalid Al-Mutairi',
        timestamp: '2024-01-19 11:45:00',
        financialImpact: isAr ? '28,000 ريال' : '$7,500'
      },
      {
        id: 'ALT-004',
        type: isAr ? 'استخدام غير مصرح للمعدات' : 'Unauthorized Equipment Use',
        severity: 'MEDIUM',
        status: 'RESOLVED',
        auditEntryId: 'AUD-2024-0878',
        description: isAr
          ? 'تم رصد استخدام اللودر LDR-003 خارج ساعات العمل الرسمية في موقع غير مسجل. GPS يشير إلى موقع على بعد 15 كم من موقع العمل المعتمد. التاريخ: 12 يناير 2024، الساعة 11:30 مساءً.'
          : 'Detected use of loader LDR-003 outside official working hours at unregistered location. GPS indicates location 15 km from approved work site. Date: January 12, 2024, 11:30 PM.',
        affectedAssets: ['LDR-003'],
        technician: isAr ? 'سعود الدوسري' : 'Saud Al-Dosari',
        timestamp: '2024-01-12 23:30:00',
        financialImpact: isAr ? 'غير محدد' : 'Undetermined'
      },
      {
        id: 'ALT-005',
        type: isAr ? 'تلاعب في سجلات الوقود' : 'Fuel Log Manipulation',
        severity: 'MEDIUM',
        status: 'PENDING',
        auditEntryId: 'AUD-2024-0934',
        description: isAr
          ? 'تباين كبير بين كميات الوقود المسجلة وساعات تشغيل الحفارة EXC-001. معدل استهلاك مسجل أعلى بـ 40% من المعدل الطبيعي. يُحتمل سرقة وقود أو تلاعب في السجلات.'
          : 'Significant discrepancy between recorded fuel quantities and excavator EXC-001 operating hours. Recorded consumption rate 40% higher than normal. Possible fuel theft or log manipulation.',
        affectedAssets: ['EXC-001'],
        technician: isAr ? 'فهد العتيبي' : 'Fahad Al-Otaibi',
        timestamp: '2024-01-17 16:20:00',
        financialImpact: isAr ? '12,000 ريال' : '$3,200'
      },
      {
        id: 'ALT-006',
        type: isAr ? 'وصول غير مصرح للنظام' : 'Unauthorized System Access',
        severity: 'LOW',
        status: 'RESOLVED',
        auditEntryId: 'AUD-2024-0901',
        description: isAr
          ? 'محاولات متكررة للوصول إلى وحدة تعديل سجلات الصيانة من حساب مستخدم منتهي الصلاحية. 8 محاولات فاشلة خلال الأسبوع الماضي. الحساب: user_old_tech_01.'
          : 'Repeated attempts to access maintenance log modification module from expired user account. 8 failed attempts in the past week. Account: user_old_tech_01.',
        affectedAssets: [],
        technician: isAr ? 'غير معروف' : 'Unknown',
        timestamp: '2024-01-20 08:00:00',
        financialImpact: isAr ? 'لا يوجد' : 'None'
      }
    ],
    stats: {
      totalAlerts: 6,
      highRisk: 2,
      mediumRisk: 3,
      lowRisk: 1,
      pending: 3,
      investigating: 1,
      resolved: 2,
      totalFinancialImpact: isAr ? '103,500 ريال' : '$27,700'
    }
  };
};

export const CorruptionControl: React.FC<CorruptionControlProps> = ({ lang }) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [useAI, setUseAI] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 4);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const fetchAnalysis = async () => {
    setLoading(true);

    if (useAI) {
      const result = await detectCorruptionPatterns(MOCK_AUDIT_LOGS, MOCK_ASSETS, lang);
      if (result) {
        setData(result);
      } else {
        setData(getMockCorruptionData(lang));
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 3500));
      setData(getMockCorruptionData(lang));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAnalysis();
  }, [lang]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-50 text-red-600 border-red-100';
      case 'MEDIUM': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'LOW': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-red-500';
      case 'INVESTIGATING': return 'bg-amber-500';
      case 'RESOLVED': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    if (isRtl) {
      switch (status) {
        case 'PENDING': return 'قيد الانتظار';
        case 'INVESTIGATING': return 'تحت التحقيق';
        case 'RESOLVED': return 'تم الحل';
        default: return status;
      }
    }
    return status;
  };

  const filteredAlerts = data?.alerts?.filter((alert: any) =>
    selectedFilter === 'ALL' || alert.severity === selectedFilter
  ) || [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t.corruptionControl}</h2>
              <p className="text-slate-500 font-medium">{isRtl ? 'تحليل ذكي لاكتشاف التلاعب وسوء استخدام الأصول.' : 'AI analysis to detect tampering and asset misuse.'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="w-4 h-4 rounded text-red-600"
            />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {isRtl ? 'استخدام الذكاء الاصطناعي' : 'Use AI'}
            </span>
          </label>
          <button
            onClick={fetchAnalysis}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{isRtl ? 'جاري الفحص...' : 'Scanning...'}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <span>{isRtl ? 'بدء فحص النزاهة' : 'Run Integrity Check'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center bg-white rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-50/20 to-transparent animate-scan pointer-events-none"></div>

          <div className="relative z-10">
            <div className="relative w-24 h-24 mx-auto mb-8">
              {/* Outer rings */}
              <div className="absolute inset-0 border-4 border-red-100 rounded-full animate-[spin_3s_linear_infinite]"></div>
              <div className="absolute inset-2 border-4 border-t-red-500 border-r-transparent border-b-rose-500 border-l-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>

              {/* Inner core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-full animate-pulse shadow-lg shadow-red-500/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 animate-pulse">
              {isRtl ? 'جاري فحص التلاعب...' : 'Scanning for Manipulation...'}
            </h3>
            <div className="h-6 overflow-hidden relative">
              <div className="transition-all duration-500 transform translate-y-0">
                <p className="text-red-600 font-bold uppercase tracking-widest text-xs">
                  {loadingStep === 0 && (isRtl ? 'جاري قراءة سجلات الوقود...' : 'Scanning maintenance logs...')}
                  {loadingStep === 1 && (isRtl ? 'كشف أنماط التلاعب...' : 'Detecting anomaly patterns...')}
                  {loadingStep === 2 && (isRtl ? 'تحليل مسار المشتريات...' : 'Tracing procurement trail...')}
                  {loadingStep === 3 && (isRtl ? 'حساب الأثر المالي...' : 'Calculating financial impact...')}
                </p>
              </div>
            </div>
            <div className="mt-8 w-64 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-red-500 w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      ) : data ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              {
                label: isRtl ? 'إجمالي التنبيهات' : 'Total Alerts',
                value: data.stats?.totalAlerts || data.alerts?.length || 0,
                color: 'blue',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              },
              {
                label: isRtl ? 'مخاطر عالية' : 'High Risk',
                value: data.stats?.highRisk || data.alerts?.filter((a: any) => a.severity === 'HIGH').length || 0,
                color: 'red',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              },
              {
                label: isRtl ? 'قيد الانتظار' : 'Pending',
                value: data.stats?.pending || data.alerts?.filter((a: any) => a.status === 'PENDING').length || 0,
                color: 'amber',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              },
              {
                label: isRtl ? 'تم الحل' : 'Resolved',
                value: data.stats?.resolved || data.alerts?.filter((a: any) => a.status === 'RESOLVED').length || 0,
                color: 'emerald',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              },
              {
                label: isRtl ? 'الأثر المالي' : 'Financial Impact',
                value: data.stats?.totalFinancialImpact || '$27,700',
                color: 'purple',
                isText: true,
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-10 h-10 bg-${stat.color}-50 rounded-xl flex items-center justify-center text-${stat.color}-600`}>
                    {stat.icon}
                  </span>
                </div>
                <p className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>
                  {stat.isText ? stat.value : stat.value}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute left-0 bottom-0 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </span>
                {isRtl ? 'ملخص فحص النزاهة' : 'Integrity Check Summary'}
              </h3>
              <p className="text-lg leading-relaxed text-white/90">{data.summary}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {isRtl ? 'تصفية:' : 'Filter:'}
            </span>
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${selectedFilter === filter
                  ? filter === 'HIGH' ? 'bg-red-600 text-white shadow-lg'
                    : filter === 'MEDIUM' ? 'bg-amber-500 text-white shadow-lg'
                      : filter === 'LOW' ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-slate-900 text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {filter === 'ALL' ? (isRtl ? 'الكل' : 'All') : filter}
              </button>
            ))}
          </div>

          {/* Alerts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAlerts.map((alert: any, idx: number) => (
              <div key={alert.id || idx} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className={`h-1.5 ${alert.severity === 'HIGH' ? 'bg-red-500' : alert.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                <div className="p-7">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${alert.severity === 'HIGH' ? 'bg-red-50' :
                        alert.severity === 'MEDIUM' ? 'bg-amber-50' : 'bg-emerald-50'
                        }`}>
                        {alert.severity === 'HIGH' ? '🔴' : alert.severity === 'MEDIUM' ? '🟡' : '🟢'}
                      </span>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity} {isRtl ? 'الخطورة' : 'Risk'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(alert.status)}`}></span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {getStatusLabel(alert.status)}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-red-600 transition-colors">{alert.type}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">{alert.description}</p>

                  {/* Meta Info */}
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-3 mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isRtl ? 'الفني' : 'Technician'}</span>
                      <span className="text-xs font-bold text-slate-700">{alert.technician}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isRtl ? 'الوقت' : 'Timestamp'}</span>
                      <span className="text-xs font-mono text-slate-600">{alert.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isRtl ? 'الأثر المالي' : 'Financial Impact'}</span>
                      <span className="text-xs font-bold text-red-600">{alert.financialImpact}</span>
                    </div>
                    {alert.affectedAssets && alert.affectedAssets.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isRtl ? 'الأصول' : 'Assets'}</span>
                        <div className="flex gap-1">
                          {alert.affectedAssets.map((assetId: string) => (
                            <span key={assetId} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">{assetId}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400">{alert.auditEntryId}</span>
                    <button className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-widest hover:text-red-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      {isRtl ? 'بدء تحقيق' : 'Open Investigation'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
