import React from 'react';
import { Arac } from '../types';
import { BarChart3, Clock, Truck, TrendingUp } from 'lucide-react';

interface ReportsViewProps {
  vehicles: Arac[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ vehicles }) => {
  // En çok kullanılan araçları sırala (aylık kullanım saatine göre büyükten küçüğe)
  const sortedVehicles = [...vehicles].sort((a, b) => (b.aylikKullanimSaati || 0) - (a.aylikKullanimSaati || 0));
  
  // Toplam kullanım saatini hesapla
  const totalHours = sortedVehicles.reduce((sum, v) => sum + (v.aylikKullanimSaati || 0), 0);
  const avgHours = vehicles.length > 0 ? Math.round(totalHours / vehicles.length) : 0;
  const maxHours = sortedVehicles.length > 0 ? (sortedVehicles[0].aylikKullanimSaati || 1) : 1;

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Performans ve Kullanım Raporları
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Araçların bu ay içindeki operasyonel kullanım saatleri ve filo performans analizleri.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Toplam Kullanım</div>
            <div className="text-2xl font-black text-slate-800">{totalHours} <span className="text-sm font-medium text-slate-500">Saat</span></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Araç Başı Ortalama</div>
            <div className="text-2xl font-black text-slate-800">{avgHours} <span className="text-sm font-medium text-slate-500">Saat / Ay</span></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">En Aktif Araç</div>
            <div className="text-lg font-black text-slate-800">{sortedVehicles[0]?.plaka || '-'}</div>
            <div className="text-xs text-slate-500">{sortedVehicles[0]?.aylikKullanimSaati || 0} Saat</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Aylık Araç Kullanım Saatleri Sıralaması</h3>
        </div>
        <div className="p-5">
          <div className="space-y-6">
            {sortedVehicles.map((v) => {
              const hours = v.aylikKullanimSaati || 0;
              const percentage = Math.min(100, Math.round((hours / maxHours) * 100));
              
              let barColor = 'bg-indigo-500';
              if (percentage > 80) barColor = 'bg-rose-500';
              else if (percentage < 30) barColor = 'bg-emerald-500';

              return (
                <div key={v.id} className="relative">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-slate-800">{v.plaka}</span>
                      <span className="text-slate-400 font-normal hidden sm:inline">({v.istasyon})</span>
                    </span>
                    <span className="text-slate-600">{hours} Saat</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${barColor}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
