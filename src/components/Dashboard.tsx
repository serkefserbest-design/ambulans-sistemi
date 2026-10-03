import React, { useState } from 'react';
import { Arac, MedikalEkipman, ArizaKaydi, GunlukVardiyaKontrol, Kullanici, TelsizKontrol } from '../types';
import { getDaysRemaining, formatTRDate } from '../utils/dateUtils';
import {
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Activity,
  Wrench,
  Siren,
  MapPin,
  Search,
  Filter
} from 'lucide-react';

interface DashboardProps {
  vehicles: Arac[];
  equipment: MedikalEkipman[];
  issues: ArizaKaydi[];
  dailyChecklists: GunlukVardiyaKontrol[];
  telsizKontrolleri: TelsizKontrol[];
  onNavigate: (tab: string) => void;
  onOpenNewIssue: () => void;
  onOpenNewChecklist: () => void;
  onOpenNewVehicle: () => void;
  onEditVehicle?: (v: Arac) => void;
  onEditIssue?: (issue: ArizaKaydi) => void;
  currentUser: Kullanici;
}

export const Dashboard: React.FC<DashboardProps> = ({
  telsizKontrolleri,
  dailyChecklists,
  vehicles,
  issues,
  onEditVehicle,
  onEditIssue
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Arama filtresi
  const filteredVehicles = vehicles.filter(v => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.plaka.toLowerCase().includes(term) ||
      v.istasyon.toLowerCase().includes(term) ||
      (v.geciciIstasyon && v.geciciIstasyon.toLowerCase().includes(term))
    );
  });

  // Gruplamalar (Sadece filtrelenmiş araçlar üzerinden)
  const musaitAraclar = filteredVehicles.filter(v => v.durum === 'Aktif' || v.durum === 'Yedek');
  const gorevdekiAraclar = filteredVehicles.filter(v => v.durum === 'Görevde');
  const bakimdakiAraclar = filteredVehicles.filter(v => v.durum === 'Bakımda');
  const arizaliAraclar = filteredVehicles.filter(v => v.durum === 'Serviste' || issues.some(iss => iss.ilgiliHedef === v.plaka && iss.sonDurum !== 'Çözüldü'));

  // Arızalı araçlarda tekrarları engelle (eğer hem Serviste hem de açık arızası varsa)
  const benzersizArizaliAraclar = Array.from(new Set(arizaliAraclar.map(v => v.id)))
    .map(id => arizaliAraclar.find(v => v.id === id)!);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      
      {/* 1. ÜST KONTROL PANELİ (KPI + Arama) */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* KPI'lar */}
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
            <div><p className="text-[10px] font-bold text-slate-500 uppercase">Müsait</p><h3 className="text-xl font-black leading-none text-slate-800">{musaitAraclar.length}</h3></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Siren className="w-5 h-5" /></div>
            <div><p className="text-[10px] font-bold text-slate-500 uppercase">Görevde</p><h3 className="text-xl font-black leading-none text-slate-800">{gorevdekiAraclar.length}</h3></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Wrench className="w-5 h-5" /></div>
            <div><p className="text-[10px] font-bold text-slate-500 uppercase">Bakımda</p><h3 className="text-xl font-black leading-none text-slate-800">{bakimdakiAraclar.length}</h3></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
            <div><p className="text-[10px] font-bold text-slate-500 uppercase">Hizmet Dışı</p><h3 className="text-xl font-black leading-none text-slate-800">{benzersizArizaliAraclar.length}</h3></div>
          </div>
        </div>

        {/* Arama Barı */}
        <div className="w-full lg:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="İlçe, istasyon veya plaka ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* 2. PANO KANBAN GÖRÜNÜMÜ */}
      {/* Scroll problemi için sütunların içine max-height ve overflow ekledik */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* KOLON 1: Müsait */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[calc(100vh-240px)]">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-black text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                Müsait Araçlar
              </span>
              <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg text-sm">{musaitAraclar.length}</span>
            </h3>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent flex-1">
            {musaitAraclar.map(v => (
              <div 
                key={v.id} 
                onClick={() => onEditVehicle && onEditVehicle(v)}
                className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-black text-slate-800">{v.plaka}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{v.durum}</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{v.geciciIstasyon || v.istasyon}</span>
                </div>
              </div>
            ))}
            {musaitAraclar.length === 0 && <div className="text-xs text-slate-400 text-center py-4">Kayıt yok</div>}
          </div>
        </div>

        {/* KOLON 2: Görevde */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[calc(100vh-240px)]">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-black text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
                Görevdekiler
              </span>
              <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg text-sm">{gorevdekiAraclar.length}</span>
            </h3>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent flex-1">
            {gorevdekiAraclar.map(v => (
              <div 
                key={v.id} 
                onClick={() => onEditVehicle && onEditVehicle(v)}
                className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-black text-slate-800">{v.plaka}</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Vakada</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{v.geciciIstasyon || v.istasyon}</span>
                </div>
              </div>
            ))}
            {gorevdekiAraclar.length === 0 && <div className="text-xs text-slate-400 text-center py-4">Kayıt yok</div>}
          </div>
        </div>

        {/* KOLON 3: Bakımda */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[calc(100vh-240px)]">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-black text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
                Bakımda
              </span>
              <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg text-sm">{bakimdakiAraclar.length}</span>
            </h3>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent flex-1">
            {bakimdakiAraclar.map(v => (
              <div 
                key={v.id} 
                onClick={() => onEditVehicle && onEditVehicle(v)}
                className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-amber-400 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-black text-slate-800">{v.plaka}</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Sanayide</span>
                </div>
                <div className="text-xs text-amber-600 font-medium mt-1">
                  Hedef KM: {v.sonrakiBakimKm?.toLocaleString('tr-TR') || 'Belirsiz'}
                </div>
              </div>
            ))}
            {bakimdakiAraclar.length === 0 && <div className="text-xs text-slate-400 text-center py-4">Kayıt yok</div>}
          </div>
        </div>

        {/* KOLON 4: Arızalı / Hizmet Dışı */}
        <div className="bg-rose-50/50 rounded-2xl border border-rose-100 flex flex-col overflow-hidden max-h-[calc(100vh-240px)]">
          <div className="p-4 border-b border-rose-200 bg-rose-50/80">
            <h3 className="font-black text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 shadow-sm shadow-rose-600/50 animate-pulse"></span>
                Arızalı / Dışı
              </span>
              <span className="bg-rose-200 text-rose-800 px-2.5 py-0.5 rounded-lg text-sm">{benzersizArizaliAraclar.length}</span>
            </h3>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-transparent flex-1">
            {benzersizArizaliAraclar.map(v => {
              const aracArizalari = issues.filter(iss => iss.ilgiliHedef === v.plaka && iss.sonDurum !== 'Çözüldü');
              
              return (
                <div 
                  key={v.id} 
                  className="bg-white p-3 rounded-xl border border-rose-200 shadow-sm overflow-hidden flex flex-col"
                >
                  <div 
                    className="flex justify-between items-center mb-2 cursor-pointer group"
                    onClick={() => onEditVehicle && onEditVehicle(v)}
                  >
                    <span className="font-mono font-black text-rose-900 group-hover:text-rose-600 transition-colors">{v.plaka}</span>
                    <span className="text-[10px] font-bold text-white bg-rose-600 px-2 py-0.5 rounded shadow-sm">
                      {v.durum === 'Serviste' ? 'Serviste' : 'Arızalı'}
                    </span>
                  </div>
                  
                  {/* Arıza Listesi */}
                  {aracArizalari.length > 0 && (
                    <div className="space-y-1 mt-2 pt-2 border-t border-rose-100">
                      <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">Açık Arızalar:</div>
                      {aracArizalari.map(iss => (
                        <div 
                          key={iss.id}
                          onClick={() => onEditIssue && onEditIssue(iss)}
                          className="text-[11px] font-medium text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 cursor-pointer hover:border-rose-300 hover:bg-rose-50 transition-colors flex justify-between items-center"
                        >
                          <span className="truncate pr-2">{iss.arizaTanimi}</span>
                          <ChevronRight className="w-3 h-3 flex-shrink-0 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {aracArizalari.length === 0 && v.durum === 'Serviste' && (
                    <div className="text-[10px] text-slate-500 mt-1 italic">Arıza kaydı girilmeden servise alınmış.</div>
                  )}
                </div>
              );
            })}
            {benzersizArizaliAraclar.length === 0 && <div className="text-xs text-slate-400 text-center py-4">Kusursuz, arızalı araç yok!</div>}
          </div>
        </div>

      </div>
    </div>
  );
};
