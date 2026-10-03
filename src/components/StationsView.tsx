import React, { useState } from 'react';
import { Arac, Kullanici, ISTASYON_GRUPLARI, IstasyonNotu, NotTipi } from '../types';
import { MapPin, ArrowLeftRight, Truck, AlertTriangle, ShieldCheck, Building2, Ambulance, Undo2, StickyNote, Plus, Trash2, X } from 'lucide-react';
import { formatTRDate } from '../utils/dateUtils';

interface StationsViewProps {
  vehicles: Arac[];
  currentUser: Kullanici;
  onNavigateToVehicles: () => void;
  onRemoveTemporaryAssignment?: (vehicleId: string) => void;
  stationNotes?: IstasyonNotu[];
  onAddNote?: (note: IstasyonNotu) => void;
  onDeleteNote?: (id: string) => void;
}

export const StationsView: React.FC<StationsViewProps> = ({ 
  vehicles, 
  currentUser, 
  onNavigateToVehicles, 
  onRemoveTemporaryAssignment,
  stationNotes = [],
  onAddNote,
  onDeleteNote
}) => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState('');
  const [noteMesaj, setNoteMesaj] = useState('');
  const [noteTip, setNoteTip] = useState<NotTipi>('Bilgi');

  const handleAddNoteClick = (station: string) => {
    setSelectedStation(station);
    setNoteMesaj('');
    setNoteTip('Bilgi');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteMesaj) return;
    
    if (onAddNote) {
      onAddNote({
        id: Date.now().toString(),
        istasyonAdi: selectedStation,
        mesaj: noteMesaj,
        tip: noteTip,
        tarih: new Date().toISOString(),
        ekleyen: currentUser.adSoyad
      });
    }
    setIsNoteModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <MapPin className="w-7 h-7 text-rose-600" />
            İstasyon Durumları
          </h2>
          <p className="text-slate-500 mt-1">İlçe bazlı istasyonlar, asil ve emanet araç dağılımı</p>
        </div>
        {currentUser.rol === 'Yönetici' && (
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToVehicles}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Araç Görevlendir / Değiştir
            </button>
          </div>
        )}
      </div>

      <div className="space-y-12">
        {Object.entries(ISTASYON_GRUPLARI).map(([ilce, istasyonlar]) => (
          <div key={ilce} className="space-y-4">
            
            {/* İlçe Başlığı */}
            <div className="flex items-center gap-3 border-b-2 border-slate-200 pb-2">
              <div className="p-2 bg-rose-700 text-white shadow-md shadow-rose-700/20 rounded-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">{ilce} İstasyonları</h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-bold ml-2">
                {istasyonlar.length} İstasyon
              </span>
            </div>

            {/* İstasyon Kartları (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {istasyonlar.map(station => {
                const primaryVehicles = vehicles.filter(v => v.istasyon === station);
                const temporaryVehicles = vehicles.filter(v => v.geciciIstasyon === station);
                const sNotes = stationNotes.filter(n => n.istasyonAdi === station);

                return (
                  <div key={station} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-rose-400 transition-colors">
                    <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <Ambulance className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-lg">{station}</h3>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col space-y-4">
                      {/* Asil Araçlar */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" /> Asil Kadrolu Araçlar
                        </h4>
                        {primaryVehicles.length === 0 ? (
                          <div className="text-sm text-slate-500 font-medium p-3 bg-slate-50 rounded-lg border border-slate-100 border-dashed flex items-center gap-2">
                            Bu istasyona kayıtlı asil araç yok.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {primaryVehicles.map(v => (
                              <div key={v.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-mono font-black text-slate-800 text-sm">{v.plaka}</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.durum === 'Aktif' || v.durum === 'Görevde' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                    {v.durum}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 font-medium">
                                  {v.aracModeli.marka} {v.aracModeli.model}
                                </div>
                                
                                {v.geciciIstasyon && v.geciciIstasyon !== station && (
                                  <div className="mt-2 text-[11px] font-bold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center justify-between gap-1.5">
                                    <div className="flex items-center gap-1.5">
                                      <ArrowLeftRight className="w-4 h-4 flex-shrink-0" />
                                      <span>Şu an görevde: <strong className="block">{v.geciciIstasyon}</strong></span>
                                    </div>
                                    {currentUser.rol === 'Yönetici' && onRemoveTemporaryAssignment && (
                                      <button 
                                        onClick={() => onRemoveTemporaryAssignment(v.id)}
                                        className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md transition-colors flex-shrink-0"
                                        title="Geçici Görevi İptal Et (Geri Çağır)"
                                      >
                                        <Undo2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Geçici Araçlar */}
                      {temporaryVehicles.length > 0 && (
                        <div className="pt-3 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <ArrowLeftRight className="w-3.5 h-3.5" /> Geçici (Emanet) Araçlar
                          </h4>
                          <div className="space-y-2">
                            {temporaryVehicles.map(v => (
                              <div key={v.id} className="p-3 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-mono font-black text-slate-800 text-sm">{v.plaka}</span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                                    Emanet Araç
                                  </span>
                                </div>
                                <div className="text-xs text-amber-700 font-medium flex flex-col gap-0.5 mt-1">
                                  <span>{v.aracModeli.marka} {v.aracModeli.model}</span>
                                  <span className="text-[10px] opacity-80 mt-1 pt-1 border-t border-amber-200/50 flex justify-between items-center">
                                    <span>Asil Sahibi: {v.istasyon}</span>
                                    {currentUser.rol === 'Yönetici' && onRemoveTemporaryAssignment && (
                                      <button 
                                        onClick={() => onRemoveTemporaryAssignment(v.id)}
                                        className="text-amber-700 hover:text-rose-600 transition-colors"
                                        title="Görevi Sonlandır (İade Et)"
                                      >
                                        Görevi Bitir
                                      </button>
                                    )}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* İstasyon Notları (En altta) */}
                      <div className="pt-4 mt-auto border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <StickyNote className="w-3.5 h-3.5" /> İstasyon Notları
                          </h4>
                          <button 
                            onClick={() => handleAddNoteClick(station)}
                            className="text-[10px] bg-slate-100 hover:bg-indigo-50 text-indigo-600 font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Ekle
                          </button>
                        </div>
                        
                        {sNotes.length === 0 ? (
                          <div className="text-[11px] text-slate-400 italic">Bu istasyon için eklenmiş not yok.</div>
                        ) : (
                          <div className="space-y-2">
                            {sNotes.map(note => (
                              <div key={note.id} className={`p-2.5 rounded-lg border text-xs ${note.tip === 'Uyarı' ? 'bg-rose-50 border-rose-200 text-rose-800' : note.tip === 'Eksik' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                                <div className="flex justify-between items-start gap-2 mb-1">
                                  <span className="font-bold opacity-80">{note.tip}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] opacity-60" title={formatTRDate(note.tarih)}>{new Date(note.tarih).toLocaleDateString('tr-TR')}</span>
                                    {(currentUser.rol === 'Yönetici' || note.ekleyen === currentUser.adSoyad) && onDeleteNote && (
                                      <button onClick={() => onDeleteNote(note.id)} className="opacity-50 hover:opacity-100 hover:text-red-600 transition-opacity">
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <div className="font-medium whitespace-pre-wrap">{note.mesaj}</div>
                                <div className="text-[9px] opacity-60 mt-1.5 flex justify-end">- {note.ekleyen}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      {/* Yeni Not Modalı */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-4 flex justify-between items-center">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-indigo-400" />
                Not Ekle: {selectedStation}
              </h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveNote} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Not Tipi</label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setNoteTip('Uyarı')} className={`py-2 text-xs font-bold rounded-lg border transition-all ${noteTip === 'Uyarı' ? 'bg-rose-500 border-rose-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Uyarı (Kritik)</button>
                  <button type="button" onClick={() => setNoteTip('Eksik')} className={`py-2 text-xs font-bold rounded-lg border transition-all ${noteTip === 'Eksik' ? 'bg-amber-500 border-amber-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Eksik / Sorun</button>
                  <button type="button" onClick={() => setNoteTip('Bilgi')} className={`py-2 text-xs font-bold rounded-lg border transition-all ${noteTip === 'Bilgi' ? 'bg-blue-500 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Genel Bilgi</button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Not Mesajı</label>
                <textarea 
                  required
                  value={noteMesaj}
                  onChange={e => setNoteMesaj(e.target.value)}
                  placeholder="İstasyon ile ilgili notunuzu giriniz (Örn: Çatı su akıtıyor, anahtar teslim edilmedi vb.)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsNoteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">İptal</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">Notu Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
