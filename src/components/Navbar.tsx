import React from 'react';
import { AlertTriangle, Menu, UserCircle } from 'lucide-react';
import { Kullanici } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  urgentCount: number;
  onOpenNewIssue: () => void;
  currentTabName: string;
  currentUser: Kullanici;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  urgentCount,
  onOpenNewIssue,
  currentTabName,
  currentUser,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-slate-900 text-sm md:text-base">{currentTabName}</h2>
          <span className="text-[11px] text-slate-400 hidden sm:inline-block">
            İl Ambulans Servisi Başhekimliği & Operasyon Takip
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {urgentCount > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>{urgentCount} Kritik Bildirim / Süresi Dolan Kayıt</span>
          </div>
        )}

        <button
          onClick={onOpenNewIssue}
          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hızlı Arıza Bildir</span>
          <span className="sm:hidden">Arıza</span>
        </button>

        <div className="hidden md:flex items-center gap-2 pl-4 ml-2 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{currentUser.adSoyad}</p>
            <p className="text-[10px] text-slate-500 font-medium">{currentUser.rol}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <UserCircle className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};
