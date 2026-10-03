import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Kullanici, KullaniciRolu } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Kullanici) => void;
  initialUser: Kullanici | null;
}

export function UserModal({ isOpen, onClose, onSave, initialUser }: UserModalProps) {
  const [formData, setFormData] = useState<Kullanici>({
    id: '',
    kullaniciAdi: '',
    sifre: '',
    adSoyad: '',
    rol: 'DİĞER SAĞLIK PERSONELİ',
    aktifMi: true
  });

  useEffect(() => {
    if (initialUser) {
      setFormData(initialUser);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        kullaniciAdi: '',
        sifre: '',
        adSoyad: '',
        rol: 'DİĞER SAĞLIK PERSONELİ',
        aktifMi: true
      });
    }
  }, [initialUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            {initialUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="userForm" onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                required
                value={formData.adSoyad}
                onChange={e => setFormData({ ...formData, adSoyad: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kullanıcı Adı</label>
              <input
                type="text"
                required
                value={formData.kullaniciAdi}
                onChange={e => setFormData({ ...formData, kullaniciAdi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Kısa isim veya yaka no"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
              <input
                type="text"
                required
                value={formData.sifre}
                onChange={e => setFormData({ ...formData, sifre: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Şifre belirleyin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-posta (Şifre Sıfırlama İçin)</label>
              <input
                type="email"
                value={formData.eposta || ''}
                onChange={e => setFormData({ ...formData, eposta: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Örn: ornek@email.com (İsteğe bağlı)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefon Numarası</label>
              <input
                type="tel"
                value={formData.telefon || ''}
                onChange={e => setFormData({ ...formData, telefon: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Örn: 05XX XXX XX XX (İsteğe bağlı)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kullanıcı Rolü</label>
              <select
                value={formData.rol}
                onChange={e => setFormData({ ...formData, rol: e.target.value as KullaniciRolu })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="Yönetici">Yönetici (Tam Yetkili)</option>
                <option value="AABT">AABT</option>
                <option value="ATT">ATT</option>
                <option value="DİĞER SAĞLIK PERSONELİ">DİĞER SAĞLIK PERSONELİ</option>
                <option value="DOKTOR">DOKTOR</option>
                <option value="SÜRÜCÜ">SÜRÜCÜ</option>
                <option value="Personel">Personel (Eski)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <input
                type="checkbox"
                id="aktifMi"
                checked={formData.aktifMi}
                onChange={e => setFormData({ ...formData, aktifMi: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-slate-300"
              />
              <label htmlFor="aktifMi" className="text-sm font-medium text-slate-700">
                Hesap Aktif (Giriş Yapabilir)
              </label>
            </div>

          </form>
        </div>

        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            İptal
          </button>
          <button
            type="submit"
            form="userForm"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
