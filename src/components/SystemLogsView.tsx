import React, { useState } from 'react';
import { IslemKaydi } from '../types';
import { Activity, Search, Shield, Clock, FileText } from 'lucide-react';

interface SystemLogsViewProps {
  logs: IslemKaydi[];
}

export const SystemLogsView: React.FC<SystemLogsViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // En yeni loglar en üstte olsun
  const sortedLogs = [...logs].sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime());
  
  const filteredLogs = sortedLogs.filter(log => 
    log.kullaniciAdi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.detay.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.islemTipi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.hedef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-slate-700" />
            Sistem İşlem Kayıtları (Audit Log)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistemde yapılan tüm işlemler (ekleme, silme, güncelleme) güvenlik amaçlı burada kayıt altına alınır.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              import('../utils/pdfExport').then((m) => m.exportLogsToPdf(filteredLogs));
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 text-xs md:text-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            PDF Rapor Al
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="İşlem detayında, kullanıcıda veya hedef modülde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Tarih / Saat</th>
                <th className="px-6 py-4">Kullanıcı Adı</th>
                <th className="px-6 py-4">İşlem Tipi</th>
                <th className="px-6 py-4">Modül (Hedef)</th>
                <th className="px-6 py-4">İşlem Detayı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-mono text-xs">{new Date(log.tarih).toLocaleString('tr-TR')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-semibold text-slate-800 whitespace-nowrap">
                      {log.kullaniciAdi}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        log.islemTipi === 'Ekleme' ? 'bg-emerald-100 text-emerald-700' :
                        log.islemTipi === 'Silme' ? 'bg-rose-100 text-rose-700' :
                        log.islemTipi === 'Güncelleme' ? 'bg-blue-100 text-blue-700' :
                        log.islemTipi === 'Giriş' ? 'bg-purple-100 text-purple-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.islemTipi}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Activity className="w-4 h-4 text-slate-400" />
                        {log.hedef}
                      </div>
                    </td>
                    <td className="px-6 py-3 min-w-[300px]">
                      {log.detay}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
