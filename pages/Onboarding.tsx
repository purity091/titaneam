import React, { useState } from 'react';
import { translations } from '../translations';

interface OnboardingProps {
  lang: 'en' | 'ar';
}

interface SandboxLog {
  time: string;
  type: 'info' | 'success' | 'warning' | 'danger' | 'ai';
  messageEn: string;
  messageAr: string;
}

export const Onboarding: React.FC<OnboardingProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const t = translations[lang];

  // State management
  const [activeTab, setActiveTab] = useState<'path' | 'modules' | 'sandbox' | 'glossary'>('path');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [sandboxLogs, setSandboxLogs] = useState<SandboxLog[]>([
    {
      time: '12:00:00',
      type: 'info',
      messageEn: 'System initialized. Welcome to TitanEAM Interactive Sandbox.',
      messageAr: 'تم تشغيل النظام. مرحبًا بك في بيئة العمل التجريبية لمنصة TitanEAM.'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scannedPart, setScannedPart] = useState<any>(null);
  const [wearProgress, setWearProgress] = useState<number>(0);
  const [integrityState, setIntegrityState] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [integrityReport, setIntegrityReport] = useState<any>(null);
  const [aiIdea, setAiIdea] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Local translations
  const guideTranslations = {
    en: {
      title: "TitanEAM Operator Guide",
      subtitle: "Welcome to your comprehensive interactive guide to master Enterprise Asset Management",
      tabPath: "Getting Started Path",
      tabModules: "Modules Explorer",
      tabSandbox: "Interactive Sandbox",
      tabGlossary: "EAM Glossary",
      certifiedTitle: "TitanEAM Operator Badge",
      certifiedSub: "Complete all steps below to unlock your operator certification status.",
      badgeEarned: "Certified Operator",
      badgePending: "Operator Trainee",
      progress: "Onboarding Progress",
      completed: "Completed",
      of: "of",
      tryNow: "Try Action",
      done: "Step Completed!",
      sandboxConsole: "Live Sandbox Console",
      sandboxDesc: "Trigger simulated security alerts, maintenance predictions, and AI reasoning logs to observe the platform's behaviors.",
      clearLogs: "Clear Console",
      triggerBtn1: "Trigger Critical Part Swap Alert",
      triggerBtn2: "Run AI Predictive Wear Audit",
      triggerBtn3: "Scan Smart QR Code",
      triggerBtn4: "Detect Vendor Conflict of Interest",
      terminalTitle: "TitanEAM Live Logs Feed",
      glossaryTitle: "EAM Jargon & Terms",
      glossarySearch: "Search terms...",
      noResults: "No terms found matching your search.",
      steps: [
        {
          id: 1,
          title: "Explore the Asset Registry",
          desc: "Learn how assets are categorized by status (Operational, Standby, Maintenance, Down) and wear limit hours.",
          actionLabel: "Access registry statistics",
          details: "TitanEAM tracks mechanical age utilizing utilization curves. An asset transitions to warning status when its cumulative hours exceed its target service limit."
        },
        {
          id: 2,
          title: "Simulate a Smart Spare Part Scan",
          desc: "Test the barcode/QR code scan system that maps components to physical assets and detects unauthorized swaps.",
          actionLabel: "Simulate Camera QR Scan",
          details: "Scan spare parts to view their condition (New, Used, Damaged). The system generates high-priority alerts in the Corruption Control panel if an unlogged swap occurs."
        },
        {
          id: 3,
          title: "Run a Predictive Lifecycle Forecast",
          desc: "Trigger a mathematical calculation of wear factors and failure probability curves.",
          actionLabel: "Calculate Wear Factors",
          details: "TitanEAM uses Weibull distribution curve models to estimate mean time between failures (MTBF), allowing you to convert costly corrective repairs into planned preventive measures."
        },
        {
          id: 4,
          title: "Audit Procurement Conflicts",
          desc: "Audit relations between system engineers and vendors to prevent bid rigging and corruption.",
          actionLabel: "Scan Vendor Relationships",
          details: "Using natural language processing and historical logs, TitanEAM identifies duplicate bank routing numbers, addresses, and family relations between operators and contractors."
        },
        {
          id: 5,
          title: "Consult AI Brainstorm Helper",
          desc: "Utilize Gemini-powered strategic queries to generate operational efficiency ideas.",
          actionLabel: "Generate AI Strategic Idea",
          details: "The brainstorm system connects to Gemini to analyze active fleet parameters and output customized green-maintenance and cost-saving guidelines."
        }
      ]
    },
    ar: {
      title: "دليل مشغل منصة TitanEAM",
      subtitle: "مرحباً بك في دليلك التفاعلي الشامل لإتقان إدارة الأصول المؤسسية وحمايتها",
      tabPath: "مسار التأسيس والبدء",
      tabModules: "مستكشف الأقسام",
      tabSandbox: "المختبر التفاعلي",
      tabGlossary: "قاموس مصطلحات EAM",
      certifiedTitle: "شارة مشغل TitanEAM المعتمد",
      certifiedSub: "أكمل كافة الخطوات التفاعلية أدناه للحصول على الشارة والتحول إلى مشغل معتمد.",
      badgeEarned: "مشغل معتمد",
      badgePending: "مشغل تحت التدريب",
      progress: "التقدم في التأسيس",
      completed: "اكتملت",
      of: "من",
      tryNow: "تجربة الإجراء",
      done: "اكتملت الخطوة!",
      sandboxConsole: "المختبر ولوحة التحكم التفاعلية",
      sandboxDesc: "قم بتشغيل تنبيهات أمنية محاكاة، وتوقعات الصيانة، وسجلات تفكير الذكاء الاصطناعي لمشاهدة ردود أفعال المنصة الفورية.",
      clearLogs: "مسح سجلات اللوحة",
      triggerBtn1: "محاكاة تبديل قطعة غير مصرح به",
      triggerBtn2: "تشغيل تدقيق استهلاك الأصول ذكاء اصطناعي",
      triggerBtn3: "محاكاة مسح كود QR ذكي",
      triggerBtn4: "كشف تضارب المصالح مع الموردين",
      terminalTitle: "تغذية السجلات المباشرة لـ TitanEAM",
      glossaryTitle: "مفاهيم ومصطلحات الصيانة والإدارة",
      glossarySearch: "بحث في المصطلحات...",
      noResults: "لم يتم العثور على مصطلحات تطابق بحثك.",
      steps: [
        {
          id: 1,
          title: "استكشاف سجل الأصول",
          desc: "تعرف على كيفية تصنيف الأصول حسب حالتها التشغيلية ومستوى استهلاكها الفعلي بالتقارير الدقيقة.",
          actionLabel: "قراءة إحصائيات السجل",
          details: "تقوم المنصة بحساب العمر الميكانيكي للأصول. ينتقل الأصل تلقائياً إلى مرحلة الخطر عند تخطي ساعات التشغيل التراكمية حد الصيانة المقدر."
        },
        {
          id: 2,
          title: "مسح قطعة غيار ذكية (QR Scan)",
          desc: "اختبر آلية قراءة الباركود/QR التي تربط القطع بالأصول وتكشف عمليات السرقة والاستبدال المشبوهة.",
          actionLabel: "مسح كود QR افتراضي",
          details: "عند استبدال أي قطعة في الأصول، يقرأ النظام الرقم التسلسلي لتتبع حالتها (جديدة، مستعملة، تالفة). في حال التبديل دون إذن عمل، يرسل النظام إنذاراً فورياً بقسم مكافحة الفساد."
        },
        {
          id: 3,
          title: "تشغيل التوقعات الوقائية للأصل",
          desc: "شغّل محاكاة رياضية لحسابات منحنى الاستهلاك واحتمالات الفشل المبكر للأصل.",
          actionLabel: "حساب معدلات التآكل",
          details: "نستخدم نماذج توزيع Weibull الرياضية لتقدير الوقت المتوقع قبل الأعطال (MTBF) لنتمكن من جدولة الصيانة الوقائية قبل حدوث الكارثة وتوفير التكلفة الكبيرة."
        },
        {
          id: 4,
          title: "تدقيق تضارب المصالح والمشتريات",
          desc: "حلل الروابط المخفية بين المشرفين والمقاولين الخارجيين لمنع التلاعب في العطاءات ورصد الفساد الإداري.",
          actionLabel: "فحص علاقات الموردين",
          details: "عبر تقاطع بيانات الحسابات والاتصالات والمواقع، ترصد المنصة تشابه الحسابات البنكية أو علاقات القرابة التي تثير الشكوك في إسناد عقود الصيانة."
        },
        {
          id: 5,
          title: "التفاعل مع مستشار العصف الذهني AI",
          desc: "استعن بنماذج Gemini لتقديم مقترحات تحسين كفاءة الطاقة وتخفيض تكاليف تشغيل الأسطول.",
          actionLabel: "توليد فكرة استراتيجية ذكية",
          details: "يرتبط نظام العصف الذهني بنماذج Gemini لفحص بيانات المعدات واقتراح خطط مبتكرة للصيانة المستدامة وتوفير قطع الغيار."
        }
      ]
    }
  };

  const gt = guideTranslations[lang];

  // Helper to add logs to sandbox console
  const addLog = (type: 'info' | 'success' | 'warning' | 'danger' | 'ai', messageEn: string, messageAr: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setSandboxLogs(prev => [
      { time, type, messageEn, messageAr },
      ...prev.slice(0, 19) // Keep last 20 logs
    ]);
  };

  // Step Action Simulators
  const runStepAction = (stepId: number) => {
    if (completedSteps.includes(stepId)) return;

    if (stepId === 1) {
      addLog('info', 'Executing API Call: GET /api/assets/statistics', 'تنفيذ استدعاء برمجية: GET /api/assets/statistics');
      addLog('success', 'Registry loaded: 24 active assets, 4 under maintenance, 2 down.', 'تم تحميل السجل: 24 أصل نشط، 4 تحت الصيانة، 2 معطلة.');
      setCompletedSteps(prev => [...prev, 1]);
    } else if (stepId === 2) {
      setScanState('scanning');
      addLog('info', 'Activating camera simulator for barcode read...', 'تفعيل محاكي الكاميرا لقراءة الباركود...');
      setTimeout(() => {
        setScanState('success');
        setScannedPart({
          name: 'Turbocharger Compressor Wheel',
          serial: 'SN-TRB-90928-X',
          condition: 'NEW',
          mapping: 'CAT-1002 (Hydraulic Excavator)'
        });
        addLog('success', 'QR Code scanned successfully! Serial: SN-TRB-90928-X.', 'تم مسح كود QR بنجاح! الرقم التسلسلي: SN-TRB-90928-X.');
        addLog('info', 'Verifying parts authorization registry...', 'التحقق من سجل تخويل القطع البديلة...');
        addLog('success', 'Authorized parts validation: MATCH. No anomalies detected.', 'مصادقة القطع المصرح بها: مطابقة. لم يتم كشف شذوذ.');
        setCompletedSteps(prev => [...prev, 2]);
      }, 1500);
    } else if (stepId === 3) {
      setWearProgress(20);
      addLog('info', 'Loading Weibull degradation model coefficients...', 'تحميل معاملات نموذج ويبل للتآكل التدريجي...');
      const interval = setInterval(() => {
        setWearProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            addLog('success', 'Predictive failure audit complete. Asset CAT-1004 failure probability: 82.4% within 45 days.', 'اكتمل تدقيق الأعطال الوقائي. احتمال فشل الأصل CAT-1004: 82.4% خلال 45 يومًا.');
            setCompletedSteps(prev => [...prev, 3]);
            return 100;
          }
          return prev + 20;
        });
      }, 300);
    } else if (stepId === 4) {
      setIntegrityState('analyzing');
      addLog('warning', 'Initiating procurement auditing logic: cross-checking engineer profiles...', 'بدء تشغيل منطق تدقيق المشتريات: تقاطع ملفات المهندسين المشرفين...');
      setTimeout(() => {
        setIntegrityState('done');
        setIntegrityReport({
          riskLevel: 'HIGH',
          flaggedLink: 'Engineer "Adam Smith" shares address & bank code prefix with contractor "Smith Heavy Industries LLC".',
          flaggedLinkAr: 'المهندس "آدم سميث" يتشارك العنوان وبادئة الحساب البنكي مع المقاول "Smith Heavy Industries LLC".',
          actionTaken: 'Audit alert dispatched to Security & Compliance Officer.',
          actionTakenAr: 'تم إرسال تنبيه تدقيق فوري لمدير الامتثال والنزاهة.'
        });
        addLog('danger', 'ALERT: Conflict of interest found between procurement supervisor and contractor Smith Heavy Industries!', 'تنبيه: تم رصد تعارض مصالح محتمل بين مشرف المشتريات والمقاول Smith Heavy Industries!');
        setCompletedSteps(prev => [...prev, 4]);
      }, 1800);
    } else if (stepId === 5) {
      setIsAiLoading(true);
      addLog('ai', 'Sending parameters to Gemini-3-Flash for sustainability advice...', 'إرسال بيانات الأصول لنموذج Gemini-3-Flash لطلب توصيات الاستدامة...');
      setTimeout(() => {
        setIsAiLoading(false);
        const advice = lang === 'ar' 
          ? 'توصية الذكاء الاصطناعي: قم بتركيب حساسات اهتزاز (IoT Vibe) على المولد ديزل رقم CUM-1007 لتقليل تكلفة الفحص المباشر بنسبة 30% وإطالة عمر التروس بمعدل 3 سنوات.' 
          : 'AI Advice: Install vibration sensors (IoT Vibe) on Diesel Generator CUM-1007 to reduce manual inspection cost by 30% and extend gear lifecycle by 3 years.';
        setAiIdea(advice);
        addLog('ai', `Gemini response received: "${advice.substring(0, 45)}..."`, `تم استقبال إجابة Gemini: "${advice.substring(0, 45)}..."`);
        setCompletedSteps(prev => [...prev, 5]);
      }, 1500);
    }
  };

  const isCertified = completedSteps.length === 5;

  const resetAllSimulators = () => {
    setCompletedSteps([]);
    setScanState('idle');
    setScannedPart(null);
    setWearProgress(0);
    setIntegrityState('idle');
    setIntegrityReport(null);
    setAiIdea('');
    setSandboxLogs([
      {
        time: new Date().toTimeString().split(' ')[0],
        type: 'info',
        messageEn: 'System reset complete. Operator workspace clean.',
        messageAr: 'تم إعادة تهيئة المختبر بالكامل. بيئة عمل المشغل جاهزة.'
      }
    ]);
  };

  // Modules Data
  const modulesList = [
    {
      titleEn: "Dashboard & Navigation",
      titleAr: "لوحة التحكم الرئيسية",
      icon: "📊",
      descEn: "Real-time KPIs tracking total assets, operational rates, downtime percentages, and pending high-priority maintenance costs.",
      descAr: "تتبع فوري لمؤشرات الأداء الرئيسية مثل إجمالي الأصول، نسب التشغيل، نسب التعطل، وقيم الصيانة المعلقة ذات الأولوية العالية.",
      badge: "Base Module"
    },
    {
      titleEn: "Fleet Board",
      titleAr: "لوحة الأسطول ومواقع العمل",
      icon: "🚚",
      descEn: "Shows live operational metrics and distribution of heavy vehicles, fixed compressors, and HVAC units across different worksite zones.",
      descAr: "تعرض مؤشرات التشغيل المباشرة وتوزيع المركبات الثقيلة، الضواغط، وأجهزة التكييف عبر مناطق العمل المختلفة.",
      badge: "Operational"
    },
    {
      titleEn: "Asset Registry & Profile",
      titleAr: "سجل الأصول والملفات التفصيلية",
      icon: "🗄️",
      descEn: "Deep-dive asset inventory mapping purchase histories, technical parameters, location tracking, and visual wear-limit indicators.",
      descAr: "فهرس تفصيلي للأصول يوضح تاريخ الشراء، المواصفات الفنية، مواقع الحركة، مع مؤشر مرئي لمعدلات استهلاك ساعات الخدمة.",
      badge: "Core Data"
    },
    {
      titleEn: "AI Insights & Forecasts",
      titleAr: "رؤى وتوقعات الذكاء الاصطناعي",
      icon: "⚡",
      descEn: "Calculates degradation rates of critical machines and projects when they will require preventive checkups to prevent sudden breakdown.",
      descAr: "تحسب معدلات تآكل الآلات الحرجة وتتنبأ بالوقت الأمثل لإجراء الصيانة الوقائية لتلافي التوقف الفجائي للإنتاج.",
      badge: "AI Powered"
    },
    {
      titleEn: "Strategic Roadmap",
      titleAr: "خارطة الطريق السنوية للصيانة",
      icon: "📅",
      descEn: "A 12-month calendar dashboard forecasting monthly workloads, predicting labor, and projecting operational expenses.",
      descAr: "لوحة تقويمية تمتد لـ 12 شهراً تتنبأ بضغط العمل الشهري وتكاليف التشغيل وقوة العمل الفنية المطلوبة.",
      badge: "Planning"
    },
    {
      titleEn: "Titan Simulator™",
      titleAr: "محاكي تايتان™ الاستراتيجي",
      icon: "🎮",
      descEn: "Allows administrators to simulate fleet behavior 36 months into the future under Reactive, Preventive, or Predictive strategies.",
      descAr: "يتيح لمديري النظام محاكاة أداء الأسطول لـ 36 شهراً مستقبلياً لمقارنة استراتيجيات الصيانة المختلفة وتوفيرها المالي.",
      badge: "Simulation Engine"
    },
    {
      titleEn: "AI Brainstorm",
      titleAr: "العصف الذهني الذكي",
      icon: "💡",
      descEn: "Direct workspace connected to Gemini to request customizable cost reduction strategies, green practices, and risk mitigations.",
      descAr: "مساحة عمل مخصصة مرتبطة بنماذج Gemini لطلب خطط توفير التكلفة وحلول الاستدامة البيئية وإدارة الأخطار الكبرى.",
      badge: "AI Consulting"
    },
    {
      titleEn: "Integrity Risks",
      titleAr: "مخاطر النزاهة وتضارب المصالح",
      icon: "🔍",
      descEn: "Scans corporate records, detecting bid-rigging warning signs, repetitive emergency vendors, and collusion vectors.",
      descAr: "تفحص سجلات المشتريات لاكتشاف شبهات التلاعب بالعطاءات، أو تكرار الموردين المشبوهين، أو تضارب المصالح مع الموظفين.",
      badge: "Compliance"
    },
    {
      titleEn: "Audit Logs",
      titleAr: "سجل التدقيق والتعقب",
      icon: "📝",
      descEn: "An immutable history recording every user log, asset modification, parts check-in, and parameter update for governance.",
      descAr: "سجل تاريخي غير قابل للتلاعب يوثق كافة حركات المستخدمين، تعديل الأصول، وتركيب قطع الغيار لضمان الحوكمة والشفافية.",
      badge: "Security"
    },
    {
      titleEn: "Corruption Control",
      titleAr: "مكافحة الفساد وتتبع السرقة",
      icon: "🛡️",
      descEn: "Flags anomalous component activity such as 'Part Swap' where high-value new parts are surreptitiously replaced with old parts.",
      descAr: "ترصد الأنشطة الشاذة لقطع الغيار مثل 'استبدال القطع' غير المصرح به (استبدال قطع جديدة بأخرى مستعملة وتالفة دون إذن).",
      badge: "Security"
    },
    {
      titleEn: "Spare Parts Management",
      titleAr: "إدارة وتتبع قطع الغيار",
      icon: "⚙️",
      descEn: "Logs serial numbers, component conditions (New, Used, Damaged) and matches them to active assets to restrict unauthorized swaps.",
      descAr: "تسجل الأرقام التسلسلية للقطع وحالتها الفنية وتربطها بالأصول لمنع خروج أو دخول قطع غيار دون فحص ورقابة.",
      badge: "Inventory"
    },
    {
      titleEn: "Maintenance Records",
      titleAr: "سجلات وتكلفة الصيانة",
      icon: "🔧",
      descEn: "Logs technician names, repair costs, types of work performed (Preventative, Corrective), and diagnostic summaries.",
      descAr: "توثق أسماء الفنيين، تكاليف الإصلاحات، نوع العمل المنجز (وقائي أو تصحيحي)، مع ملخصات التشخيص والصيانة.",
      badge: "Core Data"
    }
  ];

  // EAM Glossary Terms
  const glossaryTerms = [
    {
      termEn: "Enterprise Asset Management (EAM)",
      termAr: "إدارة أصول المؤسسات (EAM)",
      descEn: "The lifecycle management of physical assets to maximize their performance, extend active life, and optimize operations.",
      descAr: "إدارة دورة حياة الأصول المادية بالكامل لتحسين أدائها العام، إطالة عمرها التشغيلي، وتقليل تكلفة امتلاكها وتدقيقها."
    },
    {
      termEn: "Predictive Maintenance (PdM)",
      termAr: "الصيانة التنبؤية (PdM)",
      descEn: "A technique that uses AI models and sensors to predict when equipment might fail so maintenance can be scheduled proactively.",
      descAr: "أسلوب يعتمد على حساسات ومؤشرات الذكاء الاصطناعي للتنبؤ بموعد الأعطال المحتملة لجدولة الصيانة قبل توقف الآلة."
    },
    {
      termEn: "Weibull Distribution",
      termAr: "توزيع ويبول الرياضي",
      descEn: "A mathematical probability model widely used in reliability engineering to model failure rates and degradation speed over time.",
      descAr: "نموذج رياضي شهير في هندسة الموثوقية يُستخدم لتمثيل معدلات الأعطال وتآكل المعادن والقطع بمرور الوقت."
    },
    {
      termEn: "Mean Time Between Failures (MTBF)",
      termAr: "متوسط الوقت بين الأعطال (MTBF)",
      descEn: "The predicted elapsed time between inherent failures of a mechanical system during normal system operation.",
      descAr: "متوسط المدة الزمنية المتوقعة لتشغيل الآلة بين عطل ميكانيكي وآخر أثناء ظروف العمل الطبيعية."
    },
    {
      termEn: "Part Swap (Unauthorized Replacement)",
      termAr: "تبديل القطع (الاستبدال غير المصرح به)",
      descEn: "A serious corruption scenario where genuine high-value new components are replaced with old or fake ones, causing failure.",
      descAr: "مخالفة جسيمة تتمثل في سرقة قطع الغيار الأصلية الجديدة للمعدات واستبدالها بأخرى تالفة أو مقلدة دون تسجيل رسمي."
    },
    {
      termEn: "Conflict of Interest (COI)",
      termAr: "تضارب المصالح (COI)",
      descEn: "A situation where an employee has a private interest that could influence the objective performance of their official duties.",
      descAr: "موقف يتعارض فيه الاهتمام الشخصي للموظف مع حياديته المهنية، مثل إسناد عقود صيانة لشركات تابعة لأقارب المهندس."
    },
    {
      termEn: "Preventive Maintenance (PM)",
      termAr: "الصيانة الوقائية (PM)",
      descEn: "Regularly performed maintenance on an asset to lessen the likelihood of it failing, executed on a time or usage-based schedule.",
      descAr: "أعمال صيانة دورية مبرمجة تتم بانتظام بناءً على فترات زمنية أو ساعات تشغيل محددة لتقليل احتمالية حدوث أعطال مفاجئة."
    },
    {
      termEn: "Corrective Maintenance",
      termAr: "الصيانة التصحيحية (الاضطرارية)",
      descEn: "Maintenance tasks performed after a system failure to restore the asset back into proper operating condition. Often highly expensive.",
      descAr: "أعمال الصيانة التي تتم كإجراء علاجى طارئ بعد وقوع العطل فعلياً لإعادة الأصل للخدمة. تكاليفها تكون مرتفعة ومربكة للإنتاج."
    }
  ];

  const filteredGlossary = glossaryTerms.filter(item => {
    const query = searchTerm.toLowerCase();
    return (
      item.termEn.toLowerCase().includes(query) ||
      item.termAr.toLowerCase().includes(query) ||
      item.descEn.toLowerCase().includes(query) ||
      item.descAr.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8">
      {/* 1. HERO HEADER */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden shadow-2xl border border-indigo-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[11px] font-bold uppercase tracking-wider border border-indigo-500/30">
            <span>✨</span>
            <span>{isRtl ? 'بوابة المعرفة والتدريب' : 'Knowledge & Training Portal'}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {gt.title}
          </h1>
          <p className="text-slate-300 font-medium text-base md:text-lg max-w-3xl leading-relaxed">
            {gt.subtitle}
          </p>

          {/* Badges and state */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10 mt-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg transition-colors ${
                isCertified ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'
              }`}>
                {isCertified ? '🎓' : '⚡'}
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{gt.certifiedTitle}</p>
                <p className="text-sm font-bold">{isCertified ? gt.badgeEarned : gt.badgePending}</p>
              </div>
            </div>
            
            <div className="flex-1 min-w-[200px] max-w-xs">
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                <span>{gt.progress}</span>
                <span>{completedSteps.length} {gt.of} 5</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(completedSteps.length / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            {completedSteps.length > 0 && (
              <button 
                onClick={resetAllSimulators}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all ml-auto active:scale-95"
              >
                {isRtl ? 'إعادة تعيين التدريب' : 'Reset Training'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-white border border-slate-200/60 rounded-2xl shadow-sm no-scrollbar scroll-touch">
        <button
          onClick={() => setActiveTab('path')}
          className={`flex-shrink-0 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'path'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          🚶‍♂️ {gt.tabPath}
        </button>
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex-shrink-0 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'modules'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          🧩 {gt.tabModules}
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex-shrink-0 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'sandbox'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          🧪 {gt.tabSandbox}
        </button>
        <button
          onClick={() => setActiveTab('glossary')}
          className={`flex-shrink-0 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'glossary'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          📖 {gt.tabGlossary}
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      
      {/* 3A. GETTING STARTED PATH */}
      {activeTab === 'path' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {isRtl ? 'المسار التفاعلي للمبتدئين' : 'Interactive Path for Beginners'}
            </h3>
            <p className="text-slate-500 font-medium text-sm mb-6">
              {isRtl 
                ? 'اتبع الخطوات الخمس أدناه لتشغيل السيناريوهات واكتساب المهارات العملية للتعامل مع المنصة.' 
                : 'Follow the five steps below to trigger live simulation scenarios and master TitanEAM operations.'}
            </p>

            <div className="space-y-6">
              {gt.steps.map((step, idx) => {
                const isCompleted = completedSteps.includes(step.id);
                return (
                  <div 
                    key={step.id} 
                    className={`p-6 rounded-2xl border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-slate-50/70 border-slate-200' 
                        : 'bg-white border-slate-150 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {isCompleted ? '✓' : step.id}
                          </span>
                          <h4 className={`text-base font-bold ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed pl-11 rtl:pl-0 rtl:pr-11">
                          {step.desc}
                        </p>
                        <div className="pl-11 rtl:pl-0 rtl:pr-11 text-xs text-slate-400 bg-slate-50/50 p-3 rounded-lg border border-slate-100 mt-2 font-medium">
                          {step.details}
                        </div>
                      </div>

                      <div className="pl-11 lg:pl-0 rtl:pl-0 rtl:pr-11 lg:rtl:pr-0 w-full lg:w-auto flex flex-col items-stretch lg:items-end gap-2 flex-shrink-0">
                        {isCompleted ? (
                          <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold uppercase tracking-widest">
                            ⚡ {gt.done}
                          </span>
                        ) : (
                          <button
                            onClick={() => runStepAction(step.id)}
                            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95"
                          >
                            🚀 {step.actionLabel}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Step Specific Interactive Playground Previews */}
                    {!isCompleted && step.id === 2 && scanState === 'scanning' && (
                      <div className="mt-4 ml-11 rtl:ml-0 rtl:mr-11 bg-slate-950 rounded-xl p-4 text-emerald-400 font-mono text-xs relative overflow-hidden border border-emerald-900/30">
                        <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 animate-scan"></div>
                        <p className="animate-pulse">&gt; [CAMERA] SCANNING FOR BARCODE OR QR CODE CARRIER...</p>
                      </div>
                    )}

                    {isCompleted && step.id === 2 && scannedPart && (
                      <div className="mt-4 ml-11 rtl:ml-0 rtl:mr-11 bg-white p-4 rounded-xl border border-slate-200 shadow-inner grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <p className="text-slate-400 font-bold uppercase tracking-wider">{isRtl ? 'اسم القطعة' : 'Part Name'}</p>
                          <p className="font-semibold text-slate-900 mt-0.5">{scannedPart.name}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold uppercase tracking-wider">{isRtl ? 'الرقم التسلسلي' : 'Serial'}</p>
                          <p className="font-mono font-bold text-slate-700 mt-0.5">{scannedPart.serial}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold uppercase tracking-wider">{isRtl ? 'حالة القطعة' : 'Condition'}</p>
                          <p className="mt-0.5"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">{scannedPart.condition}</span></p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold uppercase tracking-wider">{isRtl ? 'الأصل المرتبط' : 'Assigned Asset'}</p>
                          <p className="font-semibold text-slate-900 mt-0.5">{scannedPart.mapping}</p>
                        </div>
                      </div>
                    )}

                    {step.id === 3 && wearProgress > 0 && (
                      <div className="mt-4 ml-11 rtl:ml-0 rtl:mr-11 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>{isRtl ? 'حساب معامل التآكل وقوى التحلل...' : 'Calculating degradation wear curves...'}</span>
                          <span>{wearProgress}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${wearProgress}%` }}></div>
                        </div>
                      </div>
                    )}

                    {isCompleted && step.id === 4 && integrityReport && (
                      <div className="mt-4 ml-11 rtl:ml-0 rtl:mr-11 bg-red-50 p-4 rounded-xl border border-red-100 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-red-800">
                          <span className="px-2 py-0.5 bg-red-100 rounded text-[10px]">{isRtl ? 'مخاطر عالية' : 'HIGH RISK'}</span>
                          <span>{isRtl ? 'تضارب مصالح تم اكتشافه!' : 'Conflict of Interest Flagged!'}</span>
                        </div>
                        <p className="text-xs text-red-700">{isRtl ? integrityReport.flaggedLinkAr : integrityReport.flaggedLink}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{isRtl ? integrityReport.actionTakenAr : integrityReport.actionTaken}</p>
                      </div>
                    )}

                    {isCompleted && step.id === 5 && aiIdea && (
                      <div className="mt-4 ml-11 rtl:ml-0 rtl:mr-11 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3">
                        <div className="text-xl">💡</div>
                        <p className="text-xs text-indigo-950 font-medium leading-relaxed">{aiIdea}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3B. MODULES EXPLORER */}
      {activeTab === 'modules' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulesList.map((m, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-lg hover:border-slate-200 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-100">
                      {m.icon}
                    </div>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-blue-100">
                      {m.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">
                    {isRtl ? m.titleAr : m.titleEn}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {isRtl ? m.descAr : m.descEn}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                  <span>TitanEAM Guide</span>
                  <span className="text-blue-600">{isRtl ? 'جاهز للاستخدام' : 'Active Module'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3C. INTERACTIVE SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {gt.sandboxConsole}
              </h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                {gt.sandboxDesc}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  addLog(
                    'danger',
                    '[ALARM] Unauthorized Swap Detected: New Catalyst Converter on FIXED-1005 was replaced with worn component SN-CAT-2283.',
                    '[إنذار] كشف تبديل غير مصرح به: تم استبدال محول الحفاز الجديد في FIXED-1005 بقطعة مستهلكة SN-CAT-2283.'
                  );
                  addLog('warning', 'Updating integrity metric of Site Zone B-03 by -15 points.', 'تخفيض مؤشر النزاهة للمنطقة Zone B-03 بمعدل -15 نقطة.');
                }}
                className="w-full text-left rtl:text-right px-5 py-3.5 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-250 text-red-800 rounded-2xl text-xs font-bold transition-all flex items-center justify-between"
              >
                <span>🚨 {gt.triggerBtn1}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-red-200/50 rounded">Simulate Alert</span>
              </button>

              <button
                onClick={() => {
                  addLog('info', 'Running Monte Carlo simulations for 12 months forecast...', 'بدء تشغيل محاكاة مونت كارلو للتنبؤ السنوي...');
                  setTimeout(() => {
                    addLog('success', 'Simulation resolved. Fleet Health Index: 92.4% with Preventive PM Strategy. Expected failure: 2.1 events.', 'تمت المحاكاة. مؤشر صحة الأسطول: 92.4% مع استراتيجية الوقاية. الأعطال المتوقعة: 2.1 حدث.');
                  }, 800);
                }}
                className="w-full text-left rtl:text-right px-5 py-3.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-250 text-blue-800 rounded-2xl text-xs font-bold transition-all flex items-center justify-between"
              >
                <span>📈 {gt.triggerBtn2}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-200/50 rounded">Simulate Forecast</span>
              </button>

              <button
                onClick={() => {
                  addLog('info', 'Hardware Request: Scanning camera focal registry...', 'طلب أجهزة: مسح بؤري لعدسة الكاميرا البديلة...');
                  setTimeout(() => {
                    addLog('success', 'Found Barcode: EAN-13 5012345678900. Component identified: Hydraulic Filter Seal, Condition: NEW.', 'تم رصد باركود: EAN-13 5012345678900. القطعة: حلقة فلتر هيدروليكي، الحالة: جديدة.');
                  }, 600);
                }}
                className="w-full text-left rtl:text-right px-5 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-350 text-slate-800 rounded-2xl text-xs font-bold transition-all flex items-center justify-between"
              >
                <span>📷 {gt.triggerBtn3}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-200 rounded">Simulate QR Scan</span>
              </button>

              <button
                onClick={() => {
                  addLog('warning', 'Procurement Audit: Analysing bidding hashes for HVAC Maintenance tender...', 'تدقيق المشتريات: تحليل قيم تشفير العروض لمناقصة صيانة التكييف...');
                  setTimeout(() => {
                    addLog('danger', '[AUDIT ALERT] 95% similarity in quotation documents metadata found between vendors Alpha and Beta.', '[تنبيه تدقيق] تم اكتشاف تطابق بنسبة 95% في البيانات الوصفية لوثائق العروض بين الموردين Alpha و Beta.');
                  }, 1200);
                }}
                className="w-full text-left rtl:text-right px-5 py-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-100 hover:border-amber-250 text-amber-800 rounded-2xl text-xs font-bold transition-all flex items-center justify-between"
              >
                <span>🔍 {gt.triggerBtn4}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-200/50 rounded">Simulate Audit</span>
              </button>
            </div>
          </div>

          {/* Terminal Logs Panel */}
          <div className="lg:col-span-6 bg-slate-900 text-slate-300 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col justify-between min-h-[400px] relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-red-500 rounded-full"></span>
                  <span className="w-3.5 h-3.5 bg-yellow-500 rounded-full"></span>
                  <span className="w-3.5 h-3.5 bg-green-500 rounded-full"></span>
                  <span className="text-xs font-bold font-mono text-slate-500 ml-2">{gt.terminalTitle}</span>
                </div>
                <button
                  onClick={() => setSandboxLogs([])}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  {gt.clearLogs}
                </button>
              </div>

              {/* Logs Feed */}
              <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[300px] no-scrollbar py-2 font-mono text-[11px] leading-relaxed">
                {sandboxLogs.length === 0 ? (
                  <div className="text-slate-600 text-center py-12 italic">
                    &lt; {isRtl ? 'سجل السجلات فارغ. اضغط على أزرار التفاعل لعرض التنبيهات.' : 'Logs feed empty. Click simulation triggers above.'} &gt;
                  </div>
                ) : (
                  sandboxLogs.map((log, index) => {
                    let typeColor = 'text-blue-400';
                    if (log.type === 'success') typeColor = 'text-emerald-400';
                    if (log.type === 'warning') typeColor = 'text-amber-400';
                    if (log.type === 'danger') typeColor = 'text-red-400';
                    if (log.type === 'ai') typeColor = 'text-purple-400';

                    return (
                      <div key={index} className="flex items-start gap-2 border-b border-slate-800/40 pb-2">
                        <span className="text-slate-600 flex-shrink-0">[{log.time}]</span>
                        <span className={`${typeColor} font-bold flex-shrink-0`}>[{log.type.toUpperCase()}]</span>
                        <span className="text-slate-200">
                          {isRtl ? log.messageAr : log.messageEn}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>SYSTEM STATUS: OK</span>
                <span>DB CONNECTIONS: 3</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D. GLOSSARY */}
      {activeTab === 'glossary' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {gt.glossaryTitle}
              </h3>
              <p className="text-slate-500 font-medium text-sm">
                {isRtl ? 'تعرف على المصطلحات الهندسية والإدارية والأمنية المستخدمة في النظام.' : 'Learn EAM parameters, security terms, and metric definitions.'}
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={gt.glossarySearch}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGlossary.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-slate-400 text-sm font-medium italic">
                {gt.noResults}
              </div>
            ) : (
              filteredGlossary.map((item, idx) => (
                <div key={idx} className="p-6 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-2xl transition-colors">
                  <h4 className="font-bold text-slate-900 text-base mb-1">
                    {isRtl ? item.termAr : item.termEn}
                  </h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                    {isRtl ? item.termEn : item.termAr}
                  </p>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {isRtl ? item.descAr : item.descEn}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
