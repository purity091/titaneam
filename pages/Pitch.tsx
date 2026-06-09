import React, { useState } from 'react';
import { translations } from '../translations';

interface PitchProps {
  lang: 'en' | 'ar';
}

export const Pitch: React.FC<PitchProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const t = translations[lang];

  // Active sub-tab state
  const [activeSubTab, setActiveSubTab] = useState<'calculator' | 'matrix' | 'competitors' | 'directory'>('directory');

  // ROI Calculator State
  const [fleetSize, setFleetSize] = useState<number>(60);
  const [repairCost, setRepairCost] = useState<number>(10000);
  const [downtimeHours, setDowntimeHours] = useState<number>(90);

  // Demo Form State
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName && email && contactName) {
      setFormSubmitted(true);
    }
  };

  // ROI Mathematical Calculations
  const traditionalFailures = fleetSize * 0.25;
  const traditionalRepairTotal = traditionalFailures * repairCost;
  const traditionalDowntimeTotal = fleetSize * downtimeHours * 125;
  const traditionalProcurementLeakage = fleetSize * 950;
  const traditionalTotalCost = traditionalRepairTotal + traditionalDowntimeTotal + traditionalProcurementLeakage;

  const titanFailures = fleetSize * 0.04; // 84% reduction
  const titanRepairTotal = titanFailures * repairCost;
  const titanDowntimeTotal = fleetSize * (downtimeHours * 0.25) * 125;
  const titanProcurementLeakage = 0;
  const titanSoftwareCost = fleetSize * 180;
  const titanTotalCost = titanRepairTotal + titanDowntimeTotal + titanProcurementLeakage + titanSoftwareCost;

  const totalSavings = Math.max(0, traditionalTotalCost - titanTotalCost);
  const savingsPercent = traditionalTotalCost > 0 ? (totalSavings / traditionalTotalCost) * 100 : 0;

  // Local Translations dictionary (Massive & Exhaustive)
  const localTranslations = {
    en: {
      title: "TitanEAM Enterprise Portfolio",
      subtitle: "Discover why TitanEAM is the preferred solution for next-generation asset management, anti-corruption governance, and AI-driven predictive lifecycle planning.",
      tabDirectory: "Platform Map & Capabilities",
      tabCompetitors: "Market Competitors Analysis",
      tabCalculator: "ROI Savings Calculator",
      tabMatrix: "Core Difference Matrix",
      compareTitle: "TitanEAM vs Market Competitors",
      compareSubtitle: "Deep-dive analysis of how TitanEAM compares to heavy legacy systems like IBM Maximo and SAP Asset Manager.",
      dirTitle: "Complete Platform Map & Capabilities",
      dirSubtitle: "Detailed explanation of every module, tab, and underlying technology in the TitanEAM ecosystem.",
      opPurpose: "Operational Purpose",
      underTech: "Underlying Technology",
      finBenefit: "Financial Benefit",
      competitorTable: {
        feature: "Feature / Dimension",
        titan: "TitanEAM",
        maximo: "IBM Maximo",
        sap: "SAP Asset Manager",
        legacy: "Traditional ERPs / Excel",
        row1: {
          name: "Anti-Corruption & Part Swap Alerts",
          titan: "Built-in: Automatic serial number verification with QR/Barcode scans and fraud alerts.",
          maximo: "Requires heavy custom coding or 3rd-party integrations.",
          sap: "No native verification; requires specialized SAP GRC add-ons.",
          legacy: "Completely absent. High risk of material theft."
        },
        row2: {
          name: "Procurement Conflict Detection",
          titan: "Built-in: Natural-language auditing cross-referencing bidder files and employees.",
          maximo: "Requires enterprise integration with IBM Cognos / external BI.",
          sap: "Requires SAP Ariba integrations with custom compliance rules.",
          legacy: "Manual audit only. Vulnerable to bid-rigging."
        },
        row3: {
          name: "Interactive Strategy Simulation",
          titan: "Built-in: Real-time 36-month Monte Carlo simulation dashboard (Titan Simulator™).",
          maximo: "Stateless reports. Requires IBM Maximo Asset Monitor + Watson.",
          sap: "Requires SAP Asset Performance Management (APM) licenses.",
          legacy: "Static spreadsheets with high margins of error."
        },
        row4: {
          name: "GenAI Consultant Integration",
          titan: "Built-in: Direct Gemini-3-Flash console for custom sustainability & cost strategies.",
          maximo: "Requires Watsonx integration contracts (long deployment).",
          sap: "Requires SAP Joule AI copilot subscription and setups.",
          legacy: "Completely absent."
        },
        row5: {
          name: "Setup Time & Deployment Costs",
          titan: "Rapid: Built on modern React/Vite. Set up in weeks with minimal overhead.",
          maximo: "Slow: Requires 6-12 months implementation and certified IBM partners.",
          sap: "Very Slow: Multi-million dollar consulting budgets and months of configuration.",
          legacy: "Instant but low-value and unscalable."
        }
      },
      directoryItems: [
        {
          num: "1",
          name: "Dashboard (لوحة التحكم)",
          purpose: "Provides executives and managers with an aggregated, live operational health index, real-time alert notifications, and high-level financial KPIs.",
          tech: "React state management, real-time data streaming, Recharts visualization library, and custom priority alerts aggregation.",
          benefit: "Eliminates administrative delay. Enables decision-makers to identify fleet inefficiencies and active maintenance backlogs in seconds."
        },
        {
          num: "2",
          name: "Fleet Board (لوحة الأسطول)",
          purpose: "Maps and categorizes active machinery, fixed compressors, and facilities across multiple worksite zones (Zones A, B, C, D).",
          tech: "Geographical/Zone clustering algorithm, operational utilization tracking, and density metrics visualization.",
          benefit: "Prevents resource clustering. Saves logistics costs by ensuring optimal distribution of heavy machinery across active sites."
        },
        {
          num: "3",
          name: "Asset Registry (سجل الأصول)",
          purpose: "Acts as the immutable single source of truth for the entire asset inventory, storing model specifications, purchase histories, and usage limits.",
          tech: "Bilingual tabular indexing, progressive wear tracking based on accumulated hours versus maximum mechanical limits.",
          benefit: "Reduces asset loss. Simplifies external accounting audits and technical inspection compliance reporting."
        },
        {
          num: "4",
          name: "Asset Profile & Details (ملف الأصل التفصيلي)",
          purpose: "Enables granular technical audits of a single asset, documenting its physical location history, specifications, and full maintenance history.",
          tech: "Dynamic routing (`/assets/:id`), relational data-mapping connecting maintenance records, audit entries, and spare parts logs.",
          benefit: "Speeds up technicians diagnostics. Saves diagnostic time by providing the complete history of previous modifications."
        },
        {
          num: "5",
          name: "AI Insights (رؤى الذكاء الاصطناعي)",
          purpose: "Performs real-time risk assessment and projects exact dates for future preventive checkups before failures occur.",
          tech: "Machine learning regression algorithms, risk score computation based on asset age, utilization rate, and previous failure cycles.",
          benefit: "Reduces emergency corrective repair costs by up to 40% by scheduling interventions during scheduled off-peak times."
        },
        {
          num: "6",
          name: "Strategic Roadmap (خارطة الصيانة السنوية)",
          purpose: "A 12-month calendar dashboard forecasting monthly workloads, predicting labor needs, and projecting monthly operational expenses.",
          tech: "Temporal data projection, monthly workload summation algorithms, and interactive roadmap timelines.",
          benefit: "Optimizes working capital. Enables finance teams to prepare maintenance budgets monthly and prevent labor shortages."
        },
        {
          num: "7",
          name: "Titan Simulator™ (محاكي تايتان)",
          purpose: "A sandbox allowing management to simulate the long-term cost impact of Reactive, Preventive, or Predictive maintenance strategies over a 36-month horizon.",
          tech: "Monte Carlo failure simulation engine, Weibull distribution age-wear curves, and operational ROI calculator.",
          benefit: "Empowers financial modeling. Provides mathematical proof of ROI before implementing operational changes."
        },
        {
          num: "8",
          name: "AI Brainstorm (العصف الذهني)",
          purpose: "Direct natural-language consulting module that generates customized strategies for sustainability, cost reduction, and reliability.",
          tech: "Integration with Google Gemini-3-Flash APIs using advanced contextual prompts containing the actual fleet telemetry.",
          benefit: "Saves external consulting costs. Delivers immediate, tailored engineering and operational advice at zero cost."
        },
        {
          num: "9",
          name: "Integrity & Conflicts (النزاهة وتضارب المصالح)",
          purpose: "Audits procurement tenders and vendor assignments to identify potential bid rigging, duplicate routing numbers, and employee-vendor relations.",
          tech: "Natural Language Processing (NLP) metadata matching, fuzzy address matching, and anomaly correlation algorithms.",
          benefit: "Prevents vendor fraud. Blocks collusions that inflate contract pricing, saving millions in tender manipulations."
        },
        {
          num: "10",
          name: "Audit Logs (سجل التدقيق والرقابة)",
          purpose: "Maintains an immutable historical record of all operator actions, parameter adjustments, and system alerts for forensic compliance.",
          tech: "Cryptographically structured activity logging, write-only data binding, and comprehensive metadata tracking.",
          benefit: "Ensures compliance. Guarantees complete transparency for legal, corporate governance, and regulatory requirements."
        },
        {
          num: "11",
          name: "Corruption Control (مكافحة الفساد)",
          purpose: "Detects unauthorized component replacements ('Part Swap') and raises red flags when premium parts are replaced with cheap duplicates.",
          tech: "Real-time verification of parts serial numbers, comparison of catalog registrations with actual maintenance tickets.",
          benefit: "Protects equipment lifespan. Prevents the theft of expensive parts, which is a major source of early equipment failure."
        },
        {
          num: "12",
          name: "Spare Parts Management (قطع الغيار)",
          purpose: "Tracks inventory condition (New, Used, Damaged), logs serial numbers, and provides a mobile scan interface.",
          tech: "Mobile-optimized QR/Barcode scanner simulation, inventory state transition matrices, and serial tracking relation mapping.",
          benefit: "Optimizes spare parts stock. Prevents stockouts and ensures only verified, authorized parts are installed on critical assets."
        }
      ]
    },
    ar: {
      title: "لماذا منصة TitanEAM؟ الدليل المؤسسي الشامل",
      subtitle: "اكتشف الفوارق الجوهرية والتقنية بين منصة TitanEAM لحوكمة وإدارة الأصول وبين الأنظمة التقليدية القديمة والمنافسين في السوق.",
      tabDirectory: "خريطة المنصة والقدرات الكاملة",
      tabCompetitors: "تحليل ودراسة المنافسين في السوق",
      tabCalculator: "حاسبة وفورات التشغيل (ROI)",
      tabMatrix: "مصفوفة الفروقات الأساسية",
      compareTitle: "مقارنة TitanEAM مع الأنظمة المنافسة",
      compareSubtitle: "تحليل دقيق لكيفية تفوق TitanEAM على الأنظمة المؤسسية الثقيلة مثل IBM Maximo و SAP Asset Manager.",
      dirTitle: "الدليل الشامل لكافة صفحات وأقسام المنصة",
      dirSubtitle: "شرح تفصيلي حرفي لكل قسم، الغرض التشغيلي منه، التكنولوجيا المستخدمة فيه، والفائدة المالية المحققة.",
      opPurpose: "الغرض التشغيلي للقسم",
      underTech: "التقنية البرمجية المستخدمة",
      finBenefit: "العائد التشغيلي والمالي (ROI)",
      competitorTable: {
        feature: "ميزة المقارنة / المعيار الفني",
        titan: "منصة TitanEAM",
        maximo: "IBM Maximo",
        sap: "SAP Asset Manager",
        legacy: "الأنظمة التقليدية / جداول إكسل",
        row1: {
          name: "مكافحة الفساد وتبديل قطع الغيار",
          titan: "مدمج تلقائياً: تحقق فوري من الأرقام التسلسلية عبر مسح كود QR وإصدار تنبيهات السرقة فورياً.",
          maximo: "تتطلب تخصيصاً برمجياً معقداً (Custom Coding) أو أدوات وسيطة مكلفة.",
          sap: "لا تدعمها برمجياً بشكل مباشر؛ تتطلب حزم حوكمة خارجية مثل SAP GRC.",
          legacy: "غائبة تماماً. مخاطر سرقة القطع وتمرير قطع بالية مرتفعة جداً."
        },
        row2: {
          name: "كشف تضارب المصالح والمشتريات",
          titan: "مدمج تلقائياً: تدقيق الحسابات وتقاطع بيانات الموردين والموظفين بالذكاء الاصطناعي.",
          maximo: "تتطلب ربطاً خارجياً مع أنظمة IBM Cognos أو أدوات تحليل البيانات الخارجية.",
          sap: "تتطلب دمج واجهات SAP Ariba وتثبيت قواعد امتثال مخصصة وتدريب مكثف.",
          legacy: "تدقيق يدوي ضعيف وعشوائي، ومخاطر التلاعب في العطاءات مرتفعة."
        },
        row3: {
          name: "محاكاة الاستراتيجيات المالية الحية",
          titan: "مدمج تلقائياً: لوحة محاكاة مونت كارلو لـ 36 شهراً مستقبلياً بالأرقام ومعدلات التآكل (Titan Simulator™).",
          maximo: "تقارير إحصائية ساكنة. تتطلب شراء ترخيص إضافي لـ Maximo Asset Monitor.",
          sap: "تتطلب شراء ترخيص وحزم إضافية لـ SAP Asset Performance Management.",
          legacy: "جداول ساكنة تحتوي على هامش خطأ بشري جسيم وغير دقيقة."
        },
        row4: {
          name: "الاستشارة الذكية عبر الذكاء الاصطناعي التوليدي",
          titan: "مدمج تلقائياً: اتصال مباشر بنماذج Gemini-3-Flash لتقديم خطط فورية مخصصة للأسطول.",
          maximo: "تتطلب عقود دمج ضخمة لـ IBM Watsonx وتطوير نماذج ذكاء اصطناعي مخصصة.",
          sap: "تتطلب حزم اشتراك وربط إضافية مع مساعد الذكاء الاصطناعي SAP Joule.",
          legacy: "غير متوفرة على الإطلاق."
        },
        row5: {
          name: "سرعة التثبيت وتكاليف الترخيص",
          titan: "سريعة جداً: مبنية بمعماريات الويب الحديثة React/Vite. تدخل حيز التشغيل خلال أسابيع بتكلفة منخفضة.",
          maximo: "بطيئة: تتطلب من 6 إلى 12 شهراً للتطبيق وتوفير شركاء معتمدين من IBM بتكلفة باهظة.",
          sap: "بطيئة ومكلفة جداً: تتطلب ميزانيات استشارية ضخمة وشهوراً طويلة من التهيئة الفنية.",
          legacy: "فورية ولكنها عديمة القيمة التشغيلية ولا تضمن أي نمو للمؤسسة."
        }
      },
      directoryItems: [
        {
          num: "1",
          name: "لوحة التحكم الرئيسية (Dashboard)",
          purpose: "تجميع وعرض مؤشرات الأداء الحية للأصول، نسب التشغيل والتعطل الفورية، وقيم الصيانة المعلقة ذات الأولوية العالية لمساعدة القيادة في اتخاذ القرارات السريعة.",
          tech: "إدارة الحالة المتجاوبة (React State)، وتغذية البيانات اللحظية، ومكتبة Recharts المتقدمة للرسوم البيانية وتجميع التنبيهات الأمنية.",
          benefit: "القضاء على فترات الانتظار الإدارية. يتيح للمسؤولين رصد المعدات المعطلة وحجم الإنفاق الإجمالي في ثوانٍ معدودة."
        },
        {
          num: "2",
          name: "لوحة الأسطول ومواقع العمل (Fleet Board)",
          purpose: "توزيع ومراقبة المركبات الثقيلة، الضواغط الثابتة، ووحدات التكييف الموزعة عبر مناطق العمل المختلفة (Zones A, B, C, D) ومراقبة حالتها الفورية.",
          tech: "خوارزمية تصنيف الأصول الجغرافية، وتتبع معدلات التشغيل اللحظية، وتمثيل كثافة العمل في كل منطقة.",
          benefit: "منع تكدس المعدات في مواقع وتفريغ مواقع أخرى. يوفر تكاليف النقل والخدمات اللوجستية ويضمن أعلى كفاءة تشغيل للمعدات."
        },
        {
          num: "3",
          name: "سجل الأصول العام (Asset Registry)",
          purpose: "يمثل الأرشيف المركزي الموحد وغير القابل للتلاعب لكافة معدات المؤسسة، موضحاً به الطراز، وتاريخ الشراء، وساعات الاستهلاك الفعلي.",
          tech: "جدولة بيانات ثنائية اللغة، ومؤشر حساب الاستهلاك التراكمي لساعات العمل (Usage Progress) مقارنة بحدود الخدمة القصوى للمعدة.",
          benefit: "الحد من فقدان أو تهميش الأصول. يسهل عمليات الجرد المالي الخارجي وتدقيق الهيئات التنظيمية والحكومية."
        },
        {
          num: "4",
          name: "ملف الأصل التفصيلي (Asset Profile)",
          purpose: "إتاحة فحص دقيق وعميق لكل معدة بشكل منفصل، يوضح تاريخ صيانتها بالكامل، القطع المستبدلة فيها، ومواقع حركتها السابقة.",
          tech: "توجيه الصفحات الديناميكي (`/assets/:id`)، وبنية علاقات قواعد البيانات لربط سجلات الصيانة والأعطال بالقطع المسجلة والأرقام التسلسلية.",
          benefit: "تسريع تشخيص الأعطال للفنيين بنسبة 50%. يمنع تكرار الأخطاء التشخيصية بمعرفة التاريخ الكامل للمعدة قبل بدء العمل الفعلي."
        },
        {
          num: "5",
          name: "رؤى وتوقعات الذكاء الاصطناعي (AI Insights)",
          purpose: "تقدير خطورة الأصول، والتنبؤ الدقيق بالتواريخ المستقبلية التي ستحتاج فيها المعدة إلى صيانة وقائية قبل حدوث العطل المفاجئ.",
          tech: "خوارزميات الانحدار الرياضي والذكاء الاصطناعي لحساب درجة الخطورة (Risk Score) بناءً على العمر الميكانيكي، والبيئة، ومعدل الأعطال التاريخي.",
          benefit: "تقليل تكاليف الصيانة الاضطرارية الباهظة بنسبة تصل إلى 40% من خلال جدولة الإصلاح الوقائي البسيط في أوقات التوقف المجدولة."
        },
        {
          num: "6",
          name: "خارطة الطريق السنوية للصيانة (Strategic Roadmap)",
          purpose: "جدولة زمنية شاملة لـ 12 شهراً تتنبأ بضغط العمل الشهري، وتكاليف التشغيل وقوة العمل الفنية المطلوبة للشركة لتفادي الأزمات المالية المفاجئة.",
          tech: "محرك تنبؤ زمني لتراكم تكاليف الصيانة، وخوارزميات توزيع الأحمال الفنية على مدار السنة.",
          benefit: "تنظيم التدفق المالي للشركة. تمكن القطاع المالي من تجهيز سيولة الصيانة شهرياً دون مفاجآت وبشكل متوازن."
        },
        {
          num: "7",
          name: "محاكي تايتان الاستراتيجي (Titan Simulator™)",
          purpose: "منصة تجريبية تتيح للإدارة محاكاة كفاءة المنشأة لـ 36 شهراً مستقبلياً افتراضياً تحت استراتيجيات الصيانة المختلفة (التفاعلية، الوقائية، التنبؤية).",
          tech: "محرك محاكاة عشوائي (Monte Carlo)، ونماذج Weibull الرياضية لتقدير احتمالات الفشل الميكانيكي وتراكم تكاليف الإنتاج الضائع.",
          benefit: "إثبات العائد المالي للمساهمين بالأرقام الحقيقية ومحاكاة المخاطر قبل إنفاق دولار واحد على أرض الواقع."
        },
        {
          num: "8",
          name: "العصف الذهني بالذكاء الاصطناعي (AI Brainstorm)",
          purpose: "ورشة عمل استشارية تفاعلية مدعومة بالذكاء الاصطناعي لتوليد خطط خفض النفقات ومبادرات الصيانة الصديقة للبيئة بناءً على بيانات أصول الشركة الفعالة.",
          tech: "واجهات برمجية متصلة بنماذج Gemini-3-Flash مع توجيه ذكي مخصص ومحمي البيانات.",
          benefit: "الاستغناء عن الاستشارات الخارجية الباهظة للشركات. الحصول على حلول فنية واستراتيجية دقيقة ومكيفة مع طبيعة عمل المعدات فوراً."
        },
        {
          num: "9",
          name: "النزاهة وتضارب المصالح (Integrity & Conflicts)",
          purpose: "تدقيق المعاملات والمشتريات وإرساء العطاءات لكشف شبهات التواطؤ، تشابه الحسابات البنكية أو روابط القرابة والاتصالات المشبوهة.",
          tech: "خوارزميات معالجة اللغة الطبيعية لمقارنة مستندات العروض، ومطابقة النصوص الضبابية (Fuzzy Matching)، وتقاطع سجلات الموظفين والموردين.",
          benefit: "سد ثغرات الفساد المالي وحماية ميزانية المشتريات من الهدر الناتج عن تضخيم أسعار العقود والاتفاقات الجانبية."
        },
        {
          num: "10",
          name: "سجل التدقيق والرقابة (Audit Logs)",
          purpose: "الاحتفاظ بسجل تاريخي غير قابل للتعديل يوثق كافة تصرفات المستخدمين، لتوفير الشفافية والحوكمة القانونية أمام الإدارة والجهات التنظيمية.",
          tech: "دفتر حركات متسلسل مشفر برمجياً (Immutable Ledger)، يمنع الحذف أو التعديل، مع تسجيل تفاصيل دقيقة تشمل الهوية والزمن والموقع.",
          benefit: "توفير الحماية القانونية التامة والامتثال لمعايير الجودة والحوكمة المؤسسية وتسهيل الفحص والتدقيق القانوني والمالي."
        },
        {
          num: "11",
          name: "مكافحة الفساد وتتبع السرقة (Corruption Control)",
          purpose: "رصد عمليات التبديل غير المصرح بها لقطع الغيار الأصلية الفاخرة (Part Swap) واستبدالها بأخرى مقلدة أو تالفة دون تسجيل رسمي في أوامر الصيانة.",
          tech: "نظام تدقيق فوري يقارن سجل فك وتركيب المعدات مع الباركود المسجل في الحركات، وإصدار إنذار عالي الأولوية بمجرد حدوث اختلاف.",
          benefit: "إطالة العمر الافتراضي للمعدات ومنع الخسائر المليونية الناتجة عن تعطل المكائن بسبب قطع الغيار المقلدة أو التالفة التي يتم تمريرها."
        },
        {
          num: "12",
          name: "إدارة وتتبع قطع الغيار (Spare Parts)",
          purpose: "تتبع حالة قطع الغيار وجردها (جديدة، مستعملة، تالفة)، وربطها بالرقم التسلسلي لمنع حدوث فجوات في المخزون أو سحب قطع دون إذن.",
          tech: "محاكاة قارئ QR والباركود، وجداول إدارة الحالات الانتقالية للمخزون، وتطابق الأرقام التسلسلية للأصول.",
          benefit: "التحكم الكامل بالمخزون وضمان عدم تركيب أي قطعة في الميدان دون التحقق من جودتها ورقمها التسلسلي المسجل."
        }
      ]
    }
  };

  const gpt = localTranslations[lang];
  const pt = localTranslations;

  return (
    <div className="space-y-12">
      {/* 1. HERO SECTION */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-[2.5rem] p-8 md:p-14 text-white overflow-hidden shadow-2xl border border-indigo-900/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
            <span>🛡️</span>
            <span>{isRtl ? 'بوابة المقارنة والحوكمة الشاملة' : 'Enterprise Evaluation Portal'}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {gpt.title}
          </h1>
          <p className="text-slate-300 font-medium text-base md:text-lg max-w-3xl leading-relaxed">
            {gpt.subtitle}
          </p>

          <div className="flex overflow-x-auto gap-2 pt-4 border-t border-white/10 mt-8 pb-1 no-scrollbar">
            {[
              { id: 'directory', label: gpt.tabDirectory, icon: '🧩' },
              { id: 'competitors', label: gpt.tabCompetitors, icon: '📊' },
              { id: 'calculator', label: gpt.tabCalculator, icon: '💰' },
              { id: 'matrix', label: gpt.tabMatrix, icon: '⚖' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 ${
                  activeSubTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC SUB-TABS CONTENT */}

      {/* 2A. DEEP-DIVE PLATFORM MAP & DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-lg">🧩</span>
              {gpt.dirTitle}
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">
              {gpt.dirSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gpt.directoryItems.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      Module {item.num}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-950 group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h3>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{gpt.opPurpose}</p>
                      <p className="text-slate-600 text-xs leading-relaxed font-medium">{item.purpose}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{gpt.underTech}</p>
                      <p className="text-slate-500 text-xs leading-relaxed font-mono font-medium">{item.tech}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider mb-1">{gpt.finBenefit}</p>
                  <p className="text-slate-700 text-xs font-semibold leading-relaxed">{item.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2B. MARKET COMPETITORS ANALYSIS - Mobile-first stacked cards */}
      {activeSubTab === 'competitors' && (
        <div className="bg-white p-5 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 animate-in fade-in duration-300">
          <div className="max-w-3xl">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-lg flex-shrink-0">📊</span>
              {gpt.compareTitle}
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">{gpt.compareSubtitle}</p>
          </div>

          {/* Column Legend - always visible */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-blue-600 text-white rounded-2xl px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider col-span-2 md:col-span-1">{gpt.competitorTable.titan} ✦</div>
            <div className="bg-slate-100 text-slate-600 rounded-2xl px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider">{gpt.competitorTable.maximo}</div>
            <div className="bg-slate-100 text-slate-600 rounded-2xl px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider">{gpt.competitorTable.sap}</div>
            <div className="bg-slate-50 text-slate-400 rounded-2xl px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider">{gpt.competitorTable.legacy}</div>
          </div>

          {/* Mobile stacked rows */}
          <div className="space-y-4">
            {[gpt.competitorTable.row1, gpt.competitorTable.row2, gpt.competitorTable.row3, gpt.competitorTable.row4, gpt.competitorTable.row5].map((row, idx) => (
              <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden">
                {/* Feature heading */}
                <div className="bg-slate-900 text-white px-4 py-3">
                  <span className="text-xs font-bold">{row.name}</span>
                </div>
                {/* 4 columns stacked on mobile, 2x2 on sm, 4-col on lg */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                  <div className="p-4 bg-blue-50/30">
                    <p className="text-[9px] font-bold uppercase text-blue-500 mb-1.5 tracking-widest">{gpt.competitorTable.titan}</p>
                    <p className="text-xs text-blue-900 font-semibold leading-relaxed">{row.titan}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] font-bold uppercase text-slate-400 mb-1.5 tracking-widest">{gpt.competitorTable.maximo}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{row.maximo}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] font-bold uppercase text-slate-400 mb-1.5 tracking-widest">{gpt.competitorTable.sap}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{row.sap}</p>
                  </div>
                  <div className="p-4 bg-slate-50/50">
                    <p className="text-[9px] font-bold uppercase text-slate-300 mb-1.5 tracking-widest">{gpt.competitorTable.legacy}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{row.legacy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2C. ROI CALCULATOR */}
      {activeSubTab === 'calculator' && (
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 animate-in fade-in duration-300">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-lg">💰</span>
              {pt[lang].calculatorTitle}
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">
              {pt[lang].calculatorSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-150">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>{pt[lang].sliderFleet}</span>
                  <span className="font-mono text-sm text-blue-600 bg-white px-3 py-1 rounded-lg border border-slate-200">{fleetSize}</span>
                </div>
                <input 
                  type="range" min="5" max="300" step="5" value={fleetSize}
                  onChange={(e) => setFleetSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>{pt[lang].sliderRepair}</span>
                  <span className="font-mono text-sm text-blue-600 bg-white px-3 py-1 rounded-lg border border-slate-200">${repairCost.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="500" max="30000" step="500" value={repairCost}
                  onChange={(e) => setRepairCost(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>{pt[lang].sliderDowntime}</span>
                  <span className="font-mono text-sm text-blue-600 bg-white px-3 py-1 rounded-lg border border-slate-200">{downtimeHours} Hrs</span>
                </div>
                <input 
                  type="range" min="10" max="250" step="5" value={downtimeHours}
                  onChange={(e) => setDowntimeHours(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 md:p-8 rounded-3xl flex flex-col justify-between border border-slate-800 shadow-xl">
              <div>
                <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] mb-1">{pt[lang].annualSavings}</p>
                <h3 className="text-4xl md:text-5xl font-black font-mono text-emerald-400 leading-none">
                  ${totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </h3>
                <p className="text-slate-400 text-xs font-semibold mt-2">
                  {isRtl ? 'نسبة توفير تقدر بـ' : 'Estimated savings of'} <span className="text-white font-mono font-bold">{savingsPercent.toFixed(1)}%</span>
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-medium text-slate-300">
                <div className="flex justify-between">
                  <span>{pt[lang].tradExpense}</span>
                  <span className="font-mono text-red-400 font-bold">${traditionalTotalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>{pt[lang].titanExpense}</span>
                  <span className="font-mono text-emerald-400 font-bold">${titanTotalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-[9px] text-slate-500 leading-relaxed font-semibold">
                ⚠️ {pt[lang].savingsNotice}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2D. CORE DIFFERENCE MATRIX - Mobile-first stacked cards using gpt.competitorTable rows */}
      {activeSubTab === 'matrix' && (
        <div className="bg-white p-5 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 animate-in fade-in duration-300">
          <div className="max-w-3xl">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-lg flex-shrink-0">⚖️</span>
              {gpt.compareTitle}
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">{gpt.compareSubtitle}</p>
          </div>

          <div className="space-y-4">
            {[gpt.competitorTable.row1, gpt.competitorTable.row2, gpt.competitorTable.row3, gpt.competitorTable.row4, gpt.competitorTable.row5].map((row, idx) => (
              <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden">
                <div className="bg-slate-800 text-white px-4 py-3">
                  <p className="text-xs font-bold">{row.name}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  <div className="p-4 bg-slate-50/40">
                    <p className="text-[9px] font-bold uppercase text-slate-400 mb-1.5 tracking-widest">
                      {isRtl ? 'الأنظمة التقليدية' : 'Traditional Systems'}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">{row.maximo}</p>
                  </div>
                  <div className="p-4 bg-blue-50/20">
                    <p className="text-[9px] font-bold uppercase text-blue-500 mb-1.5 tracking-widest">
                      {gpt.competitorTable.titan} ✦
                    </p>
                    <p className="text-xs text-blue-900 font-semibold leading-relaxed">{row.titan}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DEMO FORM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-6">
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {isRtl 
              ? 'هل أنت مستعد لتجربة الثورة القادمة في إدارة الأصول؟' 
              : 'Ready to witness the next revolution in EAM?'}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            {isRtl
              ? 'سواء كنت ترغب في تقليل الأعطال المفاجئة أو حماية أصولك من السرقة والتبديل غير المصرح به أو كشف تضارب مصالح المشتريات، فإن TitanEAM هو شريكك الأمثل للحوكمة الرقمية.'
              : 'Whether your priority is eliminating downtime, protecting parts from fraud, or automating procurement conflict auditing, TitanEAM is your ultimate digital partner.'}
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">✓</span>
              <span className="text-xs font-bold text-slate-700">{isRtl ? 'صيانة تنبؤية وتوقعات وقائية ذكية' : 'Smart predictive maintenance insights'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">✓</span>
              <span className="text-xs font-bold text-slate-700">{isRtl ? 'حوكمة مشفرة لمنع سرقة وتبديل قطع الغيار' : 'Anti-theft serial part swap protection'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">✓</span>
              <span className="text-xs font-bold text-slate-700">{isRtl ? 'محاكي مالي 36 شهراً واستشارة Gemini' : '36-month ROI simulator and Gemini integration'}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h4 className="text-xl font-bold text-slate-900">{pt[lang].demoTitle}</h4>
            <p className="text-slate-500 text-xs font-medium mt-1">{pt[lang].demoSubtitle}</p>
          </div>

          {formSubmitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl text-center space-y-4 animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/20">
                ✓
              </div>
              <h5 className="text-lg font-bold text-slate-900">{isRtl ? 'تم إرسال الطلب بنجاح' : 'Request Sent!'}</h5>
              <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">{pt[lang].successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">{pt[lang].labelCompany}</label>
                  <input 
                    type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Industries" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">{pt[lang].labelContact}</label>
                  <input 
                    type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. John Miller" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">{pt[lang].labelEmail}</label>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@company.com" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                📞 {pt[lang].submitBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
