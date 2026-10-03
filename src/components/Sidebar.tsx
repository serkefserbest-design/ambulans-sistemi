import React from 'react';
import {
  LayoutDashboard,
  Truck,
  Activity,
  ClipboardCheck,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  HeartPulse, Radio,
  Users,
  LogOut,
  MapPin,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onResetData: () => void;
  urgentCount: number;
  isAdmin: boolean;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onResetData,
  urgentCount,
  isAdmin,
  onLogout
}) => {
  // Normal personelin GÖREBİLECEĞİ (Sınırlandırılmış) menüler
  let menuItems = [
    {
      id: 'telsiz',
      label: 'Telsiz Kontrolü',
      sublabel: 'Günlük Yoklama',
      icon: Radio,
      badge: null as number | null,
    },
    {
      id: 'issues',
      label: 'Arıza & Bakım Panosu',
      sublabel: 'Arıza Bildir',
      icon: AlertTriangle,
      badge: null as number | null, // Normal personel için badge gizli veya sadece kendi arızaları olabilir, null bırakalım
    },
  ];

  // Yöneticiye özel (Admin) TÜM menüler
  if (isAdmin) {
    menuItems = [
      {
        id: 'dashboard',
        label: 'Genel Durum',
        sublabel: 'Filo & Acil Özet',
        icon: LayoutDashboard,
        badge: null as number | null,
      },
      {
        id: 'stations',
        label: 'İstasyon Durumları',
        sublabel: 'Araç Dağılım Haritası',
        icon: MapPin,
        badge: null as number | null,
      },
      {
        id: 'vehicles',
        label: 'Ambulans Filosu',
        sublabel: 'Ruhsat, KM & Sigorta',
        icon: Truck,
        badge: null as number | null,
      },
      {
        id: 'telsiz',
        label: 'Telsiz Kontrolü',
        sublabel: 'Günlük Yoklama & Takip',
        icon: Radio,
        badge: null as number | null,
      },
      {
        id: 'equipment',
        label: 'Medikal Ekipman',
        sublabel: 'Kalibrasyon & SKT',
        icon: Activity,
        badge: null as number | null,
      },
      {
        id: 'issues',
        label: 'Arıza & Bakım Panosu',
        sublabel: 'Canlı Hata Takibi',
        icon: AlertTriangle,
        badge: urgentCount > 0 ? urgentCount : null,
      },
      {
        id: 'users',
        label: 'Kullanıcı Yönetimi',
        sublabel: 'Personel & Roller',
        icon: Users,
        badge: null as number | null,
      },
      {
        id: 'logs',
        label: 'Sistem Kayıtları',
        sublabel: 'İşlem Geçmişi (Log)',
        icon: ShieldCheck,
        badge: null as number | null,
      }
    ];
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 border-r border-slate-800">
      <div>
        {/* Logo / Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/40">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-black text-sm tracking-tight text-white flex items-center gap-1">
                ŞIRNAK 112
                <span className="text-[10px] px-1 py-0.2 bg-red-500/20 text-red-300 rounded font-semibold">
                  TR
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Ambulans & Medikal Takip</p>
            </div>
          </div>
        </div>

        {/* Menü Öğeleri */}
        <nav className="p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-900/20'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.sublabel}</div>
                  </div>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      


      {/* Alt Bilgi & Veri Sıfırlama */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <button
          onClick={() => onSelectTab('guide')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            currentTab === 'guide'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${currentTab === 'guide' ? 'bg-white/20' : 'bg-slate-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          Yardım & Kılavuz
        </button>
        <button
          onClick={onLogout}
          className="w-full py-2.5 px-3 text-sm font-semibold text-white bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>

        {isAdmin && (
        <button
          onClick={() => {
            if (confirm('Tüm veriler varsayılan örneklere sıfırlansın mı? (Kullanıcılar etkilenmez)')) {
              onResetData();
            }
          }}
          className="w-full py-2 px-3 text-[11px] font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Sistemi Sıfırla
        </button>
        )}
      </div>
    </aside>
  );
};
