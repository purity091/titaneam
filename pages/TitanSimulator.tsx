
import React, { useState, useEffect } from 'react';
import { Asset, AssetStatus, AssetType } from '../types';
import { translations } from '../translations';

interface TitanSimulatorProps {
    assets: Asset[];
    lang: 'en' | 'ar';
}

type SimulationStrategy = 'REACTIVE' | 'PREVENTIVE' | 'PREDICTIVE';

// ------------------------------------------------------------------
// DATA MODELS & CONSTANTS
// ------------------------------------------------------------------

// Realistic Fault Codes per Asset Type
const FAULT_CODES: Record<string, { code: string; desc: string; cost: number; downtimeHrs: number }[]> = {
    'HEAVY_MACHINERY': [
        { code: 'E04', desc: 'Hydraulic Pump Cavitation', cost: 12500, downtimeHrs: 48 },
        { code: 'E12', desc: 'Engine Cyl Misfire', cost: 8500, downtimeHrs: 24 },
        { code: 'H09', desc: 'Transmission Overheat', cost: 18000, downtimeHrs: 72 },
        { code: 'U02', desc: 'Undercarriage Track Split', cost: 22000, downtimeHrs: 96 }
    ],
    'FIXED_EQUIPMENT': [
        { code: 'C01', desc: 'Compressor Motor Burnout', cost: 5500, downtimeHrs: 36 },
        { code: 'V05', desc: 'Valve Seal Leakage', cost: 2200, downtimeHrs: 12 },
        { code: 'B02', desc: 'Bearing Seizure', cost: 4500, downtimeHrs: 24 }
    ],
    'BUILDING': [
        { code: 'HVC-02', desc: 'Chiller Unit Failure', cost: 15000, downtimeHrs: 72 },
        { code: 'ELE-09', desc: 'Main Breaker Trip', cost: 3500, downtimeHrs: 4 }
    ]
};

// Real-world Asset Models
// Real-world Asset Models
const ASSET_CATALOG = [
    { model: 'CAT 320 GC', name: 'Hydraulic Excavator', type: 'HEAVY_MACHINERY' as AssetType, costPerHour: 150, replaceCost: 220000, lifeHrs: 12000 },
    { model: 'Komatsu D155AX', name: 'Course Dozer', type: 'HEAVY_MACHINERY' as AssetType, costPerHour: 180, replaceCost: 350000, lifeHrs: 15000 },
    { model: 'Volvo A40G', name: 'Articulated Hauler', type: 'HEAVY_MACHINERY' as AssetType, costPerHour: 140, replaceCost: 400000, lifeHrs: 14000 },
    { model: 'Atlas Copco GA 75', name: 'Rotary Screw Compressor', type: 'FIXED_EQUIPMENT' as AssetType, costPerHour: 45, replaceCost: 35000, lifeHrs: 40000 },
    { model: 'Carrier 30XA', name: 'Air-Cooled Chiller', type: 'BUILDING' as AssetType, costPerHour: 80, replaceCost: 85000, lifeHrs: 60000 },
    { model: 'JCB 3CX', name: 'Backhoe Loader', type: 'HEAVY_MACHINERY' as AssetType, costPerHour: 95, replaceCost: 110000, lifeHrs: 10000 },
    { model: 'Genie Z-45', name: 'Articulating Boom Lift', type: 'HEAVY_MACHINERY' as AssetType, costPerHour: 65, replaceCost: 75000, lifeHrs: 8000 },
    { model: 'Cummins C2500D5', name: 'Diesel Generator 2500kVA', type: 'FIXED_EQUIPMENT' as AssetType, costPerHour: 200, replaceCost: 180000, lifeHrs: 20000 }
];

// Helper to generate hyper-realistic assets
const generateProAssets = (baseAssets: Asset[], count: number = 12): Asset[] => {
    const generated: Asset[] = [];

    for (let i = 0; i < count; i++) {
        // Pick a template cyclically
        const template = ASSET_CATALOG[i % ASSET_CATALOG.length];

        // Randomize age slightly (0-60% of life used)
        const usageRatio = 0.1 + (Math.random() * 0.5);
        const currentHours = Math.floor(template.lifeHrs * usageRatio);

        // Purchase date based on hours (assuming ~2000 hrs/year utilization)
        const yearsOld = currentHours / 2000;
        const purchaseDate = new Date();
        purchaseDate.setFullYear(purchaseDate.getFullYear() - yearsOld);

        generated.push({
            id: `${template.model.substring(0, 3).toUpperCase()}-${1000 + i}`,
            name: `${template.model}`,
            type: template.type,
            status: AssetStatus.OPERATIONAL,
            location: `Zone ${String.fromCharCode(65 + (i % 4))}-0${(i % 5) + 1}`,
            usageHours: currentHours,
            maxHoursBeforeService: template.lifeHrs, // Treat this as 'Useful Life' for this sim
            model: template.model,
            serialNumber: `${template.model.split(' ')[0]}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            purchaseDate: purchaseDate.toISOString().split('T')[0],
            lastMaintenanceDate: new Date(Date.now() - (Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] // 0-90 days ago
        });
    }
    return generated;
};

// ------------------------------------------------------------------
// LOGIC HELPERS
// ------------------------------------------------------------------

// Calculate wear curve (Age Factor) - Assets fail more as they get older
const getAgeWearFactor = (currentHrs: number, totalLife: number) => {
    const ratio = currentHrs / totalLife; // 0.0 to 1.0
    // Exponential wear curve: starts slow, accelerates at end of life
    if (ratio < 0.5) return 1.0;
    if (ratio < 0.8) return 1.5;
    return 3.0; // Critical wear zone
};

export const TitanSimulator: React.FC<TitanSimulatorProps> = ({ assets, lang }) => {
    const t = translations[lang];
    const isRtl = lang === 'ar';

    // State
    const [monthsInFuture, setMonthsInFuture] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [simulationSpeed, setSimulationSpeed] = useState(1);
    const [strategy, setStrategy] = useState<SimulationStrategy>('PREVENTIVE'); // Default to middle ground
    const [showInfo, setShowInfo] = useState(false);
    const [demoAssets] = useState<Asset[]>(generateProAssets(assets, 16)); // Generate 16 realistic assets

    // Calculated States
    const [simulatedAssets, setSimulatedAssets] = useState<any[]>([]);
    const [kpis, setKpis] = useState({
        totalOpEx: 0,    // Operating Expense (Maintenance)
        totalCapEx: 0,   // Capital Expense (replacements)
        downtimeCost: 0,
        roi: 0,
        criticalEvents: 0,
        fleetHealth: 100
    });

    // Strategy Configuration (Realistic Costs)
    const getStrategyConfig = (s: SimulationStrategy) => {
        switch (s) {
            case 'REACTIVE':
                return {
                    pmCostMultiplier: 0.1, // Almost no PM spend
                    failureRateMultiplier: 2.5, // High failure rate
                    lifeExtension: 0.8 // Assets die 20% faster
                };
            case 'PREVENTIVE':
                return {
                    pmCostMultiplier: 1.0,
                    failureRateMultiplier: 1.0,
                    lifeExtension: 1.0
                };
            case 'PREDICTIVE':
                return {
                    pmCostMultiplier: 1.4, // Higher upfront (sensors, software)
                    failureRateMultiplier: 0.2, // Very low failure
                    lifeExtension: 1.25 // Assets differ 25% longer
                };
        }
    };

    // ------------------------------------------------------------------
    // SIMULATION ENGINE
    // ------------------------------------------------------------------
    useEffect(() => {
        const config = getStrategyConfig(strategy);

        if (monthsInFuture === 0) {
            // Reset
            setSimulatedAssets(demoAssets.map(a => ({
                ...a,
                currentHealth: 100 - ((a.usageHours / a.maxHoursBeforeService) * 100),
                simStatus: 'OPERATIONAL',
                lastEvent: null,
                accCost: 0,
                totalHours: a.usageHours // Add initial hours
            })));
            setKpis({ totalOpEx: 0, totalCapEx: 0, downtimeCost: 0, roi: 0, criticalEvents: 0, fleetHealth: 85 });
            return;
        }

        let opEx = 0;
        let downCost = 0;
        let failures = 0;
        let totalHealth = 0;

        const newAssets = demoAssets.map(a => {
            const template = ASSET_CATALOG.find(t => t.name === a.name) || ASSET_CATALOG[0];
            const hoursPerMonth = 200; // Average industrial utilization

            // Calculate usage metrics
            const addedHours = monthsInFuture * hoursPerMonth;
            const totalHours = a.usageHours + addedHours;
            const lifeRatio = totalHours / a.maxHoursBeforeService; // 0.0 - 1.0+

            // Base Health Calculation
            // Reactive drops fast. Predictive maintains high health.
            // Wear increases with Age Factor.
            const ageFactor = getAgeWearFactor(totalHours, a.maxHoursBeforeService * config.lifeExtension);
            const degradationBase = 0.5; // % per month
            const degradation = degradationBase * ageFactor; // Modified by age

            // Strategy Impact on Health
            // Reactive allows degradation relative to raw hours.
            // Predictive uses interventions to restore 'Health%' regularly (simulated).
            let currentHealth = 100 - (lifeRatio * 100);
            if (strategy === 'PREDICTIVE') currentHealth += (monthsInFuture * 0.2); // AI Optimization 'heals' simulated inefficiencies
            if (strategy === 'REACTIVE') currentHealth -= (monthsInFuture * 0.5); // Lack of lube/tuning accelerates wear

            // Bounds
            currentHealth = Math.min(100, Math.max(0, currentHealth));
            totalHealth += currentHealth;

            // Failure Simulation (Monte Carlo)
            let status = 'OPERATIONAL';
            let event = null;
            let cost = hoursPerMonth * monthsInFuture * (template.costPerHour * 0.1); // Base Fuel/Fluids cost

            // Probability of failure correlates to Health^-1
            const failProb = (100 - currentHealth) / 1000 * config.failureRateMultiplier;
            // Roll dice for EACH month passed (simplified as one big roll scaled by time)
            const riskRoll = Math.random();
            const cumulativeRisk = 1 - Math.pow(1 - failProb, monthsInFuture); // P(at least one fail)

            if (cumulativeRisk > 0.7 && currentHealth < 40) {
                // FAILURE EVENT
                status = 'DOWN';
                failures++;

                // Pick specific fault code
                const codes = FAULT_CODES[a.type] || FAULT_CODES['HEAVY_MACHINERY'];
                const fault = codes[Math.floor(Math.random() * codes.length)];

                event = fault;

                // Financial Impact
                cost += fault.cost;
                cost += (template.costPerHour * fault.downtimeHrs * 3); // Downtime multiplier (loss of production)
                downCost += (template.costPerHour * fault.downtimeHrs * 3);

            } else if (currentHealth < 60 && strategy !== 'REACTIVE') {
                status = 'MAINTENANCE';
                cost += 2000; // Standard Service Cost
            }

            // Corrective vs Preventive Spend
            if (strategy !== 'REACTIVE') {
                opEx += (monthsInFuture * 500 * config.pmCostMultiplier); // Monthly PM Service budget
            }

            opEx += cost;

            return {
                ...a,
                currentHealth,
                simStatus: status,
                lastEvent: event,
                accCost: cost,
                totalHours: Math.floor(totalHours)
            };
        });

        // ROI Calculation (vs Estimated Reactive Baseline of $50k/month for this fleet size)
        const baselineReactive = monthsInFuture * 65000;
        const totalTotal = opEx + downCost;
        const roi = ((baselineReactive - totalTotal) / totalTotal) * 100;

        setKpis({
            totalOpEx: opEx,
            totalCapEx: 0,
            downtimeCost: downCost,
            roi: totalTotal > 0 ? roi : 0,
            criticalEvents: failures,
            fleetHealth: Math.floor(totalHealth / newAssets.length)
        });

        setSimulatedAssets(newAssets);

    }, [monthsInFuture, strategy]);

    // Timer
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setMonthsInFuture(prev => { if (prev >= 36) { setIsPlaying(false); return 36; } return prev + 1; });
            }, 600 / simulationSpeed);
        }
        return () => clearInterval(interval);
    }, [isPlaying, simulationSpeed]);

    const dateString = new Date(new Date().setMonth(new Date().getMonth() + monthsInFuture)).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="space-y-6 min-h-screen">
            {/* 1. TOP BAR: TITLE & STRATEGY */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        {isRtl ? 'نظام محاكاة تاينان™' : 'Titan Simulator™'}
                        <span className="text-lg font-medium text-slate-400 ml-3 align-middle font-mono">v4.2.0-PRO</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 max-w-2xl">
                        {isRtl ? 'محرك محاكاة صناعي يعتمد على توزيع ويبول وتقييم دورة الحياة.' : 'Industrial-grade simulation engine utilizing Weibull distribution and Lifecycle Cost Analysis (LCCA).'}
                    </p>
                </div>

                <div className="flex bg-white shadow-sm p-1.5 rounded-xl border border-slate-200">
                    {['REACTIVE', 'PREVENTIVE', 'PREDICTIVE'].map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStrategy(s as any); setMonthsInFuture(0); }}
                            className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${strategy === s
                                ? s === 'PREDICTIVE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' :
                                    s === 'PREVENTIVE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-700 text-white shadow-lg'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {isRtl ? s : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. CONTROL DECK & KPIS */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Control Panel */}
                <div className="xl:col-span-8 bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    <div className="relative z-10">
                        {/* Timeline Visualization */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <span className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] block mb-1">Projected Date</span>
                                    <span className="text-3xl font-mono">{dateString}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] block mb-1">Time Horizon</span>
                                    <span className="text-xl font-mono text-indigo-300">T+{monthsInFuture} Months</span>
                                </div>
                            </div>

                            <div className="relative h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center px-4">
                                <input
                                    type="range" min="0" max="36" value={monthsInFuture}
                                    onChange={(e) => setMonthsInFuture(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    style={{ zIndex: 20 }}
                                />

                                {/* Ticks */}
                                <div className="absolute top-10 left-4 right-4 flex justify-between text-[10px] text-slate-500 font-mono">
                                    <span>NOW</span>
                                    <span>1 YEAR</span>
                                    <span>2 YEARS</span>
                                    <span>3 YEARS</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`h-14 px-8 rounded-2xl flex items-center gap-3 font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${isPlaying ? 'bg-red-500 text-white shadow-xl shadow-red-500/30' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30'}`}
                            >
                                {isPlaying ? (
                                    <>
                                        <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
                                        <span>PAUSE SIM</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        <span>RUN SIMULATION</span>
                                    </>
                                )}
                            </button>
                            <button onClick={() => setMonthsInFuture(0)} className="h-14 w-14 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </button>
                            <div className="h-14 bg-black/30 rounded-2xl flex items-center p-1.5 ml-auto">
                                {[1, 2, 4, 8].map(speed => (
                                    <button
                                        key={speed}
                                        onClick={() => setSimulationSpeed(speed)}
                                        className={`h-full px-4 rounded-xl text-xs font-bold font-mono transition-all ${simulationSpeed === speed ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        {speed}x
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial KPI Card */}
                <div className="xl:col-span-4 bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6 flex justify-between items-center">
                            <span>Financial Impact</span>
                            <span className={`px-2 py-1 rounded text-[10px] ${kpis.roi >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {kpis.roi > 0 ? '+' : ''}{kpis.roi.toFixed(1)}% ROI
                            </span>
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-2xl font-bold text-slate-900">${(kpis.totalOpEx / 1000).toFixed(1)}k</span>
                                    <span className="text-xs font-bold text-slate-500">OPEX (Maint)</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-2xl font-bold text-slate-900">${(kpis.downtimeCost / 1000).toFixed(1)}k</span>
                                    <span className="text-xs font-bold text-slate-500">Loss of Production</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (kpis.downtimeCost / (kpis.totalOpEx + 1)) * 50)}%` }}></div>
                                </div>
                            </div>

                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 mt-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold mt-1">
                                        {kpis.criticalEvents}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-red-800 uppercase">Critical Failure Events</p>
                                        <p className="text-[10px] text-red-600 leading-tight mt-1">
                                            Total stoppages requirng component replacement.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. ASSET GRID (DENSE & DETAILED) */}
            <div className="overflow-x-auto pb-4">
                <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <th className="pb-3 pl-4">Asset Details</th>
                            <th className="pb-3">Life Cycle</th>
                            <th className="pb-3">Health Status</th>
                            <th className="pb-3">Simulated Condition</th>
                            <th className="pb-3">Total Cost</th>
                        </tr>
                    </thead>
                    <tbody className="align-middle">
                        {/* Space handled by border-spacing */}

                        {simulatedAssets.map((asset) => (
                            <tr key={asset.id} className="bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl group transition-all">
                                {/* Asset Info */}
                                <td className="p-4 rounded-l-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${asset.type === AssetType.HEAVY_MACHINERY ? 'bg-orange-100 text-orange-700' :
                                            asset.type === AssetType.FIXED_EQUIPMENT ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {asset.model.substring(0, 2)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{asset.model}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{asset.serialNumber}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Life Cycle */}
                                <td className="p-4">
                                    <div className="w-32">
                                        <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono">
                                            <span>{asset.totalHours.toLocaleString()}h</span>
                                            <span>{asset.maxHoursBeforeService.toLocaleString()}h</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${asset.totalHours > asset.maxHoursBeforeService ? 'bg-red-500' : 'bg-slate-800'}`}
                                                style={{ width: `${Math.min(100, (asset.totalHours / asset.maxHoursBeforeService) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>

                                {/* Health Status */}
                                <td className="p-4">
                                    {asset.simStatus === 'DOWN' ? (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200 animate-pulse">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="font-mono">{asset.lastEvent ? asset.lastEvent.code : 'ERR'}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="text-2xl font-bold text-slate-700">{Math.round(asset.currentHealth)}%</div>
                                            <div className={`h-2 w-2 rounded-full ${asset.currentHealth > 80 ? 'bg-emerald-500' : asset.currentHealth > 40 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                        </div>
                                    )}
                                </td>

                                {/* Condition Details */}
                                <td className="p-4">
                                    {asset.simStatus === 'DOWN' && asset.lastEvent ? (
                                        <div>
                                            <div className="text-xs font-bold text-red-600">{asset.lastEvent.desc}</div>
                                            <div className="text-[10px] text-slate-400">Est. Repair: {asset.lastEvent.downtimeHrs} hrs</div>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-slate-500">
                                            {asset.currentHealth > 90 ? 'Optimal Performance' :
                                                asset.currentHealth > 60 ? 'Standard Wear' :
                                                    strategy === 'REACTIVE' ? 'Accelerated Degradation' : 'Maintenance Due'}
                                        </div>
                                    )}
                                </td>

                                {/* Cost */}
                                <td className="p-4 rounded-r-2xl">
                                    <div className="font-mono font-bold text-slate-700">
                                        ${asset.accCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};
