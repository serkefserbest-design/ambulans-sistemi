import React, { useState, useEffect } from 'react';
import { ArizaKaydi, AciliyetSeviyesi, Arac, MedikalEkipman } from '../types';
import { formatDateTimeTR } from '../utils/dateUtils';
import { X, AlertTriangle } from 'lucide-react';

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (issue: ArizaKaydi) => void;
  vehicles: Arac[];
  equipment: MedikalEkipman[];
  initialIssue?: ArizaKaydi | null;
  currentUser?: import('../types').Kullanici;
}

export const IssueModal: React.FC<IssueModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicles,
  equipment,
  initialIssue,
  currentUser,
}) => {
  const [formData, setFormData] = useState<ArizaKaydi>({
    id: '',
    kayitNo: '',
    ilgiliTip: 'Araç',
    ilgiliHedef: '',
    arizaTanimi: '',
    aciliyetSeviyesi: 'Orta',
    bildirenPersonel: '',
    olusturulmaTarihi: '',
    sonDurum: 'Arızada',
    cozumNotu: '',
  });

  useEffect(() => {
    if (initialIssue) {
      setFormData(initialIssue);
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900);
      setFormData({
        id: `iss-${Date.now()}`,
        kayitNo: `#00${randomNum}`,
        ilgiliTip: 'Araç',
        ilgiliHedef: vehicles[0] ? `${vehicles[0].plaka} - ${vehicles[0].geciciIstasyon ? vehicles[0].geciciIstasyon + ' (Geçici)' : vehicles[0].istasyon}` : '',
        arizaTanimi: '',
        aciliyetSeviyesi: 'Yüksek',
        bildirenPersonel: currentUser?.adSoyad || 'Bilinmeyen Personel',
        olusturulmaTarihi: formatDateTimeTR(new Date()),
        sonDurum: 'Arızada',
        cozumNotu: '',
      });
    }
  }, [initialIssue, isOpen, vehicles]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.arizaTanimi.trim() || !formData.ilgiliHedef.trim() || !formData.bildirenPersonel.trim()) {
      alert('Lütfen arıza tanımı, ilgili araç/ekipman ve bildiren personel alanlarını doldurunuz.');
      return;
    }

    const updated = { ...formData };
    if (updated.sonDurum === 'Çözüldü' && !updated.cozulmeTarihi) {
      updated.cozulmeTarihi = formatDateTimeTR(new Date());
    }

    onSave(updated);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Şimdilik sadece fotoğraf yükleyebilirsiniz.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setFormData({ ...formData, ekDosya: dataUrl });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {initialIssue ? `Arıza Kaydı ${initialIssue.kayitNo}` : 'Yeni Arıza / Bildirim Kaydı Aç'}
              </h3>
              <p className="text-xs text-slate-500">4. Canlı Pano (Log) & Teknik Müdahale Takibi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Kayıt No ve Aciliyet Seviyesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kayıt ID / No
              </label>
              <input
                type="text"
                required
                readOnly={!!initialIssue}
                value={formData.kayitNo}
                onChange={(e) => setFormData({ ...formData, kayitNo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-800"
              />
              <span className="text-[11px] text-slate-400">Benzersiz vaka takip numarası</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Aciliyet Seviyesi *
              </label>
              <select
                value={formData.aciliyetSeviyesi}
                onChange={(e) => setFormData({ ...formData, aciliyetSeviyesi: e.target.value as AciliyetSeviyesi })}
                className={`w-full px-3 py-2 border rounded-xl font-bold text-sm ${
                  formData.aciliyetSeviyesi === 'Kritik'
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : formData.aciliyetSeviyesi === 'Yüksek'
                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                    : formData.aciliyetSeviyesi === 'Orta'
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-300 bg-slate-50 text-slate-700'
                }`}
              >
                <option value="Düşük">🟢 Düşük (Planlı bakımda bakılabilir)</option>
                <option value="Orta">🔵 Orta (En kısa sürede kontrol)</option>
                <option value="Yüksek">🟠 Yüksek (Acil müdahale gerekir)</option>
                <option value="Kritik">🔴 Kritik (Araç/cihaz derhal kullanım dışı!)</option>
              </select>
            </div>
          </div>

          {/* İlgili Araç / Ekipman Seçimi */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              İlgili Araç / Ekipman Seçimi *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="ilgiliTip"
                  value="Araç"
                  checked={formData.ilgiliTip === 'Araç'}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      ilgiliTip: 'Araç',
                      ilgiliHedef: vehicles[0]?.plaka || '',
                    })
                  }
                  className="text-rose-600 focus:ring-rose-500"
                />
                Ambulans (Araç Gövde/Mekanik)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="ilgiliTip"
                  value="Ekipman"
                  checked={formData.ilgiliTip === 'Ekipman'}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      ilgiliTip: 'Ekipman',
                      ilgiliHedef: equipment[0] ? `${equipment[0].seriNo} (${equipment[0].cihazAdi})` : '',
                    })
                  }
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                Medikal Cihaz / Ekipman
              </label>
            </div>

            {formData.ilgiliTip === 'Araç' ? (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Ambulans Plakası</label>
                <select
                  value={formData.ilgiliHedef}
                  onChange={(e) => setFormData({ ...formData, ilgiliHedef: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-semibold"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={`${v.plaka} - ${v.geciciIstasyon ? v.geciciIstasyon + ' (Geçici)' : v.istasyon}`}>
                      🚑 {v.plaka} - {v.geciciIstasyon ? v.geciciIstasyon + ' (Geçici)' : v.istasyon}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Cihaz ve Seri No</label>
                <select
                  value={formData.ilgiliHedef}
                  onChange={(e) => setFormData({ ...formData, ilgiliHedef: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {equipment.map((eq) => (
                    <option key={eq.id} value={`${eq.seriNo} (${eq.cihazAdi})`}>
                      ⚡ {eq.cihazAdi} - S/N: {eq.seriNo} [Araç: {eq.bulunduguAracPlakasi}]
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Arıza Tanımı */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Arıza Tanımı *
            </label>
            <textarea
              required
              rows={3}
              placeholder='Örn: "Sol ön tepe lambası yanmıyor" veya "Defibrilatör bataryası şarj tutmuyor"'
              value={formData.arizaTanimi}
              onChange={(e) => setFormData({ ...formData, arizaTanimi: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
            />
          </div>

          {/* Bildiren Personel ve Tarih */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Bildiren Personel (Ad Soyad / Unvan) *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Paramedik Caner Erdem"
                value={formData.bildirenPersonel}
                onChange={(e) => setFormData({ ...formData, bildirenPersonel: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                readOnly={currentUser?.rol !== 'Yönetici'}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Oluşturulma Tarihi & Saati
              </label>
              <input
                type="text"
                readOnly
                value={formData.olusturulmaTarihi}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-600 text-sm font-mono"
              />
            </div>
          </div>

          {/* Fotoğraf Ekleme */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Hasar / Arıza Fotoğrafı (Opsiyonel)
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Fotoğraf Seç veya Çek
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              {formData.ekDosya && (
                <div className="relative">
                  <img src={formData.ekDosya} alt="Arıza fotoğrafı" className="h-16 w-16 object-cover rounded-lg border border-slate-200" />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, ekDosya: undefined })}
                    className="absolute -top-2 -right-2 bg-white rounded-full text-rose-500 shadow-md p-0.5 hover:text-rose-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Son Durum */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Son Durum (Müdahale Aşaması)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, sonDurum: 'Arızada' })}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.sonDurum === 'Arızada'
                    ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-400 text-amber-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-lg mb-1">🟡</div>
                <div className="text-xs font-semibold">Arızada</div>
                <div className="text-[10px] text-slate-500 font-normal">İşlem yapılmadı</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, sonDurum: 'Tamirde' })}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.sonDurum === 'Tamirde'
                    ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-400 text-blue-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-lg mb-1">🔵</div>
                <div className="text-xs font-semibold">Tamirde</div>
                <div className="text-[10px] text-slate-500 font-normal">Serviste / Sanayide</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, sonDurum: 'Çözüldü' })}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.sonDurum === 'Çözüldü'
                    ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-400 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-lg mb-1">🟢</div>
                <div className="text-xs font-semibold">Çözüldü</div>
                <div className="text-[10px] text-slate-500 font-normal">Sorun giderildi, aktif</div>
              </button>
            </div>

            {formData.sonDurum !== 'Arızada' && (
              <div>
                <label className="block text-xs text-slate-600 mb-1">Müdahale / Servis / Çözüm Notu</label>
                <textarea
                  rows={2}
                  placeholder="Yapılan onarım, parça değişimi veya servis detayları..."
                  value={formData.cozumNotu || ''}
                  onChange={(e) => setFormData({ ...formData, cozumNotu: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
            )}
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              {initialIssue ? 'Güncelle' : 'Kaydı Aç'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
