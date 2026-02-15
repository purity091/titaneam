
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Asset, MaintenanceRecord, AuditEntry, AssetStatus, MaintenanceForecast } from '../types';
import { translations } from '../translations';
import { getAIInsights } from '../services/geminiService';

interface AssetDetailProps {
    assets: Asset[];
    records: MaintenanceRecord[];
    auditLogs: AuditEntry[];
    lang: 'en' | 'ar';
}

interface AssetPart {
    id: string;
    name: string;
    serialNumber: string;
    category: string;
    condition: 'NEW' | 'GOOD' | 'FAIR' | 'WORN' | 'REPLACE';
    installedDate: string;
    warrantyExpiry: string;
    manufacturer: string;
    cost: number;
    lifespan: number;
    currentHours: number;
}

interface Document {
    id: string;
    name: string;
    type: 'manual' | 'certificate' | 'inspection' | 'warranty' | 'invoice';
    date: string;
    size: string;
}

// Mock parts data
const getMockParts = (assetId: string, lang: 'en' | 'ar'): AssetPart[] => {
    const isAr = lang === 'ar';
    const parts: Record<string, AssetPart[]> = {
        'EXC-001': [
            { id: 'PRT-001', name: isAr ? 'محرك ديزل' : 'Diesel Engine', serialNumber: 'ENG-CAT-7892', category: isAr ? 'المحرك' : 'Engine', condition: 'GOOD', installedDate: '2022-03-15', warrantyExpiry: '2025-03-15', manufacturer: 'Caterpillar', cost: 45000, lifespan: 10000, currentHours: 4200 },
            { id: 'PRT-002', name: isAr ? 'مضخة هيدروليكية' : 'Hydraulic Pump', serialNumber: 'HYD-2847', category: isAr ? 'هيدروليك' : 'Hydraulics', condition: 'FAIR', installedDate: '2022-03-15', warrantyExpiry: '2024-03-15', manufacturer: 'Bosch Rexroth', cost: 8500, lifespan: 6000, currentHours: 4200 },
            { id: 'PRT-003', name: isAr ? 'جنزير أيسر' : 'Left Track Chain', serialNumber: 'TRK-L-9921', category: isAr ? 'نظام السير' : 'Undercarriage', condition: 'WORN', installedDate: '2023-01-20', warrantyExpiry: '2024-01-20', manufacturer: 'Berco', cost: 12000, lifespan: 4000, currentHours: 3800 },
            { id: 'PRT-004', name: isAr ? 'جنزير أيمن' : 'Right Track Chain', serialNumber: 'TRK-R-9922', category: isAr ? 'نظام السير' : 'Undercarriage', condition: 'WORN', installedDate: '2023-01-20', warrantyExpiry: '2024-01-20', manufacturer: 'Berco', cost: 12000, lifespan: 4000, currentHours: 3800 },
            { id: 'PRT-005', name: isAr ? 'ذراع البوم' : 'Boom Arm', serialNumber: 'ARM-B-4521', category: isAr ? 'الهيكل' : 'Structure', condition: 'GOOD', installedDate: '2022-03-15', warrantyExpiry: '2027-03-15', manufacturer: 'Caterpillar', cost: 25000, lifespan: 20000, currentHours: 4200 },
            { id: 'PRT-006', name: isAr ? 'أسطوانة الرفع' : 'Lift Cylinder', serialNumber: 'CYL-L-7823', category: isAr ? 'هيدروليك' : 'Hydraulics', condition: 'GOOD', installedDate: '2022-03-15', warrantyExpiry: '2025-03-15', manufacturer: 'Caterpillar', cost: 6500, lifespan: 8000, currentHours: 4200 },
            { id: 'PRT-007', name: isAr ? 'فلتر زيت المحرك' : 'Engine Oil Filter', serialNumber: 'FLT-O-1123', category: isAr ? 'فلاتر' : 'Filters', condition: 'NEW', installedDate: '2024-01-10', warrantyExpiry: '2024-04-10', manufacturer: 'Caterpillar', cost: 85, lifespan: 500, currentHours: 200 },
            { id: 'PRT-008', name: isAr ? 'فلتر الهواء' : 'Air Filter', serialNumber: 'FLT-A-1124', category: isAr ? 'فلاتر' : 'Filters', condition: 'GOOD', installedDate: '2024-01-10', warrantyExpiry: '2024-07-10', manufacturer: 'Donaldson', cost: 120, lifespan: 1000, currentHours: 200 },
        ],
        'default': [
            { id: 'PRT-101', name: isAr ? 'المكون الرئيسي' : 'Main Component', serialNumber: 'MC-0001', category: isAr ? 'أساسي' : 'Core', condition: 'GOOD', installedDate: '2022-01-01', warrantyExpiry: '2025-01-01', manufacturer: 'OEM', cost: 5000, lifespan: 10000, currentHours: 3000 },
        ]
    };
    return parts[assetId] || parts['default'];
};

const getMockDocuments = (lang: 'en' | 'ar'): Document[] => {
    const isAr = lang === 'ar';
    return [
        { id: 'DOC-001', name: isAr ? 'دليل التشغيل' : 'Operations Manual', type: 'manual', date: '2022-03-15', size: '4.2 MB' },
        { id: 'DOC-002', name: isAr ? 'شهادة الفحص السنوي' : 'Annual Inspection Certificate', type: 'certificate', date: '2024-01-10', size: '1.1 MB' },
        { id: 'DOC-003', name: isAr ? 'تقرير فحص السلامة' : 'Safety Inspection Report', type: 'inspection', date: '2024-01-10', size: '2.8 MB' },
        { id: 'DOC-004', name: isAr ? 'وثيقة الضمان' : 'Warranty Document', type: 'warranty', date: '2022-03-15', size: '0.5 MB' },
        { id: 'DOC-005', name: isAr ? 'فاتورة الشراء' : 'Purchase Invoice', type: 'invoice', date: '2022-03-15', size: '0.3 MB' },
    ];
};

export const AssetDetail: React.FC<AssetDetailProps> = ({ assets, records, auditLogs, lang }) => {
    const { id } = useParams<{ id: string }>();
    const t = translations[lang];
    const isRtl = lang === 'ar';

    const [assetForecast, setAssetForecast] = useState<MaintenanceForecast | null>(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'parts' | 'history' | 'documents'>('overview');

    const asset = assets.find(a => a.id === id);
    const assetRecords = records.filter(r => r.assetId === id);
    const assetAudit = auditLogs.filter(a => a.assetId === id);
    const assetParts = getMockParts(id || '', lang);
    const documents = getMockDocuments(lang);

    useEffect(() => {
        if (asset) {
            setLoadingAI(true);
            getAIInsights([asset], assetRecords, lang).then(result => {
                if (result && result.forecasts.length > 0) setAssetForecast(result.forecasts[0]);
                setLoadingAI(false);
            }).catch(() => setLoadingAI(false));
        }
    }, [id, lang]);

    if (!asset) {
        return (
            <div className="p-20 text-center bg-white rounded-[2.5rem]">
                <h2 className="text-2xl font-bold text-slate-400 mb-4">{isRtl ? 'الأصل غير موجود' : 'Asset Not Found'}</h2>
                <Link to="/assets" className="text-blue-600 underline">{isRtl ? 'العودة للسجل' : 'Back to Registry'}</Link>
            </div>
        );
    }

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'NEW': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'GOOD': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'FAIR': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'WORN': return 'bg-orange-50 text-orange-600 border-orange-200';
            case 'REPLACE': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getStatusBadge = (status: AssetStatus) => {
        switch (status) {
            case AssetStatus.OPERATIONAL: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case AssetStatus.MAINTENANCE: return 'bg-amber-50 text-amber-600 border-amber-100';
            case AssetStatus.DOWN: return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    const totalPartsCost = assetParts.reduce((sum, p) => sum + p.cost, 0);
    const partsNeedingAttention = assetParts.filter(p => p.condition === 'WORN' || p.condition === 'REPLACE').length;
    const totalMaintenanceCost = assetRecords.reduce((sum, r) => sum + r.cost, 0);

    const tabs = [
        { id: 'overview', label: isRtl ? 'نظرة عامة' : 'Overview', icon: '📊' },
        { id: 'parts', label: isRtl ? 'القطع والمكونات' : 'Parts & Components', icon: '⚙️', badge: partsNeedingAttention },
        { id: 'history', label: isRtl ? 'سجل الصيانة' : 'Maintenance History', icon: '📋' },
        { id: 'documents', label: isRtl ? 'المستندات' : 'Documents', icon: '📁' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-4">
                    <Link to="/fleet-board" className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        <svg className={`w-5 h-5 text-slate-500 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-slate-900">{asset.name}</h2>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(asset.status)}`}>{asset.status}</span>
                        </div>
                        <p className="text-slate-500 font-medium">{asset.id} • {asset.model} • {asset.serialNumber}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[11px] font-bold uppercase hover:bg-slate-50 transition-all">
                        {isRtl ? 'تعديل' : 'Edit'}
                    </button>
                    <button className="px-5 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-bold uppercase hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                        {isRtl ? 'تسجيل صيانة' : 'Log Maintenance'}
                    </button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: isRtl ? 'ساعات التشغيل' : 'Operating Hours', value: `${asset.usageHours}h`, sub: `/ ${asset.maxHoursBeforeService}h`, color: 'blue' },
                    { label: isRtl ? 'إجمالي القطع' : 'Total Parts', value: assetParts.length, sub: `${partsNeedingAttention} ${isRtl ? 'تحتاج انتباه' : 'need attention'}`, color: partsNeedingAttention > 0 ? 'amber' : 'emerald' },
                    { label: isRtl ? 'قيمة القطع' : 'Parts Value', value: `$${(totalPartsCost / 1000).toFixed(0)}K`, sub: isRtl ? 'إجمالي' : 'total', color: 'purple' },
                    { label: isRtl ? 'تكلفة الصيانة' : 'Maintenance Cost', value: `$${totalMaintenanceCost.toLocaleString()}`, sub: `${assetRecords.length} ${isRtl ? 'عملية' : 'records'}`, color: 'emerald' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                        <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                        <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 flex gap-2 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                        {tab.badge && tab.badge > 0 && (
                            <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${activeTab === tab.id ? 'bg-white/20' : 'bg-red-100 text-red-600'}`}>{tab.badge}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Specifications */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">📋</span>
                            {t.specifications}
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: isRtl ? 'الرقم التسلسلي' : 'Serial Number', value: asset.serialNumber },
                                { label: isRtl ? 'الموقع' : 'Location', value: asset.location },
                                { label: isRtl ? 'ساعات التشغيل' : 'Usage Hours', value: `${asset.usageHours} / ${asset.maxHoursBeforeService}` },
                                { label: t.purchaseDate, value: asset.purchaseDate },
                                { label: t.lastService, value: asset.lastMaintenanceDate },
                            ].map((spec, idx) => (
                                <div key={idx} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                                    <span className="text-xs text-slate-400 font-bold uppercase">{spec.label}</span>
                                    <span className="text-sm font-bold text-slate-900">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Forecast */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl"></div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">⚡ {t.longTermForecast}</h3>
                        {loadingAI ? (
                            <div className="animate-pulse space-y-2"><div className="h-4 bg-white/20 rounded w-full"></div><div className="h-4 bg-white/20 rounded w-3/4"></div></div>
                        ) : assetForecast ? (
                            <div className="relative z-10">
                                <p className="text-sm opacity-90 leading-relaxed mb-4">{assetForecast.longTermProjection || assetForecast.reasoning}</p>
                                <div className="pt-4 border-t border-white/20">
                                    <p className="text-[10px] uppercase opacity-60 mb-1">{t.predictedService}</p>
                                    <p className="text-xl font-bold">{assetForecast.predictedServiceDate}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm opacity-60">{isRtl ? 'لا توجد توقعات متاحة' : 'No forecast available'}</p>
                        )}
                    </div>

                    {/* Parts Summary */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <span className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">⚙️</span>
                            {isRtl ? 'حالة القطع' : 'Parts Status'}
                        </h3>
                        <div className="space-y-3">
                            {['NEW', 'GOOD', 'FAIR', 'WORN', 'REPLACE'].map(condition => {
                                const count = assetParts.filter(p => p.condition === condition).length;
                                if (count === 0) return null;
                                return (
                                    <div key={condition} className="flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getConditionColor(condition)}`}>{condition}</span>
                                        <span className="text-lg font-bold text-slate-900">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'parts' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900">{isRtl ? 'قائمة القطع والمكونات' : 'Parts & Components Inventory'}</h3>
                        <span className="text-sm text-slate-500">{assetParts.length} {isRtl ? 'قطعة' : 'parts'}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4 text-right">{isRtl ? 'القطعة' : 'Part'}</th>
                                    <th className="px-6 py-4">{isRtl ? 'الرقم التسلسلي' : 'Serial #'}</th>
                                    <th className="px-6 py-4">{isRtl ? 'الفئة' : 'Category'}</th>
                                    <th className="px-6 py-4">{isRtl ? 'الحالة' : 'Condition'}</th>
                                    <th className="px-6 py-4">{isRtl ? 'العمر الافتراضي' : 'Lifespan'}</th>
                                    <th className="px-6 py-4">{isRtl ? 'الضمان' : 'Warranty'}</th>
                                    <th className="px-6 py-4">{isRtl ? 'التكلفة' : 'Cost'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {assetParts.map(part => (
                                    <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{part.name}</p>
                                            <p className="text-xs text-slate-400">{part.manufacturer}</p>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-600">{part.serialNumber}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{part.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getConditionColor(part.condition)}`}>{part.condition}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-20">
                                                <div className="flex justify-between text-[9px] mb-1">
                                                    <span className="text-slate-400">{part.currentHours}h</span>
                                                    <span className="text-slate-600">{part.lifespan}h</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${(part.currentHours / part.lifespan) > 0.9 ? 'bg-red-500' : (part.currentHours / part.lifespan) > 0.7 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((part.currentHours / part.lifespan) * 100, 100)}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-600">{part.warrantyExpiry}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">${part.cost.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-5">{isRtl ? 'سجل الصيانة' : 'Maintenance Records'}</h3>
                        <div className="space-y-4">
                            {assetRecords.length === 0 ? (
                                <p className="text-center text-slate-400 py-10">{isRtl ? 'لا توجد سجلات' : 'No records'}</p>
                            ) : assetRecords.map(record => (
                                <div key={record.id} className="p-4 bg-slate-50 rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${record.type === 'CORRECTIVE' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{record.type}</span>
                                        <span className="text-xs text-slate-400">{record.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-2">{record.notes}</p>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">{record.technician}</span>
                                        <span className="font-bold text-emerald-600">${record.cost.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-5">{isRtl ? 'سجل التدقيق' : 'Audit Trail'}</h3>
                        <div className="space-y-4">
                            {assetAudit.length === 0 ? (
                                <p className="text-center text-slate-400 py-10">{isRtl ? 'لا توجد سجلات' : 'No records'}</p>
                            ) : assetAudit.map(log => (
                                <div key={log.id} className="p-4 bg-slate-50 rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-slate-900">{log.action}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-2">{log.details}</p>
                                    <span className="text-xs text-slate-400">{log.userId} • {log.location}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'documents' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-5">{isRtl ? 'المستندات والملفات' : 'Documents & Files'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map(doc => (
                            <div key={doc.id} className="p-4 border border-slate-100 rounded-xl hover:shadow-lg transition-all cursor-pointer group">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl">
                                        {doc.type === 'manual' ? '📘' : doc.type === 'certificate' ? '📜' : doc.type === 'inspection' ? '🔍' : doc.type === 'warranty' ? '🛡️' : '📄'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{doc.name}</p>
                                        <p className="text-xs text-slate-400">{doc.date} • {doc.size}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
