
import React, { useState, useEffect } from 'react';
import { Asset, MaintenanceRecord, AuditEntry } from '../types';
import { getIntegrityForecasting } from '../services/geminiService';
import { translations } from '../translations';
import { MOCK_AUDIT_LOGS, MOCK_ASSETS, MOCK_RECORDS } from '../constants';

interface IntegrityForecastProps {
  lang: 'en' | 'ar';
}

// Mock data for visual demonstration
const getMockIntegrityData = (lang: 'en' | 'ar') => {
  const isAr = lang === 'ar';
  return {
    riskIndex: 42,
    recommendations: isAr
      ? 'يوصى بتطبيق نظام فصل المهام بحيث لا يقوم نفس الفني بصيانة المعدات عالية القيمة باستمرار. كما يُنصح بتفعيل نظام تتبع القطع الإلكتروني ومراجعة دورية لسجلات الصيانة من قبل فريق مستقل. تطبيق سياسة التناوب الوظيفي سيقلل من مخاطر تضارب المصالح بنسبة تقدر بـ 35%.'
      : 'Implement a separation of duties policy where the same technician does not continuously maintain high-value equipment. Enable electronic part tracking and periodic independent audits of maintenance logs. Implementing job rotation policies could reduce conflict of interest risks by an estimated 35%.',
    findings: [
      {
        type: isAr ? 'تضارب المصالح المحتمل' : 'Potential Conflict of Interest',
        severity: 'HIGH',
        probability: 78,
        description: isAr
          ? 'الفني أحمد العمري يعمل حصرياً على المعدات الثقيلة ذات القيمة العالية (EXC-001, BLD-002) منذ 8 أشهر متتالية. هذا النمط يزيد من مخاطر التلاعب في سجلات الصيانة أو استبدال القطع.'
          : 'Technician Ahmed Al-Omari has been exclusively working on high-value heavy machinery (EXC-001, BLD-002) for 8 consecutive months. This pattern increases risks of maintenance log manipulation or part substitution.',
        targetedAssets: ['EXC-001', 'BLD-002', 'LDR-003']
      },
      {
        type: isAr ? 'صيانة وهمية مشتبه بها' : 'Suspected Ghost Maintenance',
        severity: 'MEDIUM',
        probability: 65,
        description: isAr
          ? 'تم تسجيل 3 عمليات صيانة للمعدة LGT-004 خلال الشهر الماضي دون تغيير ملحوظ في ساعات التشغيل أو استهلاك القطع. يُحتمل وجود تسجيلات صيانة وهمية.'
          : '3 maintenance operations were logged for equipment LGT-004 last month with no notable change in operating hours or parts consumption. Possible ghost maintenance entries detected.',
        targetedAssets: ['LGT-004']
      },
      {
        type: isAr ? 'مخاطر تبديل القطع' : 'Part Swapping Risk',
        severity: 'HIGH',
        probability: 82,
        description: isAr
          ? 'تم اكتشاف نمط غير طبيعي في استبدال المحركات للحفارة EXC-001. معدل استبدال المحركات أعلى بـ 300% من المتوسط الصناعي مع عدم وجود انخفاض مقابل في أعطال المعدة.'
          : 'Abnormal engine replacement pattern detected for excavator EXC-001. Engine replacement rate is 300% higher than industry average with no corresponding reduction in equipment breakdowns.',
        targetedAssets: ['EXC-001']
      },
      {
        type: isAr ? 'وصول غير مصرح به' : 'Unauthorized Access Pattern',
        severity: 'MEDIUM',
        probability: 55,
        description: isAr
          ? 'تم رصد محاولات دخول متكررة لنظام إدارة الأصول من خارج ساعات العمل الرسمية. 12 محاولة وصول في أوقات غير معتادة خلال الأسبوعين الماضيين.'
          : 'Repeated login attempts to asset management system detected outside official working hours. 12 access attempts at unusual times in the past two weeks.',
        targetedAssets: []
      },
      {
        type: isAr ? 'تكرار الإصلاحات المشبوه' : 'Suspicious Repair Frequency',
        severity: 'LOW',
        probability: 45,
        description: isAr
          ? 'المعدة BLD-002 تخضع لإصلاحات متكررة بمعدل أعلى من المتوقع. يُنصح بمراجعة جودة الإصلاحات السابقة والتحقق من كفاءة الفني المسؤول.'
          : 'Equipment BLD-002 undergoes repairs at a higher than expected frequency. Review quality of previous repairs and verify competency of assigned technician.',
        targetedAssets: ['BLD-002']
      },
      {
        type: isAr ? 'تباين في تكاليف القطع' : 'Parts Cost Variance',
        severity: 'MEDIUM',
        probability: 68,
        description: isAr
          ? 'تم رصد فارق سعري بنسبة 40% في تكلفة قطع الغيار المشتراة لنفس المعدة من موردين مختلفين. يُحتمل وجود تلاعب في فواتير الشراء.'
          : 'A 40% price variance detected in spare parts purchased for the same equipment from different suppliers. Possible manipulation of purchase invoices.',
        targetedAssets: ['EXC-001', 'LDR-003']
      }
    ]
  };
};

export const IntegrityForecast: React.FC<IntegrityForecastProps> = ({ lang }) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [useAI, setUseAI] = useState(false);
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

  const runAnalysis = async () => {
    setLoading(true);

    if (useAI) {
      const result = await getIntegrityForecasting(MOCK_AUDIT_LOGS, MOCK_ASSETS, MOCK_RECORDS, lang);
      if (result) {
        setData(result);
      } else {
        // Fallback to mock data if AI fails
        setData(getMockIntegrityData(lang));
      }
    } else {
      // Use mock data for visual demonstration
      // Increase delay to show off the animation
      await new Promise(resolve => setTimeout(resolve, 3500));
      setData(getMockIntegrityData(lang));
    }

    setLoading(false);
  };

  useEffect(() => {
    runAnalysis();
  }, [lang]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '⚠️';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-50 text-red-600 border-red-100';
      case 'MEDIUM': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'LOW': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t.integrityForecasting}</h2>
              <p className="text-slate-500 font-medium">{isRtl ? 'تحليل استباقي لتضارب المصالح والمخاطر التشغيلية غير القانونية.' : 'Proactive analysis of conflicts of interest and illegal operational risks.'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600"
            />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {isRtl ? 'استخدام الذكاء الاصطناعي' : 'Use AI'}
            </span>
          </label>
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{isRtl ? 'جاري التحليل...' : 'Analyzing...'}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span>{isRtl ? 'تحديث فحص النزاهة' : 'Update Integrity Scan'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center bg-white rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/20 to-transparent animate-scan pointer-events-none"></div>

          <div className="relative z-10">
            <div className="relative w-24 h-24 mx-auto mb-8">
              {/* Outer rings */}
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-[spin_3s_linear_infinite]"></div>
              <div className="absolute inset-2 border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>

              {/* Inner core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full animate-pulse shadow-lg shadow-indigo-500/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-3 animate-pulse">
              {isRtl ? 'جاري تحليل النزاهة...' : 'Analyzing Integrity Metrics...'}
            </h3>

            <div className="h-6 overflow-hidden relative">
              <div className="transition-all duration-500 transform translate-y-0">
                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs">
                  {loadingStep === 0 && (isRtl ? 'جاري فحص سجلات الصيانة...' : 'Auditing maintenance logs...')}
                  {loadingStep === 1 && (isRtl ? 'تحليل سلوك الفنيين...' : 'Analyzing technician behavior patterns...')}
                  {loadingStep === 2 && (isRtl ? 'مطابقة الفواتير مع السوق...' : 'Cross-referencing invoice data...')}
                  {loadingStep === 3 && (isRtl ? 'الكشف عن الشذوذ في البيانات...' : 'Detecting statistical anomalies...')}
                </p>
              </div>
            </div>

            <div className="mt-8 w-64 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      ) : data ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: isRtl ? 'إجمالي التنبيهات' : 'Total Alerts',
                value: data.findings.length,
                color: 'blue',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              },
              {
                label: isRtl ? 'مخاطر عالية' : 'High Risk',
                value: data.findings.filter((f: any) => f.severity === 'HIGH').length,
                color: 'red',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              },
              {
                label: isRtl ? 'مخاطر متوسطة' : 'Medium Risk',
                value: data.findings.filter((f: any) => f.severity === 'MEDIUM').length,
                color: 'amber',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              },
              {
                label: isRtl ? 'أصول متأثرة' : 'Affected Assets',
                value: [...new Set(data.findings.flatMap((f: any) => f.targetedAssets || []))].length,
                color: 'purple',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-10 h-10 bg-${stat.color}-50 rounded-xl flex items-center justify-center text-${stat.color}-600`}>
                    {stat.icon}
                  </span>
                  <span className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Organization Risk Index */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{isRtl ? 'مؤشر خطر النزاهة العام' : 'Overall Integrity Risk Index'}</p>
              <div className="relative w-44 h-44 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle
                    cx="80" cy="80" r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * data.riskIndex) / 100}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ${data.riskIndex > 70 ? 'text-red-500' : data.riskIndex > 40 ? 'text-amber-500' : 'text-emerald-500'}`}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-5xl font-bold ${data.riskIndex > 70 ? 'text-red-600' : data.riskIndex > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {data.riskIndex}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">%</span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${data.riskIndex > 70 ? 'bg-red-50 text-red-600' :
                data.riskIndex > 40 ? 'bg-amber-50 text-amber-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                {data.riskIndex > 70 ? (isRtl ? 'خطورة عالية' : 'High Risk') :
                  data.riskIndex > 40 ? (isRtl ? 'خطورة متوسطة' : 'Medium Risk') :
                    (isRtl ? 'خطورة منخفضة' : 'Low Risk')}
              </div>
              <p className="text-sm font-medium text-slate-500 mt-6">{isRtl ? 'تحليل مبني على سياق المعدات وسلوك الفنيين' : 'Analysis based on asset context and technician behavior'}</p>
            </div>

            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 blur-3xl"></div>
              <div className="absolute left-0 bottom-0 w-48 h-48 bg-purple-500/10 blur-3xl"></div>

              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
                <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
                {isRtl ? 'توصيات الحوكمة' : 'Governance Recommendations'}
              </h3>

              <div className="relative z-10 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                <p className="leading-relaxed text-slate-300 font-medium text-lg">"{data.recommendations}"</p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-3 relative z-10">
                <span className="px-4 py-2 bg-indigo-500/20 rounded-xl text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  {isRtl ? 'فصل المهام' : 'Separation of Duties'}
                </span>
                <span className="px-4 py-2 bg-purple-500/20 rounded-xl text-xs font-bold text-purple-300 uppercase tracking-wider">
                  {isRtl ? 'تتبع القطع' : 'Parts Tracking'}
                </span>
                <span className="px-4 py-2 bg-blue-500/20 rounded-xl text-xs font-bold text-blue-300 uppercase tracking-wider">
                  {isRtl ? 'التناوب الوظيفي' : 'Job Rotation'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Integrity Findings */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </span>
              {isRtl ? 'نتائج فحص النزاهة' : 'Integrity Findings'}
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{data.findings.length}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.findings.map((finding: any, idx: number) => (
                <div key={idx} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getSeverityIcon(finding.severity)}</span>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getSeverityColor(finding.severity)}`}>
                          {finding.severity} {isRtl ? 'الخطورة' : 'Severity'}
                        </span>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-sm font-bold ${finding.probability > 70 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                        {finding.probability}%
                      </div>
                    </div>

                    <h4 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{finding.type}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">{finding.description}</p>

                    {finding.targetedAssets && finding.targetedAssets.length > 0 && (
                      <div className="mb-6 bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{isRtl ? 'الأصول المستهدفة' : 'Targeted Assets'}</p>
                        <div className="flex flex-wrap gap-2">
                          {finding.targetedAssets.map((assetId: string) => (
                            <span key={assetId} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-pointer">{assetId}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
                      <button className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-widest hover:text-indigo-700 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        {isRtl ? 'فتح ملف تحقيق' : 'Open Investigation'}
                      </button>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {isRtl ? 'احتمالية' : 'Probability'}: {finding.probability}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
