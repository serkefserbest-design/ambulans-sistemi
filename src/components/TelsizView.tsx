import React, { useState } from 'react';
import { TelsizKontrol, Kullanici, ISTASYON_GRUPLARI } from '../types';
import { Radio, Plus, X, AlertCircle, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatTRDate } from '../utils/dateUtils';

interface TelsizViewProps {
  telsizKontrolleri: TelsizKontrol[];
  currentUser: Kullanici;
  onSaveKontrol: (k: TelsizKontrol) => void;
}

export const TelsizView: React.FC<TelsizViewProps> = ({
  telsizKontrolleri,
  currentUser,
  onSaveKontrol
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form States
  const [istasyon, setIstasyon] = useState('');
  const [elTelsizi, setElTelsizi] = useState<'Sağlam' | 'Arızalı'>('Sağlam');
  const [sabitTelsiz, setSabitTelsiz] = useState<'Sağlam' | 'Arızalı'>('Sağlam');
  const [aracTelsizi, setAracTelsizi] = useState<'Sağlam' | 'Arızalı'>('Sağlam');
  const [notlar, setNotlar] = useState('');

  const isAdmin = currentUser.rol === 'Yönetici';

  // Sadece Admin hepsini görür, Kullanıcı sadece kendi girdiklerini görür.
  const visibleLogs = isAdmin 
    ? telsizKontrolleri 
    : telsizKontrolleri.filter(k => k.yapanPersonel === currentUser.adSoyad);

  // Bugünün logları (sadece Admin için özet amaçlı)
  const today = new Date().toLocaleDateString('tr-TR');
  const todayLogs = visibleLogs.filter(k => new Date(k.tarih).toLocaleDateString('tr-TR') === today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!istasyon) return alert('Lütfen istasyon seçin.');

    const yeniKontrol: TelsizKontrol = {
      id: Date.now().toString(),
      tarih: new Date().toISOString(),
      istasyon,
      yapanPersonel: currentUser.adSoyad,
      elTelsizi,
      sabitTelsiz,
      aracTelsizi,
      notlar
    };

    onSaveKontrol(yeniKontrol);
    setIsModalOpen(false);
    
    // Formu temizle
    setIstasyon('');
    setElTelsizi('Sağlam');
    setSabitTelsiz('Sağlam');
    setAracTelsizi('Sağlam');
    setNotlar('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Radio className="w-7 h-7 text-indigo-600" />
            Telsiz & Nöbet Devir Ekranı
          </h2>
          <p className="text-slate-500 mt-1">Günde 3 defa yapılan vardiya ve telsiz kontrolleri</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" />
          Kontrol Bildir
        </button>
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle2 className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase">Bugün Yapılan Kontrol</p>
              <h3 className="text-2xl font-black text-emerald-900">{todayLogs.length}</h3>
            </div>
          </div>
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-rose-600 uppercase">Toplam Arızalı Telsiz</p>
              <h3 className="text-2xl font-black text-rose-900">
                {visibleLogs.filter(k => k.elTelsizi === 'Arızalı' || k.sabitTelsiz === 'Arızalı' || k.aracTelsizi === 'Arızalı').length}
              </h3>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase">Toplam Kayıt</p>
              <h3 className="text-2xl font-black text-blue-900">{visibleLogs.length}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Tarih & Saat</th>
                <th className="p-4">İstasyon</th>
                <th className="p-4">Personel</th>
                <th className="p-4 text-center">El Telsizi</th>
                <th className="p-4 text-center">Sabit Telsiz</th>
                <th className="p-4 text-center">Araç Telsizi</th>
                <th className="p-4">Notlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {formatTRDate(log.tarih)}
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-800">{log.istasyon}</td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{log.yapanPersonel}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${log.elTelsizi === 'Sağlam' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {log.elTelsizi}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${log.sabitTelsiz === 'Sağlam' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {log.sabitTelsiz}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${log.aracTelsizi === 'Sağlam' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {log.aracTelsizi}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500 truncate max-w-[200px]" title={log.notlar}>
                    {log.notlar || '-'}
                  </td>
                </tr>
              ))}
              {visibleLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    Henüz telsiz kontrol kaydı bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* YENİ KONTROL MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-4 flex justify-between items-center">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-400" />
                Yeni Telsiz Kontrolü
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-sm text-blue-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p>Arızalı işaretlenen telsizler için sistem otomatik olarak <strong>Kritik Arıza</strong> kaydı oluşturacaktır.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Kontrol Edilen İstasyon</label>
                <select 
                  required
                  value={istasyon}
                  onChange={e => setIstasyon(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seçiniz...</option>
                  {Object.entries(ISTASYON_GRUPLARI).map(([ilce, istasyonlar]) => (
                    <optgroup key={ilce} label={ilce}>
                      {istasyonlar.map(ist => (
                        <option key={ist} value={ist}>{ist}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* El Telsizi */}
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="font-bold text-slate-700">El Telsizi</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setElTelsizi('Sağlam')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${elTelsizi === 'Sağlam' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}>Sağlam</button>
                    <button type="button" onClick={() => setElTelsizi('Arızalı')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${elTelsizi === 'Arızalı' ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}>Arızalı</button>
                  </div>
                </div>

                {/* Sabit Telsiz */}
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="font-bold text-slate-700">Sabit Telsiz</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setSabitTelsiz('Sağlam')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${sabitTelsiz === 'Sağlam' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}>Sağlam</button>
                    <button type="button" onClick={() => setSabitTelsiz('Arızalı')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${sabitTelsiz === 'Arızalı' ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}>Arızalı</button>
                  </div>
                </div>

                {/* Araç Telsizi */}
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="font-bold text-slate-700">Araç Telsizi</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setAracTelsizi('Sağlam')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${aracTelsizi === 'Sağlam' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}>Sağlam</button>
                    <button type="button" onClick={() => setAracTelsizi('Arızalı')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${aracTelsizi === 'Arızalı' ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}>Arızalı</button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Ek Notlar (İsteğe Bağlı)</label>
                <textarea 
                  value={notlar}
                  onChange={e => setNotlar(e.target.value)}
                  placeholder="Arıza varsa veya eklemek istediğiniz bir not varsa buraya yazın..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
