import { Arac, MedikalEkipman, GunlukVardiyaKontrol, HaftalikMekanikBakim, AylikMedikalKontrol, ArizaKaydi, Kullanici, IstasyonNotu, IslemKaydi } from '../types';
import { INITIAL_VEHICLES, INITIAL_EQUIPMENT, INITIAL_CHECKLISTS, INITIAL_ISSUES, INITIAL_STATION_NOTES } from '../data/initialData';

const STORAGE_KEYS = {
  VEHICLES: 'amb_vehicles_v1',
  EQUIPMENT: 'amb_equipment_v1',
  CHECKLISTS_DAILY: 'amb_checklists_daily_v1',
  CHECKLISTS_WEEKLY: 'amb_checklists_weekly_v1',
  CHECKLISTS_MONTHLY: 'amb_checklists_monthly_v1',
  ISSUES: 'amb_issues_v1',
  USERS: 'amb_users_v1',
  STATION_NOTES: 'amb_station_notes_v1',
  STATION_ORDER: 'amb_station_order_v1',
  LOGS: 'amb_logs_v1',
};

export const StorageService = {
  getUsers(): Kullanici[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      const defaultUsers: Kullanici[] = [
        {
          id: 'u-1',
          kullaniciAdi: 'admin',
          sifre: 'admin123',
          adSoyad: 'Sistem Yöneticisi',
          rol: 'Yönetici',
          aktifMi: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveUsers(users: Kullanici[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getVehicles(): Arac[] {
    const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_VEHICLES;
    }
  },

  saveVehicles(vehicles: Arac[]): void {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  },

  getEquipment(): MedikalEkipman[] {
    const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(INITIAL_EQUIPMENT));
      return INITIAL_EQUIPMENT;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_EQUIPMENT;
    }
  },

  saveEquipment(equipment: MedikalEkipman[]): void {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
  },

  getDailyChecklists(): GunlukVardiyaKontrol[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHECKLISTS_DAILY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CHECKLISTS_DAILY, JSON.stringify(INITIAL_CHECKLISTS.gunluk));
      return INITIAL_CHECKLISTS.gunluk;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CHECKLISTS.gunluk;
    }
  },

  saveDailyChecklists(list: GunlukVardiyaKontrol[]): void {
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS_DAILY, JSON.stringify(list));
  },

  getWeeklyChecklists(): HaftalikMekanikBakim[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHECKLISTS_WEEKLY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CHECKLISTS_WEEKLY, JSON.stringify(INITIAL_CHECKLISTS.haftalik));
      return INITIAL_CHECKLISTS.haftalik;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CHECKLISTS.haftalik;
    }
  },

  saveWeeklyChecklists(list: HaftalikMekanikBakim[]): void {
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS_WEEKLY, JSON.stringify(list));
  },

  getMonthlyChecklists(): AylikMedikalKontrol[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHECKLISTS_MONTHLY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CHECKLISTS_MONTHLY, JSON.stringify(INITIAL_CHECKLISTS.aylik));
      return INITIAL_CHECKLISTS.aylik;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CHECKLISTS.aylik;
    }
  },

  saveMonthlyChecklists(list: AylikMedikalKontrol[]): void {
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS_MONTHLY, JSON.stringify(list));
  },

  getIssues(): ArizaKaydi[] {
    const data = localStorage.getItem(STORAGE_KEYS.ISSUES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(INITIAL_ISSUES));
      return INITIAL_ISSUES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ISSUES;
    }
  },

  saveIssues(issues: ArizaKaydi[]): void {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  },

  getStationNotes(): IstasyonNotu[] {
    const data = localStorage.getItem(STORAGE_KEYS.STATION_NOTES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STATION_NOTES, JSON.stringify(INITIAL_STATION_NOTES));
      return INITIAL_STATION_NOTES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_STATION_NOTES;
    }
  },

  saveStationNotes(notes: IstasyonNotu[]): void {
    localStorage.setItem(STORAGE_KEYS.STATION_NOTES, JSON.stringify(notes));
  },


  getLogs(): IslemKaydi[] {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },

  saveLogs(logs: IslemKaydi[]): void {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  getStationOrder(): string[] {
    const data = localStorage.getItem(STORAGE_KEYS.STATION_ORDER);
    return data ? JSON.parse(data) : [];
  },

  saveStationOrder(order: string[]): void {
    localStorage.setItem(STORAGE_KEYS.STATION_ORDER, JSON.stringify(order));
  },

  resetAllData(): void {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(INITIAL_EQUIPMENT));
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS_DAILY, JSON.stringify(INITIAL_CHECKLISTS.gunluk));
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS_WEEKLY, JSON.stringify(INITIAL_CHECKLISTS.haftalik));
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS_MONTHLY, JSON.stringify(INITIAL_CHECKLISTS.aylik));
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(INITIAL_ISSUES));
    localStorage.setItem(STORAGE_KEYS.STATION_NOTES, JSON.stringify(INITIAL_STATION_NOTES));
  }
};
