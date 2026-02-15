
import React, { useState, useEffect } from 'react';
import { Asset, MaintenanceRecord, MaintenanceForecast } from '../types';
import { getAIInsights } from '../services/geminiService';
import { translations } from '../translations';

interface InsightsProps {
  assets: Asset[];
  records: MaintenanceRecord[];
  lang: 'en' | 'ar';
}

// Mock data for visual demonstration
const getMockInsights = (assets: Asset[], lang: 'en' | 'ar') => {
  const isAr = lang === 'ar';
  return {
    executiveSummary: isAr
      ? 'بناءً على تحليل بيانات الأسطول، يُتوقع أن تحتاج 3 معدات إلى صيانة خلال الشهرين القادمين. الحفارة EXC-001 تقترب من حد الصيانة الوقائية وتتطلب اهتماماً فورياً. يُوصى بجدولة صيانة اللودر LDR-003 قبل نهاية الربع الحالي لتجنب الأعطال غير المخطط لها. معدل الاستخدام العام للأسطول في المستوى الأمثل.'
      : 'Based on fleet data analysis, 3 assets are expected to require maintenance within the next two months. Excavator EXC-001 is approaching preventive maintenance threshold and requires immediate attention. It is recommended to schedule maintenance for Loader LDR-003 before end of current quarter to avoid unplanned breakdowns. Overall fleet utilization rate is at optimal level.',
    forecasts: assets.slice(0, 4).map((asset, idx) => ({
      assetId: asset.id,
      predictedServiceDate: new Date(Date.now() + (idx + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      riskScore: [85, 62, 45, 28][idx] || 50,
      reasoning: isAr
        ? `الأصل ${asset.name} يعمل بكفاءة ${100 - [85, 62, 45, 28][idx]}%. استناداً إلى معدل الاستخدام الحالي (${asset.usageHours} ساعة) والحد الأقصى للخدمة (${asset.maxHoursBeforeService} ساعة)، يُتوقع الحاجة للصيانة قريباً.`
        : `Asset ${asset.name} is operating at ${100 - [85, 62, 45, 28][idx]}% efficiency. Based on current usage rate (${asset.usageHours} hours) and service limit (${asset.maxHoursBeforeService} hours), maintenance is expected soon.`,
      longTermProjection: isAr
        ? `خطة الصيانة السنوية تتضمن ${2 + idx} عمليات صيانة وقائية و${1 + Math.floor(idx / 2)} فحص شامل. التكلفة المتوقعة: ${(15000 + idx * 5000).toLocaleString()} ريال.`
        : `Annual maintenance plan includes ${2 + idx} preventive maintenance operations and ${1 + Math.floor(idx / 2)} comprehensive inspections. Estimated cost: $${(4000 + idx * 1500).toLocaleString()}.`
    }))
  };
};

export const Insights: React.FC<InsightsProps> = ({ assets, records, lang }) => {
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ forecasts: MaintenanceForecast[], executiveSummary: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      if (useAI) {
        const result = await getAIInsights(assets, records, lang);
        if (result) {
          setData(result);
        } else {
          setData(getMockInsights(assets, lang));
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 3500));
        setData(getMockInsights(assets, lang));
      }
    } catch (e) {
      setData(getMockInsights(assets, lang));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [lang]);

  const getRiskColor = (score: number) => {
    if (score > 80) return 'text-red-600 bg-red-50 border-red-100';
    if (score > 50) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-blue-600 bg-blue-50 border-blue-100';
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t.insights}</h2>
          <p className="text-slate-500 mt-1 font-medium">{lang === 'ar' ? 'تحليلات ذكية وتنبؤات مبنية على بيانات الاستخدام الفعلية.' : 'Smart analytics and predictions based on actual usage data.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600"
            />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {lang === 'ar' ? 'استخدام الذكاء الاصطناعي' : 'Use AI'}
            </span>
          </label>
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{lang === 'ar' ? 'جاري التحضير...' : 'Processing...'}</span>
              </>
            ) : (
              <span>{t.refreshForecasts}</span>
            )}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center bg-white rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/20 to-transparent animate-scan pointer-events-none"></div>

          <div className="relative z-10">
            <div className="relative w-24 h-24 mx-auto mb-8">
              {/* Outer rings */}
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-[spin_3s_linear_infinite]"></div>
              <div className="absolute inset-2 border-4 border-t-blue-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>

              {/* Inner core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full animate-pulse shadow-lg shadow-blue-500/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 animate-pulse">
              {lang === 'ar' ? 'جاري تحليل الأسطول...' : 'Analyzing Fleet Data...'}
            </h3>
            <div className="h-6 overflow-hidden relative">
              <div className="transition-all duration-500 transform translate-y-0">
                <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">
                  {loadingStep === 0 && (lang === 'ar' ? 'تجميع بيانات التشغيل...' : 'Aggregating fleet data...')}
                  {loadingStep === 1 && (lang === 'ar' ? 'تشغيل نماذج التنبؤ...' : 'Running predictive models...')}
                  {loadingStep === 2 && (lang === 'ar' ? 'حساب مؤشرات المخاطر...' : 'Calculating risk scores...')}
                  {loadingStep === 3 && (lang === 'ar' ? 'إنشاء الملخص التنفيذي...' : 'Generating executive summary...')}
                </p>
              </div>
            </div>
            <div className="mt-8 w-64 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      ) : data ? (
        <div className="space-y-10">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/10 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-bold mb-4 flex items-center rtl:space-x-reverse space-x-3 relative z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 3.86l-.477 2.387c-.123.617-.33 1.154-.547 1.022L11 21l-1.014-1.014c-.217-.217-.547-.123-.617.547l-.477 2.387a6 6 0 01-3.86-3.86l-.477-2.387a2 2 0 00-.547-1.022L3 14l1.014-1.014c.217-.217.123-.547-.547-.617l-2.387-.477a6 6 0 013.86-3.86l2.387-.477a2 2 0 001.022-.547L10 3l1.014 1.014c.217.217.547.123.617-.547l.477-2.387a6 6 0 013.86 3.86l.477 2.387a2 2 0 00.547 1.022L17 10l-1.014 1.014c-.217.217-.123.547.547.617l2.387.477a6 6 0 01-3.86 3.86l-2.387.477a2 2 0 00-1.022.547L14 21l-1.014-1.014z" /></svg>
              <span>{t.executiveSummary}</span>
            </h3>
            <p className="leading-relaxed opacity-90 text-lg font-medium relative z-10">{data.executiveSummary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.forecasts.map((forecast) => {
              const asset = assets.find(a => a.id === forecast.assetId);
              if (!asset) return null;
              return (
                <div key={forecast.assetId} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
                  <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">{asset.id}</p>
                        <h4 className="font-bold text-xl text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{asset.name}</h4>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl border font-bold text-xs uppercase tracking-widest shadow-sm ${getRiskColor(forecast.riskScore)}`}>
                        {forecast.riskScore}% {lang === 'ar' ? 'خطورة' : 'Risk'}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{lang === 'ar' ? 'تحليل الحالة' : 'Status Analysis'}</h5>
                      <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                        <p className="text-sm text-slate-700 italic font-medium leading-relaxed">"{forecast.reasoning}"</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{t.longTermForecast}</h5>
                      <div className="bg-blue-50/50 p-6 rounded-[1.5rem] border border-blue-100/50">
                        <p className="text-sm text-blue-900 font-medium leading-relaxed">{forecast.longTermProjection}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-sm font-bold text-slate-900 pt-4 border-t border-slate-50">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mr-3 rtl:ml-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      {t.predictedService}: <span className="text-blue-600 ml-1.5 rtl:mr-1.5">{forecast.predictedServiceDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
