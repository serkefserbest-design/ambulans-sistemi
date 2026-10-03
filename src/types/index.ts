export type AciliyetSeviyesi = 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
export type ArizaDurumu = 'Arızada' | 'Tamirde' | 'Çözüldü';
export type AracDurumu = 'Aktif' | 'Görevde' | 'Bakımda' | 'Serviste' | 'Yedek';

export interface AracModeli {
  marka: string;
  model: string;
  yil: number;
}

export interface RuhsatBilgileri {
  sasiNo: string;
  motorNo: string;
  belgeSeriNo: string;
}

export const SIRNAK_ILCELER = [
  'Merkez',
  'İdil',
  'Cizre',
  'Beytüşşebap',
  'Güçlükonak',
  'Silopi',
  'Uludere',
  'Diğer'
];

export const ISTASYON_GRUPLARI: Record<string, string[]> = {
  'Merkez': [
    'ŞIRNAK MERKEZ 1 (7010)',
    'ŞIRNAK MERKEZ 2 (7020)',
    'ŞIRNAK MERKEZ 3 NOLU (7030)',
    'ŞIRNAK MERKEZ 4 NOLU (7040)',
    'ŞIRNAK MERKEZ 5 NOLU (7050)',
    'ŞIRNAK MERKEZ 6 NOLU (7060)',
    'ŞIRNAK MERKEZ 8 NOLU (7080)',
    'ŞIRNAK MERKEZ 7 NOLU UMKE (911)'
  ],
  'Cizre': [
    'CİZRE 1 NOLU (7110)',
    'CİZRE 2 NOLU (7120)',
    'CİZRE 3 NOLU (7130)',
    'CİZRE 4 NOLU (7140)',
    'CİZRE 5 NOLU (7150)',
    'CİZRE 6 NOLU (7160)'
  ],
  'Silopi': [
    'SİLOPİ 1 NOLU (7210)',
    'SİLOPİ 2 NOLU (7220)',
    'SİLOPİ 3 NOLU (7230)',
    'SİLOPİ 4 NOLU (7240)',
    'SİLOPİ 5 NOLU (7250)'
  ],
  'İdil': [
    'İDİL 1 NOLU (7310)',
    'İDİL 2 NOLU (7320)',
    'İDİL 3 NOLU (7330)'
  ],
  'Uludere': [
    'ULUDERE 1 NOLU (7410)',
    'ULUDERE 2 NOLU (7420)',
    'ULUDERE 3 NOLU (7430)'
  ],
  'Beytüşşebap': [
    'BEYTÜŞŞEBAP 1 NOLU (7510)',
    'BEYTÜŞŞEBAP 2 NOLU (7520)'
  ],
  'Güçlükonak': [
    'GÜÇLÜKONAK (7610)'
  ]
};

export const SIRNAK_TUM_ISTASYONLAR = Object.values(ISTASYON_GRUPLARI).flat();


export interface Arac {
  id: string;
  plaka: string;
  aracModeli: AracModeli;
  ruhsatBilgileri: RuhsatBilgileri;
  kaskoBaslangicTarihi?: string;
  kaskoBitisTarihi: string;
  trafikSigortasiBaslangicTarihi?: string;
  trafikSigortasiBitisTarihi: string;
  guncelKm: number;
  sonBakimKm?: number; // Son bakımın yapıldığı KM
  sonrakiBakimKm?: number; // Periyodik bakım KM'si
  durum: AracDurumu;
  istasyon: string;
  geciciIstasyon?: string; // Geçici görevlendirildiği istasyon
  ilce?: string;
  aylikKullanimSaati?: number; // Bu ay kaç saat kullanıldı
}

export interface MedikalEkipman {
  id: string;
  cihazAdi: string; // Defibrilatör, Ventilatör, Sedye, Oksijen Tüpü, İlk Yardım Seti
  seriNo: string; // S/N üretici kodu
  sonKalibrasyonTarihi: string; // YYYY-MM-DD
  gelecekKalibrasyonTarihi: string; // YYYY-MM-DD
  sonKullanmaTarihi: string; // YYYY-MM-DD (SKT sarf/test)
  bulunduguAracPlakasi: string; // Plaka veya 'Yedek Depo'
  kategori: 'Yaşam Destek' | 'Monitörizasyon' | 'Taşıma / Sabitleme' | 'Solunum / Gaz' | 'Sarf / İlkyardım';
  durum: 'Faal' | 'Kalibrasyon Gerekli' | 'Arızalı' | 'Bakımda';
}

export interface GunlukVardiyaKontrol {
  id: string;
  tarih: string;
  plaka: string;
  yakitDurumu: number; // 0 - 100
  temizlikDurumu: 'Mükemmel' | 'İyi' | 'Orta' | 'Yetersiz';
  tibbiMalzemeEksikYok: boolean;
  tibbiMalzemeEksikNotu: string;
  telsizCalisiyor: boolean;
  tepeLambasiCalisiyor: boolean;
  sirenCalisiyor: boolean;
  devredenPersonel: string;
  devralanPersonel: string;
  devredenImza: string;
  devralanImza: string;
  notlar?: string;
}

export interface HaftalikMekanikBakim {
  id: string;
  tarih: string;
  plaka: string;
  motorYagiSeviyesi: 'Uygun' | 'Eksik' | 'Kritik';
  silecekSuyu: 'Tam' | 'Eksik';
  frenler: 'Sorunsuz' | 'Kontrol Gerekli' | 'Kritik';
  lastikBasinclariPsi: {
    onSol: number;
    onSag: number;
    arkaSol: number;
    arkaSag: number;
  };
  lastikDisDerinligiMm: number;
  bakimiYapanPersonel: string;
  notlar?: string;
}

export interface AylikMedikalKontrol {
  id: string;
  tarih: string;
  plaka: string;
  bataryaSaglikDurumu: 'Mükemmel (%100)' | 'İyi (%80-%99)' | 'Değişim Gerekli (<%80)';
  kalibrasyonSureleriKontrolEdildi: boolean;
  oksijenTupuDolulukBari: number; // 0 - 250 Bar
  kontrolEdenPersonel: string;
  notlar?: string;
}

export type KontrolFormTipi = 'gunluk' | 'haftalik' | 'aylik';

export interface ArizaKaydi {
  id: string;
  kayitNo: string; // Örn: #00124
  ilgiliTip: 'Araç' | 'Ekipman' | 'Telsiz';
  ilgiliHedef: string; // Plaka veya Cihaz S/N
  arizaTanimi: string;
  aciliyetSeviyesi: AciliyetSeviyesi;
  bildirenPersonel: string;
  olusturulmaTarihi: string; // GG/AA/YYYY SS:DD
  sonDurum: ArizaDurumu;
  cozumNotu?: string;
  cozulmeTarihi?: string;
  ekDosya?: string; // Base64 fotoğraf veya belge
}

export interface FiloIstatistikleri {
  toplamArac: number;
  aktifArac: number;
  bakimdakiArac: number;
  bakimiYaklasanGeciken: number; // KM bazlı periyodik bakım uyarısı
  toplamEkipman: number;
  kalibrasyonYaklasan: number;
  bekleyenAriza: number;
  kritikAriza: number;
  sigortasiYaklasan: number;
}

export type KullaniciRolu = 'Yönetici' | 'Personel' | 'AABT' | 'ATT' | 'DİĞER SAĞLIK PERSONELİ' | 'DOKTOR' | 'SÜRÜCÜ';

export interface Kullanici {
  id: string;
  kullaniciAdi: string;
  sifre: string;
  adSoyad: string;
  rol: KullaniciRolu;
  aktifMi: boolean;
  eposta?: string;
  telefon?: string;
}

export type NotTipi = 'Uyarı' | 'Eksik' | 'Görev' | 'Bilgi';

export interface IstasyonNotu {
  id: string;
  istasyonAdi: string;
  mesaj: string;
  tip: NotTipi;
  tarih: string;
  ekleyen: string;
}

export type IslemTipi = 'Ekleme' | 'Güncelleme' | 'Silme' | 'Sistem' | 'Giriş';
export type IslemHedefi = 'Araç' | 'Bildirim' | 'İstasyon Notu' | 'Kullanıcı' | 'Ekipman' | 'Telsiz' | 'Kontrol Listesi' | 'Oturum' | 'Diğer';

export interface IslemKaydi {
  id: string;
  kullaniciAdi: string;
  islemTipi: IslemTipi;
  hedef: IslemHedefi;
  detay: string;
  tarih: string; // ISO datetime
}

export interface TelsizKontrol {
  id: string;
  tarih: string;
  istasyon: string;
  yapanPersonel: string;
  elTelsizi: 'Sağlam' | 'Arızalı';
  sabitTelsiz: 'Sağlam' | 'Arızalı';
  aracTelsizi: 'Sağlam' | 'Arızalı';
  notlar?: string;
}
