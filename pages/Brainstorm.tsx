
import React, { useState } from 'react';
import { Asset, MaintenanceRecord } from '../types';
import { translations } from '../translations';

interface BrainstormProps {
    assets: Asset[];
    records: MaintenanceRecord[];
    lang: 'en' | 'ar';
}

type BrainstormCategory = 'strategy' | 'cost' | 'risk' | 'innovation' | 'sustainability';

interface BrainstormIdea {
    id: string;
    title: string;
    description: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    effort: 'HIGH' | 'MEDIUM' | 'LOW';
    category: BrainstormCategory;
    relatedAssets?: string[];
    potentialSavings?: string;
    timeline?: string;
}

interface BrainstormSession {
    topic: string;
    ideas: BrainstormIdea[];
    summary: string;
    nextSteps: string[];
}

// Enhanced Gemini brainstorming service
const getBrainstormIdeas = async (
    category: BrainstormCategory,
    assets: Asset[],
    records: MaintenanceRecord[],
    customPrompt: string,
    lang: 'en' | 'ar'
): Promise<BrainstormSession | null> => {
    const { GoogleGenAI, Type } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const categoryPrompts: Record<BrainstormCategory, string> = {
        strategy: `Generate strategic maintenance planning ideas to optimize fleet operations, improve asset utilization, and enhance long-term reliability.`,
        cost: `Brainstorm cost optimization opportunities including preventive maintenance savings, energy efficiency improvements, and resource allocation optimization.`,
        risk: `Identify potential risks and brainstorm mitigation strategies for equipment failures, safety concerns, and operational disruptions.`,
        innovation: `Suggest innovative technologies, IoT integrations, predictive maintenance solutions, and digital transformation ideas for asset management.`,
        sustainability: `Generate ideas for sustainable practices, green maintenance initiatives, energy reduction, and environmental impact minimization.`
    };

    const prompt = `
    Act as a senior industrial strategist and maintenance expert. You are facilitating a brainstorming session for an enterprise asset management team.
    
    CATEGORY FOCUS: ${categoryPrompts[category]}
    
    ADDITIONAL CONTEXT FROM USER: ${customPrompt || 'None provided'}
    
    CURRENT ASSET PORTFOLIO:
    ${JSON.stringify(assets.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        status: a.status,
        usageHours: a.usageHours,
        maxHoursBeforeService: a.maxHoursBeforeService
    })), null, 2)}
    
    RECENT MAINTENANCE HISTORY:
    ${JSON.stringify(records.slice(0, 10), null, 2)}
    
    Generate creative, actionable, and impactful ideas. Each idea should be specific to this organization's assets and situation.
    
    IMPORTANT: Provide all text content in ${lang === 'ar' ? 'Arabic' : 'English'}.
  `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 3000 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topic: { type: Type.STRING, description: "Main topic of this brainstorm session" },
                        ideas: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    impact: { type: Type.STRING, description: "HIGH, MEDIUM, or LOW" },
                                    effort: { type: Type.STRING, description: "HIGH, MEDIUM, or LOW" },
                                    category: { type: Type.STRING },
                                    relatedAssets: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    potentialSavings: { type: Type.STRING },
                                    timeline: { type: Type.STRING }
                                },
                                required: ["id", "title", "description", "impact", "effort", "category"]
                            }
                        },
                        summary: { type: Type.STRING, description: "Executive summary of the brainstorm session" },
                        nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommended next actions" }
                    },
                    required: ["topic", "ideas", "summary", "nextSteps"]
                }
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Brainstorm AI Error:", error);
        return null;
    }
};

export const Brainstorm: React.FC<BrainstormProps> = ({ assets, records, lang }) => {
    const isRtl = lang === 'ar';
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<BrainstormCategory>('strategy');
    const [customPrompt, setCustomPrompt] = useState('');
    const [session, setSession] = useState<BrainstormSession | null>(null);
    const [savedIdeas, setSavedIdeas] = useState<BrainstormIdea[]>([]);
    const [activeView, setActiveView] = useState<'brainstorm' | 'saved'>('brainstorm');

    const categories: { id: BrainstormCategory; label: string; labelAr: string; icon: React.ReactNode; color: string; bgColor: string }[] = [
        {
            id: 'strategy',
            label: 'Strategy',
            labelAr: 'الاستراتيجية',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 border-blue-100 hover:bg-blue-100'
        },
        {
            id: 'cost',
            label: 'Cost Optimization',
            labelAr: 'تحسين التكاليف',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100'
        },
        {
            id: 'risk',
            label: 'Risk Mitigation',
            labelAr: 'التخفيف من المخاطر',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50 border-amber-100 hover:bg-amber-100'
        },
        {
            id: 'innovation',
            label: 'Innovation',
            labelAr: 'الابتكار',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 border-purple-100 hover:bg-purple-100'
        },
        {
            id: 'sustainability',
            label: 'Sustainability',
            labelAr: 'الاستدامة',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50 border-teal-100 hover:bg-teal-100'
        }
    ];

    const startBrainstorm = async () => {
        setLoading(true);
        const result = await getBrainstormIdeas(selectedCategory, assets, records, customPrompt, lang);
        if (result) {
            setSession(result);
        }
        setLoading(false);
    };

    const saveIdea = (idea: BrainstormIdea) => {
        if (!savedIdeas.find(i => i.id === idea.id)) {
            setSavedIdeas([...savedIdeas, idea]);
        }
    };

    const removeIdea = (ideaId: string) => {
        setSavedIdeas(savedIdeas.filter(i => i.id !== ideaId));
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'HIGH': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'LOW': return 'bg-slate-50 text-slate-600 border-slate-100';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getEffortColor = (effort: string) => {
        switch (effort) {
            case 'HIGH': return 'bg-red-50 text-red-700 border-red-100';
            case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'LOW': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                                {isRtl ? 'العصف الذهني الذكي' : 'AI Brainstorm'}
                            </h2>
                            <p className="text-slate-500 font-medium">
                                {isRtl ? 'توليد أفكار مبتكرة لإدارة الأصول باستخدام الذكاء الاصطناعي' : 'Generate innovative asset management ideas powered by AI'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-3">
                    <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-200/60 flex">
                        <button
                            onClick={() => setActiveView('brainstorm')}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeView === 'brainstorm'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {isRtl ? 'جلسة جديدة' : 'New Session'}
                        </button>
                        <button
                            onClick={() => setActiveView('saved')}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'saved'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {isRtl ? 'المحفوظة' : 'Saved'}
                            {savedIdeas.length > 0 && (
                                <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${activeView === 'saved' ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'
                                    }`}>
                                    {savedIdeas.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {activeView === 'brainstorm' ? (
                <>
                    {/* Category Selection */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                            </span>
                            {isRtl ? 'اختر فئة التفكير' : 'Choose Brainstorm Category'}
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center group ${selectedCategory === cat.id
                                        ? `${cat.bgColor} border-current ${cat.color} shadow-lg scale-[1.02]`
                                        : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${selectedCategory === cat.id
                                        ? `${cat.bgColor} ${cat.color}`
                                        : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                                        }`}>
                                        {cat.icon}
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${selectedCategory === cat.id ? cat.color : 'text-slate-600'
                                        }`}>
                                        {isRtl ? cat.labelAr : cat.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Prompt */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 blur-3xl"></div>
                        <div className="absolute left-0 bottom-0 w-64 h-64 bg-purple-500/10 blur-3xl"></div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                </span>
                                {isRtl ? 'أضف سياقاً إضافياً (اختياري)' : 'Add Context (Optional)'}
                            </h3>

                            <textarea
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder={isRtl
                                    ? 'مثال: نريد تقليل تكاليف الصيانة بنسبة 20% خلال الربع القادم...'
                                    : 'Example: We want to reduce maintenance costs by 20% next quarter...'
                                }
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none outline-none transition-all"
                            />

                            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    onClick={startBrainstorm}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            {isRtl ? 'جاري التفكير...' : 'Generating Ideas...'}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            {isRtl ? 'ابدأ العصف الذهني' : 'Start Brainstorm'}
                                        </>
                                    )}
                                </button>

                                <p className="text-slate-400 text-xs font-medium">
                                    {isRtl
                                        ? `تحليل ${assets.length} أصل و ${records.length} سجل صيانة`
                                        : `Analyzing ${assets.length} assets and ${records.length} maintenance records`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-20 text-center">
                            <div className="relative w-24 h-24 mx-auto mb-8">
                                <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                {isRtl ? 'الذكاء الاصطناعي يفكر...' : 'AI is Brainstorming...'}
                            </h3>
                            <p className="text-slate-400 font-medium max-w-md mx-auto">
                                {isRtl
                                    ? 'يقوم نموذج Gemini بتحليل بياناتك وتوليد أفكار مبتكرة ومخصصة لوضعك.'
                                    : 'Gemini is analyzing your data and generating innovative, customized ideas for your situation.'
                                }
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {session && !loading && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Session Summary */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">
                                                {isRtl ? 'موضوع الجلسة' : 'Session Topic'}
                                            </p>
                                            <h3 className="text-2xl font-bold">{session.topic}</h3>
                                        </div>
                                        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                            <span className="text-xl font-bold">{session.ideas.length}</span>
                                            <span className="text-indigo-200 text-xs ml-1">{isRtl ? 'فكرة' : 'ideas'}</span>
                                        </div>
                                    </div>

                                    <p className="text-white/90 leading-relaxed mb-8">{session.summary}</p>

                                    <div>
                                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-3">
                                            {isRtl ? 'الخطوات التالية المقترحة' : 'Recommended Next Steps'}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {session.nextSteps.map((step, idx) => (
                                                <span key={idx} className="bg-white/10 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm">
                                                    {step}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ideas Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {session.ideas.map((idea, idx) => (
                                    <div
                                        key={idea.id}
                                        className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="p-8">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex-1">
                                                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                                                        {isRtl ? `فكرة #${idx + 1}` : `Idea #${idx + 1}`}
                                                    </span>
                                                    <h4 className="text-lg font-bold text-slate-900 mt-1 group-hover:text-indigo-600 transition-colors">
                                                        {idea.title}
                                                    </h4>
                                                </div>
                                                <button
                                                    onClick={() => saveIdea(idea)}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${savedIdeas.find(i => i.id === idea.id)
                                                        ? 'bg-indigo-100 text-indigo-600'
                                                        : 'bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-500'
                                                        }`}
                                                >
                                                    <svg className="w-5 h-5" fill={savedIdeas.find(i => i.id === idea.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Description */}
                                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                                {idea.description}
                                            </p>

                                            {/* Metrics */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getImpactColor(idea.impact)}`}>
                                                    {isRtl ? 'التأثير:' : 'Impact:'} {idea.impact}
                                                </span>
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getEffortColor(idea.effort)}`}>
                                                    {isRtl ? 'الجهد:' : 'Effort:'} {idea.effort}
                                                </span>
                                            </div>

                                            {/* Additional Info */}
                                            <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                                                {idea.potentialSavings && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-600">
                                                            <span className="text-slate-400">{isRtl ? 'التوفير المتوقع:' : 'Potential Savings:'}</span>
                                                            <span className="text-emerald-600 font-bold ml-1">{idea.potentialSavings}</span>
                                                        </span>
                                                    </div>
                                                )}

                                                {idea.timeline && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-600">
                                                            <span className="text-slate-400">{isRtl ? 'الجدول الزمني:' : 'Timeline:'}</span>
                                                            <span className="text-blue-600 font-bold ml-1">{idea.timeline}</span>
                                                        </span>
                                                    </div>
                                                )}

                                                {idea.relatedAssets && idea.relatedAssets.length > 0 && (
                                                    <div className="flex items-start gap-2">
                                                        <span className="w-6 h-6 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                        </span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {idea.relatedAssets.map(assetId => (
                                                                <span key={assetId} className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                                                    {assetId}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* Saved Ideas View */
                <div className="space-y-8">
                    {savedIdeas.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                {isRtl ? 'لا توجد أفكار محفوظة' : 'No Saved Ideas'}
                            </h3>
                            <p className="text-slate-400 font-medium max-w-md mx-auto mb-6">
                                {isRtl
                                    ? 'ابدأ جلسة عصف ذهني واحفظ الأفكار التي تعجبك للرجوع إليها لاحقاً.'
                                    : 'Start a brainstorm session and save ideas you like for later reference.'
                                }
                            </p>
                            <button
                                onClick={() => setActiveView('brainstorm')}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all"
                            >
                                {isRtl ? 'ابدأ العصف الذهني' : 'Start Brainstorming'}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedIdeas.map((idea, idx) => (
                                <div
                                    key={idea.id}
                                    className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${categories.find(c => c.id === idea.category)?.bgColor || 'bg-slate-50'
                                                } ${categories.find(c => c.id === idea.category)?.color || 'text-slate-600'}`}>
                                                {isRtl
                                                    ? categories.find(c => c.id === idea.category)?.labelAr
                                                    : categories.find(c => c.id === idea.category)?.label
                                                }
                                            </span>
                                            <button
                                                onClick={() => removeIdea(idea.id)}
                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        <h4 className="text-lg font-bold text-slate-900 mb-3">{idea.title}</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">{idea.description}</p>

                                        <div className="flex flex-wrap gap-2">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getImpactColor(idea.impact)}`}>
                                                {idea.impact}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getEffortColor(idea.effort)}`}>
                                                {idea.effort}
                                            </span>
                                            {idea.potentialSavings && (
                                                <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    {idea.potentialSavings}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
