import React, { useState } from 'react';
import { Arac, MedikalEkipman, ArizaKaydi, Kullanici, SIRNAK_ILCELER } from '../types';
import { formatTRDate, getDaysRemaining, getStatusBadge } from '../utils/dateUtils';
import {
  Truck,
  Search,
  Plus,
  Edit2,
  Trash2,
  Gauge,
  Calendar,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Building2,
  MapPin,
  ArrowLeftRight,
} from 'lucide-react';

interface VehiclesViewProps {
  vehicles: Arac[];
  equipment: MedikalEkipman[];
  issues: ArizaKaydi[];
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: Arac) => void;
  onDeleteVehicle: (id: string) => void;
  onUpdateKm: (id: string, newKm: number) => void;
  onSwapVehicle: (brokenId: string, backupId: string) => void;
  currentUser: Kullanici;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  vehicles,
  equipment,
  issues,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onUpdateKm,
  onSwapVehicle,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDurum, setFilterDurum] = useState<string>('Tümü');
  const [selectedVehicle, setSelectedVehicle] = useState<Arac | null>(null);
  const [kmEditingId, setKmEditingId] = useState<string | null>(null);
  const [kmInputValue, setKmInputValue] = useState<number>(0);
  
  const [swapTargetId, setSwapTargetId] = useState<string | null>(null);
  const [selectedBackupId, setSelectedBackupId] = useState<string>('');

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plaka.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.aracModeli.marka.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.aracModeli.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ruhsatBilgileri.sasiNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDurum = filterDurum === 'Tümü' || v.durum === filterDurum;
    return matchesSearch && matchesDurum;
  });

  const handleStartEditKm = (v: Arac) => {
    setKmEditingId(v.id);
    setKmInputValue(v.guncelKm);
  };

  const handleSaveKm = (id: string) => {
    onUpdateKm(id, kmInputValue);
    setKmEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve Filtre Çubuğu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="w-6 h-6 text-rose-600" />
            1. Araç Kayıtları ve Filo Yönetimi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Araçların temel bilgileri, ruhsat ve şasi verileri, güncel KM ve yasal sigorta/kasko takip tablosu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentUser.rol === 'Yönetici' && (
            <>
              <button
                onClick={() => {
                  import('../utils/pdfExport').then((m) => m.exportVehiclesToPdf(vehicles));
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 text-xs md:text-sm cursor-pointer"
              >
                PDF Rapor Al
              </button>
              <button
                onClick={onAddVehicle}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 text-xs md:text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Yeni Ambulans Ekle
              </button>
            </>
          )}
        </div>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Plaka, marka, model veya şasi no ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Durum:</span>
          <select
            value={filterDurum}
            onChange={(e) => setFilterDurum(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500 text-slate-700"
          >
            <option value="Tümü">Tümü ({vehicles.length})</option>
            <option value="Aktif">🟢 Aktif</option>
            <option value="Görevde">🔵 Görevde</option>
            <option value="Yedek">🔄 Yedek</option>
            <option value="Bakımda">🟡 Bakımda</option>
            <option value="Serviste">🔴 Serviste</option>
          </select>
        </div>
      </div>

      {/* Araç Kartları Tablosu - İlçe Gruplaması */}
      <div className="space-y-12">
        {SIRNAK_ILCELER.map(ilce => {
          const ilceAraclari = filteredVehicles.filter(v => v.ilce === ilce);
          if (ilceAraclari.length === 0) return null;

          return (
            <div key={ilce} className="space-y-4">
              {/* İlçe Başlığı */}
              <div className="flex items-center gap-3 border-b-2 border-slate-200 pb-2">
                <div className="p-2 bg-slate-800 text-white rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">{ilce} İlçesine Bağlı Araçlar</h3>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-bold ml-2">
                  {ilceAraclari.length} Araç
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ilceAraclari.map((v) => {
          const kaskoDays = getDaysRemaining(v.kaskoBitisTarihi);
          const trafikDays = getDaysRemaining(v.trafikSigortasiBitisTarihi);
          const kaskoBadge = getStatusBadge(kaskoDays);
          const trafikBadge = getStatusBadge(trafikDays);

          const vehicleEqCount = equipment.filter((eq) => eq.bulunduguAracPlakasi === v.plaka).length;
          const vehicleIssuesCount = issues.filter(
            (iss) => iss.ilgiliHedef === v.plaka && iss.sonDurum !== 'Çözüldü'
          ).length;

          return (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* Kart Üst Bilgisi */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-slate-900 text-white font-mono font-black text-base rounded-lg border-2 border-slate-700 tracking-wider shadow-2xs">
                      {v.plaka}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {v.aracModeli.marka} {v.aracModeli.model}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">Model Yılı: {v.aracModeli.yil}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      v.durum === 'Aktif'
                        ? 'bg-emerald-100 text-emerald-800'
                        : v.durum === 'Görevde'
                        ? 'bg-blue-100 text-blue-800'
                        : v.durum === 'Yedek'
                        ? 'bg-purple-100 text-purple-800'
                        : v.durum === 'Bakımda'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {v.durum}
                  </span>
                </div>
              </div>

              {/* Kart İçerik Alanı */}
              <div className="p-5 space-y-4 text-xs">
                {/* Güncel KM (Sürekli güncellenen sayı veri tipi) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-rose-600" />
                      <span className="font-bold text-slate-700">Güncel Kilometre:</span>
                    </div>

                    {kmEditingId === v.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={kmInputValue}
                          onChange={(e) => setKmInputValue(parseInt(e.target.value) || 0)}
                          className="w-24 px-2 py-1 text-xs font-mono font-bold border border-rose-400 rounded bg-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveKm(v.id)}
                          className="px-2 py-1 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={() => setKmEditingId(null)}
                          className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px]"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-sm">
                          {v.guncelKm.toLocaleString('tr-TR')} KM
                        </span>
                        {currentUser.rol === 'Yönetici' && (
                          <button
                            onClick={() => handleStartEditKm(v)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="KM Güncelle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {(v.sonBakimKm || v.sonrakiBakimKm) && (
                    <div className="flex flex-col gap-1 pt-2 border-t border-slate-200/60 mt-1">
                      <div className="flex flex-wrap items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Gauge className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-500">Son Bakım:</span>
                          <span className="text-xs font-mono font-bold text-slate-600">{v.sonBakimKm ? v.sonBakimKm.toLocaleString('tr-TR') + ' KM' : '-'}</span>
                        </div>
                        {v.sonrakiBakimKm && (
                          <div className="flex items-center gap-1.5">
                            <Gauge className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs font-medium text-slate-600">Hedef:</span>
                            <span className="text-xs font-mono font-bold text-slate-800">{v.sonrakiBakimKm.toLocaleString('tr-TR')} KM</span>
                          </div>
                        )}
                      </div>
                      
                      {v.sonrakiBakimKm && (() => {
                        const remainingKm = v.sonrakiBakimKm - v.guncelKm;
                        if (remainingKm <= 0) {
                          return <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-red-100 text-red-800 border-red-200 animate-pulse">🔴 BAKIM GECİKTİ!</span>;
                        } else if (remainingKm <= 1500) {
                          return <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-amber-100 text-amber-800 border-amber-200">🟠 YAKLAŞIYOR ({remainingKm.toLocaleString('tr-TR')} KM Kaldı)</span>;
                        } else {
                          return <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-emerald-100 text-emerald-800 border-emerald-200">🟢 UYGUN ({remainingKm.toLocaleString('tr-TR')} KM Kaldı)</span>;
                        }
                      })()}
                    </div>
                  )}
                </div>

                {/* Ruhsat Bilgileri */}
                <div className="space-y-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">Şasi No:</span>
                    <span className="font-mono font-bold text-slate-800">{v.ruhsatBilgileri.sasiNo || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">Motor No:</span>
                    <span className="font-mono font-bold text-slate-800">{v.ruhsatBilgileri.motorNo || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">Belge Seri No:</span>
                    <span className="font-mono font-bold text-slate-800">{v.ruhsatBilgileri.belgeSeriNo || '-'}</span>
                  </div>
                </div>

                {/* Yasal Sigorta / Kasko Bitiş Tarihleri */}
                <div className="space-y-2">
                  <div className="flex flex-col p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-700 text-xs uppercase tracking-wide">Kasko</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${kaskoBadge.bgClass} ${kaskoBadge.textClass} ${kaskoBadge.borderClass}`}>
                        {kaskoBadge.text}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex flex-col">
                        <span className="text-slate-500">Başlangıç</span>
                        <span className="font-mono font-medium text-slate-700">{v.kaskoBaslangicTarihi ? formatTRDate(v.kaskoBaslangicTarihi) : '-'}</span>
                      </div>
                      <div className="text-slate-300">-</div>
                      <div className="flex flex-col items-end">
                        <span className="text-slate-500">Bitiş</span>
                        <span className="font-mono font-bold text-slate-900">{formatTRDate(v.kaskoBitisTarihi)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-slate-700 text-xs uppercase tracking-wide">Trafik Sigortası</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${trafikBadge.bgClass} ${trafikBadge.textClass} ${trafikBadge.borderClass}`}>
                        {trafikBadge.text}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex flex-col">
                        <span className="text-slate-500">Başlangıç</span>
                        <span className="font-mono font-medium text-slate-700">{v.trafikSigortasiBaslangicTarihi ? formatTRDate(v.trafikSigortasiBaslangicTarihi) : '-'}</span>
                      </div>
                      <div className="text-slate-300">-</div>
                      <div className="flex flex-col items-end">
                        <span className="text-slate-500">Bitiş</span>
                        <span className="font-mono font-bold text-slate-900">{formatTRDate(v.trafikSigortasiBitisTarihi)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bağlı Ekipman & Arıza Durumu */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    {vehicleEqCount} Medikal Ekipman
                  </span>
                  {vehicleIssuesCount > 0 ? (
                    <span className="flex items-center gap-1 font-bold text-rose-600">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {vehicleIssuesCount} Bekleyen Arıza
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Arıza Kaydı Yok
                    </span>
                  )}
                </div>
              </div>

              {currentUser.rol === 'Yönetici' && (v.durum === 'Serviste' || v.durum === 'Bakımda') && (
                <div className="px-5 pb-3">
                  {swapTargetId === v.id ? (
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 space-y-2">
                      <label className="text-[10px] font-bold text-purple-800 uppercase">Yedek Araç Seçin:</label>
                      <select 
                        className="w-full text-xs p-1.5 border border-purple-300 rounded"
                        value={selectedBackupId}
                        onChange={(e) => setSelectedBackupId(e.target.value)}
                      >
                        <option value="">Seçiniz...</option>
                        {vehicles.filter(veh => veh.durum === 'Yedek').map(veh => (
                          <option key={veh.id} value={veh.id}>{veh.plaka} - {veh.istasyon}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            if(selectedBackupId) {
                              onSwapVehicle(v.id, selectedBackupId);
                              setSwapTargetId(null);
                            }
                          }}
                          className="flex-1 bg-purple-600 text-white text-[11px] font-bold py-1.5 rounded"
                        >Onayla</button>
                        <button onClick={() => setSwapTargetId(null)} className="flex-1 bg-slate-200 text-slate-700 text-[11px] font-bold py-1.5 rounded">İptal</button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSwapTargetId(v.id)}
                      className="w-full py-1.5 bg-slate-100 hover:bg-purple-100 text-purple-700 text-[11px] font-bold rounded-lg border border-slate-200 hover:border-purple-300 transition-colors"
                    >
                      🔄 Yedek Tahsis Et (Araç Değişimi)
                    </button>
                  )}
                </div>
              )}

              {/* Kart Alt Aksiyonları */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedVehicle(v)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    Ekipman & Arıza Detayını İncele
                  </button>

                  {currentUser.rol === 'Yönetici' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditVehicle(v)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`${v.plaka} plakalı ambulansı silmek istediğinize emin misiniz?`)) {
                            onDeleteVehicle(v.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
            </div>
          );
                })}
              </div>
            </div>
          );
        })}

        {filteredVehicles.length === 0 && (
          <div className="p-10 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            Arama kriterlerinize uygun araç bulunamadı.
          </div>
        )}
      </div>

      {/* Araç Detay Çekmecesi / Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-slate-900 text-white font-mono font-bold rounded-lg text-sm">
                  {selectedVehicle.plaka}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {selectedVehicle.aracModeli.marka} {selectedVehicle.aracModeli.model}
                  </h3>
                  <p className="text-xs text-slate-500">İstasyon: {selectedVehicle.istasyon}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                Kapat
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Araca Atanmış Medikal Ekipmanlar */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Bu Ambulanstaki Medikal Cihaz ve Ekipmanlar (Sağlık Bakanlığı Standartı)
                </h4>

                {equipment.filter((eq) => eq.bulunduguAracPlakasi === selectedVehicle.plaka).length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-xs text-center">
                    Bu araca atanmış medikal ekipman bulunmamaktadır.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {equipment
                      .filter((eq) => eq.bulunduguAracPlakasi === selectedVehicle.plaka)
                      .map((eq) => (
                        <div
                          key={eq.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{eq.cihazAdi}</span>
                            <div className="text-[11px] text-slate-500 font-mono">S/N: {eq.seriNo}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] text-slate-600 block">
                              Kalibrasyon: {formatTRDate(eq.gelecekKalibrasyonTarihi)}
                            </span>
                            <span className="font-semibold text-emerald-700 text-[10px]">{eq.durum}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Araç Arıza Geçmişi */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Bu Araca Ait Arıza ve Bildirim Kayıtları
                </h4>

                {issues.filter((i) => i.ilgiliHedef === selectedVehicle.plaka).length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 text-emerald-700 text-xs text-center font-medium">
                    ✅ Bu araç için açık veya geçmiş bir arıza kaydı bulunmamaktadır.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {issues
                      .filter((i) => i.ilgiliHedef === selectedVehicle.plaka)
                      .map((iss) => (
                        <div
                          key={iss.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-800">{iss.kayitNo}</span>
                              <span className="font-semibold text-slate-700">{iss.arizaTanimi}</span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              Bildiren: {iss.bildirenPersonel} ({iss.olusturulmaTarihi})
                            </span>
                          </div>
                          <div>
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                iss.sonDurum === 'Arızada'
                                  ? 'bg-amber-100 text-amber-800'
                                  : iss.sonDurum === 'Tamirde'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {iss.sonDurum}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
              >
                Pencereyi Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
