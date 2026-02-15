
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
}

const SidebarLink: React.FC<{ to: string; label: string; icon: React.ReactNode }> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/' && location.pathname === '');

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
        }`}
    >
      <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
        {icon}
      </span>
      <span className="font-semibold text-sm">{label}</span>
    </Link>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, lang, setLang }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Close mobile menu when navigating
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-[260px] bg-[#0f172a] flex flex-col fixed inset-y-0 z-50 transition-transform duration-300 ease-out shadow-2xl md:shadow-none
        ${isRtl ? 'border-l border-slate-800 right-0' : 'border-r border-slate-800 left-0'}
        ${isMobileMenuOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')}
        md:translate-x-0
      `}>
        <div className="p-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-xl shadow-blue-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none uppercase">Titan</h1>
              <p className="text-[10px] font-bold text-blue-500 tracking-widest mt-1 uppercase">Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 py-2 overflow-y-auto">
          <SidebarLink to="/" label={t.dashboard} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /></svg>} />
          <SidebarLink to="/fleet-board" label={t.fleetBoard} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
          <SidebarLink to="/assets" label={t.registry} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" /></svg>} />

          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isRtl ? 'التخطيط والتحليل' : 'Planning & Analysis'}</p>
          </div>
          <SidebarLink to="/insights" label={t.insights} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
          <SidebarLink to="/fleet-roadmap" label={t.roadmap} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          <SidebarLink to="/titan-simulator" label={isRtl ? 'محاكي تايتان' : 'Titan Simulator'} icon={<svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <SidebarLink to="/brainstorm" label={isRtl ? 'العصف الذهني' : 'AI Brainstorm'} icon={<svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>} />

          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isRtl ? 'الرقابة والنزاهة' : 'Control & Integrity'}</p>
          </div>
          <SidebarLink to="/integrity-forecast" label={t.integrityAnalytics} icon={<svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
          <SidebarLink to="/audit-log" label={t.auditLog} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <SidebarLink to="/corruption-control" label={t.corruptionControl} icon={<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
          <SidebarLink to="/parts" label={t.parts} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="w-full py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-[11px] font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all uppercase tracking-widest"
          >
            {lang === 'en' ? 'العربية' : 'Switch to English'}
          </button>
          <div className="flex items-center space-x-3 rtl:space-x-reverse bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">JD</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate leading-tight">John Doe</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">System Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        flex-1 p-4 md:p-10 transition-all duration-300
        ${isRtl ? 'md:mr-[260px]' : 'md:ml-[260px]'}
        pb-32 md:pb-10 min-h-screen
      `}>
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-200/50 pb-safe z-50 md:hidden">
        <div className="flex justify-between items-end px-2 h-[4.5rem] relative">

          <Link
            to="/"
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 pb-2 transition-all duration-300 group ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`relative transition-all duration-300 ${location.pathname === '/' ? '-translate-y-1' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={location.pathname === '/' ? 2.5 : 2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              {location.pathname === '/' && <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>}
            </div>
            <span className={`text-[10px] font-medium tracking-wide transition-all ${location.pathname === '/' ? 'font-bold opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{t.dashboard}</span>
          </Link>

          <Link
            to="/fleet-board"
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 pb-2 transition-all duration-300 group ${location.pathname === '/fleet-board' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`relative transition-all duration-300 ${location.pathname === '/fleet-board' ? '-translate-y-1' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={location.pathname === '/fleet-board' ? 2.5 : 2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              {location.pathname === '/fleet-board' && <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>}
            </div>
            <span className={`text-[10px] font-medium tracking-wide transition-all ${location.pathname === '/fleet-board' ? 'font-bold opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{t.fleetBoard}</span>
          </Link>

          {/* Central Scan/Action Button - Proportional Floating FAB */}
          <div className="flex-1 flex justify-center relative -top-6">
            <Link to="/assets" className="group relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform active:scale-95 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full"></div>
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <svg className="w-7 h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </Link>
          </div>

          <Link
            to="/insights"
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 pb-2 transition-all duration-300 group ${location.pathname === '/insights' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`relative transition-all duration-300 ${location.pathname === '/insights' ? '-translate-y-1' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={location.pathname === '/insights' ? 2.5 : 2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {location.pathname === '/insights' && <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>}
            </div>
            <span className={`text-[10px] font-medium tracking-wide transition-all ${location.pathname === '/insights' ? 'font-bold opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{t.insights}</span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 pb-2 transition-all duration-300 group ${isMobileMenuOpen ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`relative transition-all duration-300 ${isMobileMenuOpen ? '-translate-y-1' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isMobileMenuOpen ? 2.5 : 2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              {isMobileMenuOpen && <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>}
            </div>
            <span className={`text-[10px] font-medium tracking-wide transition-all ${isMobileMenuOpen ? 'font-bold opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{isRtl ? 'المزيد' : 'More'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
