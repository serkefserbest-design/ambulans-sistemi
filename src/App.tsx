import React, { useState, useEffect } from 'react';
import {
  Arac,
  MedikalEkipman,
  GunlukVardiyaKontrol,
  HaftalikMekanikBakim,
  AylikMedikalKontrol,
  ArizaKaydi,
  TelsizKontrol,
  ArizaDurumu,
  KontrolFormTipi,
  Kullanici,
  IstasyonNotu,
  IslemKaydi,
  IslemTipi,
  IslemHedefi,
} from './types';
import { StorageService } from './services/storage';
import { AuthService } from './services/auth';
import { getDaysRemaining } from './utils/dateUtils';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { VehiclesView } from './components/VehiclesView';
import { StationsView } from './components/StationsView';
import { EquipmentView } from './components/EquipmentView';
import { TelsizView } from './components/TelsizView';
import { IssuesView } from './components/IssuesView';
import { UsersView } from './components/UsersView';
import { VehicleModal } from './components/VehicleModal';
import { EquipmentModal } from './components/EquipmentModal';
import { IssueModal } from './components/IssueModal';
import { ChecklistModal } from './components/ChecklistModal';
import { Login } from './components/Login';
import { UserModal } from './components/UserModal';
import { SystemLogsView } from './components/SystemLogsView';
import { GuideView } from './components/GuideView';

export function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState<Kullanici | null>(() => AuthService.getCurrentUser());

  // State from LocalStorage
  const [users, setUsers] = useState<Kullanici[]>(() => StorageService.getUsers());
  const [vehicles, setVehicles] = useState<Arac[]>(() => StorageService.getVehicles());
  const [equipment, setEquipment] = useState<MedikalEkipman[]>(() => StorageService.getEquipment());
  const [dailyChecklists, setDailyChecklists] = useState<GunlukVardiyaKontrol[]>(() =>
    StorageService.getDailyChecklists()
  );
  const [weeklyChecklists, setWeeklyChecklists] = useState<HaftalikMekanikBakim[]>(() =>
    StorageService.getWeeklyChecklists()
  );
  const [monthlyChecklists, setMonthlyChecklists] = useState<AylikMedikalKontrol[]>(() =>
    StorageService.getMonthlyChecklists()
  );
  const [issues, setIssues] = useState<ArizaKaydi[]>(() => StorageService.getIssues());
  const [telsizKontrolleri, setTelsizKontrolleri] = useState<TelsizKontrol[]>(() => { const data = localStorage.getItem('ambulance_telsiz'); return data ? JSON.parse(data) : []; });
  
  useEffect(() => { localStorage.setItem('ambulance_telsiz', JSON.stringify(telsizKontrolleri)); }, [telsizKontrolleri]);
  const [stationNotes, setStationNotes] = useState<IstasyonNotu[]>(() => StorageService.getStationNotes());
  const [stationOrder, setStationOrder] = useState<string[]>(() => StorageService.getStationOrder());
  const [logs, setLogs] = useState<IslemKaydi[]>(() => StorageService.getLogs());

  // UI Navigation State
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const user = AuthService.getCurrentUser();
    return user?.rol === 'Yönetici' ? 'dashboard' : 'telsiz';
  });
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  // Modal States
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Arac | null>(null);

  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState<boolean>(false);
  const [editingEquipment, setEditingEquipment] = useState<MedikalEkipman | null>(null);

  const [isIssueModalOpen, setIsIssueModalOpen] = useState<boolean>(false);
  const [editingIssue, setEditingIssue] = useState<ArizaKaydi | null>(null);

  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState<boolean>(false);
  const [defaultChecklistType, setDefaultChecklistType] = useState<KontrolFormTipi>('gunluk');

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<Kullanici | null>(null);

  // Sync to LocalStorage whenever state changes
  useEffect(() => {
    StorageService.saveUsers(users);
  }, [users]);

  useEffect(() => {
    StorageService.saveVehicles(vehicles);
  }, [vehicles]);

  useEffect(() => {
    StorageService.saveEquipment(equipment);
  }, [equipment]);

  useEffect(() => {
    StorageService.saveDailyChecklists(dailyChecklists);
  }, [dailyChecklists]);

  useEffect(() => {
    StorageService.saveWeeklyChecklists(weeklyChecklists);
  }, [weeklyChecklists]);

  useEffect(() => {
    StorageService.saveMonthlyChecklists(monthlyChecklists);
  }, [monthlyChecklists]);

  useEffect(() => {
    StorageService.saveIssues(issues);
  }, [issues]);

  // Urgent / Critical Alerts Count for badges
  const urgentIssuesCount = issues.filter(
    (i) => (i.aciliyetSeviyesi === 'Kritik' || i.aciliyetSeviyesi === 'Yüksek') && i.sonDurum !== 'Çözüldü'
  ).length;

  const urgentCalCount = equipment.filter((eq) => {
    const days = getDaysRemaining(eq.gelecekKalibrasyonTarihi);
    return days <= 15 || eq.durum === 'Kalibrasyon Gerekli';
  }).length;

  const urgentInsCount = vehicles.filter((v) => {
    const kDays = getDaysRemaining(v.kaskoBitisTarihi);
    const tDays = getDaysRemaining(v.trafikSigortasiBitisTarihi);
    return kDays <= 15 || tDays <= 15;
  }).length;

  const urgentMaintCount = vehicles.filter(v => v.sonrakiBakimKm && (v.sonrakiBakimKm - v.guncelKm <= 1500)).length;

  const totalUrgentCount = urgentIssuesCount + urgentCalCount + urgentInsCount + urgentMaintCount;

  // Handlers for Auth
  
  const addLog = (islemTipi: IslemTipi, hedef: IslemHedefi, detay: string) => {
    if (!currentUser) return;
    const newLog: IslemKaydi = {
      id: crypto.randomUUID(),
      kullaniciAdi: currentUser.adSoyad,
      islemTipi,
      hedef,
      detay,
      tarih: new Date().toISOString()
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    StorageService.saveLogs(updated);
  };

  const handleLogin = (user: Kullanici) => {
    AuthService.login(user);
    setCurrentUser(user);
    setCurrentTab(user.rol === 'Yönetici' ? 'dashboard' : 'telsiz');
    addLog('Giriş', 'Oturum', `${user.adSoyad} sisteme giriş yaptı.`);
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setCurrentTab('dashboard');
  };

  // Handlers for Users
  
  const handleDeleteUser = (id: string) => {
    if (currentUser?.id === id) {
      alert("Kendi hesabınızı silemezsiniz.");
      return;
    }
    const userToDelete = users.find((u) => u.id === id);
    if (userToDelete) {
      const confirmed = window.confirm(userToDelete.adSoyad + " adlı kullanıcıyı tamamen silmek istediğinize emin misiniz?");
      if (confirmed) {
        setUsers(users.filter((u) => u.id !== id));
        addLog('Silme', 'Kullanıcı', userToDelete.adSoyad + " adlı kullanıcı sistemden silindi.");
      }
    }
  };

  const handleSaveUser = (user: Kullanici) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
      addLog('Güncelleme', 'Kullanıcı', `${user.adSoyad} adlı kullanıcının bilgileri güncellendi.`);
      // If the edited user is the current user, update session
      if (currentUser?.id === user.id) {
        AuthService.login(user);
        setCurrentUser(user);
      }
    } else {
      setUsers([...users, user]);
      addLog('Ekleme', 'Kullanıcı', `${user.adSoyad} adlı yeni kullanıcı eklendi.`);
    }
  };

  // Handlers for Vehicles
  const handleSaveVehicle = (veh: Arac) => {
    if (editingVehicle) {
      setVehicles(vehicles.map((v) => (v.id === veh.id ? veh : v)));
      addLog('Güncelleme', 'Araç', `${veh.plaka} plakalı aracın bilgileri güncellendi.`);
    } else {
      setVehicles([veh, ...vehicles]);
      addLog('Ekleme', 'Araç', `${veh.plaka} plakalı yeni araç sisteme eklendi.`);
    }
  };

  
  const handleRemoveTemporaryAssignment = (vehicleId: string) => {
    setVehicles(vehicles.map(v => {
      if (v.id === vehicleId) {
        addLog('Güncelleme', 'Araç', `${v.plaka} plakalı aracın geçici görevlendirmesi iptal edildi.`);
        return { ...v, geciciIstasyon: '' };
      }
      return v;
    }));
  };

  const handleDeleteVehicle = (id: string) => {
    const vToDelete = vehicles.find((v) => v.id === id);
    setVehicles(vehicles.filter((v) => v.id !== id));
    if(vToDelete) addLog('Silme', 'Araç', `${vToDelete.plaka} plakalı araç sistemden silindi.`);
  };

  const handleUpdateKm = (id: string, newKm: number) => {
    const vToUpdate = vehicles.find((v) => v.id === id);
    setVehicles(vehicles.map((v) => (v.id === id ? { ...v, guncelKm: newKm } : v)));
    if(vToUpdate) addLog('Güncelleme', 'Araç', `${vToUpdate.plaka} plakalı aracın KM bilgisi güncellendi: ${newKm} KM.`);
  };

  const handleSwapVehicle = (brokenId: string, backupId: string) => {
    const broken = vehicles.find(v => v.id === brokenId);
    const backup = vehicles.find(v => v.id === backupId);
    if (!broken || !backup) return;

    const brokenStation = broken.istasyon;
    const brokenIlce = broken.ilce;
    
    setVehicles(vehicles.map(v => {
      if (v.id === backupId) {
        return { ...v, durum: 'Aktif', istasyon: brokenStation, ilce: brokenIlce };
      }
      if (v.id === brokenId) {
        return { ...v, durum: 'Serviste', istasyon: 'Merkez Bakım Onarım', ilce: 'Şırnak Merkez' };
      }
      return v;
    }));
    addLog('Güncelleme', 'Araç', `${broken.plaka} plakalı araç servise alındı, yerine ${backup.plaka} plakalı yedek araç tahsis edildi.`);
  };

  const handleAssignStation = (vehicleId: string, newStation: string, newIlce?: string) => {
    const vToAssign = vehicles.find((v) => v.id === vehicleId);
    const updated = vehicles.map(v => (v.id === vehicleId ? { ...v, istasyon: newStation, ilce: newIlce } : v));
    if(vToAssign) addLog('Güncelleme', 'Araç', `${vToAssign.plaka} plakalı araç ${newIlce || ''} - ${newStation} istasyonuna atandı.`);
    setVehicles(updated);
    StorageService.saveVehicles(updated);
  };

  const handleAddStationNote = (note: IstasyonNotu) => {
    const updated = [note, ...stationNotes];
    addLog('Ekleme', 'İstasyon Notu', `${note.istasyonAdi} istasyonuna yeni not eklendi: ${note.mesaj}`);
    setStationNotes(updated);
    StorageService.saveStationNotes(updated);
  };

  const handleDeleteStationNote = (id: string) => {
    const noteToDelete = stationNotes.find(n => n.id === id);
    const updated = stationNotes.filter(n => n.id !== id);
    if(noteToDelete) addLog('Silme', 'İstasyon Notu', `${noteToDelete.istasyonAdi} istasyonundaki bir not silindi.`);
    setStationNotes(updated);
    StorageService.saveStationNotes(updated);
  };

  const handleUpdateStationOrder = (newOrder: string[]) => {
    setStationOrder(newOrder);
    StorageService.saveStationOrder(newOrder);
  };

  // Handlers for Equipment
  const handleSaveEquipment = (eq: MedikalEkipman) => {
    if (editingEquipment) {
      setEquipment(equipment.map((e) => (e.id === eq.id ? eq : e)));
      addLog('Güncelleme', 'Ekipman', `${eq.cihazAdi} ekipmanı güncellendi.`);
    } else {
      setEquipment([eq, ...equipment]);
      addLog('Ekleme', 'Ekipman', `${eq.cihazAdi} adlı yeni ekipman eklendi.`);
    }
  };

  const handleDeleteEquipment = (id: string) => {
    const eqToDelete = equipment.find((e) => e.id === id);
    setEquipment(equipment.filter((e) => e.id !== id));
    if(eqToDelete) addLog('Silme', 'Ekipman', `${eqToDelete.cihazAdi} ekipmanı silindi.`);
  };

  // Handlers for Issues
  const handleSaveIssue = (iss: ArizaKaydi) => {
    if (editingIssue) {
      setIssues(issues.map((i) => (i.id === iss.id ? iss : i)));
      addLog('Güncelleme', 'Bildirim', `Arıza/Bildirim kaydı güncellendi (İlgili: ${iss.ilgiliHedef}).`);
    } else {
      setIssues([iss, ...issues]);
      addLog('Ekleme', 'Bildirim', `Yeni arıza/bildirim eklendi (İlgili: ${iss.ilgiliHedef}).`);
    }
  };

  const handleSaveTelsizKontrol = (kontrol: TelsizKontrol) => {
    setTelsizKontrolleri([kontrol, ...telsizKontrolleri]);
    addLog('Ekleme', 'Telsiz', `${kontrol.istasyon} telsiz kontrolü yapıldı.`);

    // Otomatik Arıza Oluşturma
    const broken = [];
    if (kontrol.elTelsizi === 'Arızalı') broken.push('El Telsizi');
    if (kontrol.sabitTelsiz === 'Arızalı') broken.push('Sabit Telsiz');
    if (kontrol.aracTelsizi === 'Arızalı') broken.push('Araç Telsizi');

    if (broken.length > 0) {
      const newIssue: ArizaKaydi = {
        id: Date.now().toString() + '_auto',
        kayitNo: `#TLZ-${Math.floor(Math.random() * 10000)}`,
        ilgiliTip: 'Ekipman',
        ilgiliHedef: `${kontrol.istasyon} Telsizleri`,
        arizaTanimi: `Otomatik Kayıt: ${broken.join(', ')} arızalı.`,
        aciliyetSeviyesi: 'Kritik',
        bildirenPersonel: kontrol.yapanPersonel,
        olusturulmaTarihi: kontrol.tarih,
        sonDurum: 'Arızada',
        cozumNotu: kontrol.notlar || ''
      };
      setIssues([newIssue, ...issues]);
    }
  };

  const handleDeleteIssue = (id: string) => {
    const iToDelete = issues.find((i) => i.id === id);
    setIssues(issues.filter((i) => i.id !== id));
    if(iToDelete) addLog('Silme', 'Bildirim', `Bir arıza/bildirim kaydı silindi (İlgili: ${iToDelete.ilgiliHedef}).`);
  };

  const handleUpdateIssueStatus = (id: string, newStatus: ArizaDurumu) => {
    const iss = issues.find(i => i.id === id);
    if (iss) addLog('Güncelleme', 'Bildirim', `Arıza/Bildirim durumu güncellendi: ${newStatus}`);
    setIssues(
      issues.map((i) => {
        if (i.id === id) {
          return {
            ...i,
            sonDurum: newStatus,
            cozulmeTarihi: newStatus === 'Çözüldü' ? new Date().toLocaleDateString('tr-TR') : i.cozulmeTarihi,
          };
        }
        return i;
      })
    );
  };

  // Handlers for Checklists
  const handleSaveDaily = (item: GunlukVardiyaKontrol) => {
    setDailyChecklists([item, ...dailyChecklists]);
    addLog('Ekleme', 'Kontrol Listesi', `${item.plaka} plakalı araç için Günlük Vardiya Kontrolü dolduruldu.`);
  };

  const handleSaveWeekly = (item: HaftalikMekanikBakim) => {
    setWeeklyChecklists([item, ...weeklyChecklists]);
  };

  const handleSaveMonthly = (item: AylikMedikalKontrol) => {
    setMonthlyChecklists([item, ...monthlyChecklists]);
  };

  const handleResetData = () => {
    StorageService.resetAllData();
    setVehicles(StorageService.getVehicles());
    setEquipment(StorageService.getEquipment());
    setDailyChecklists(StorageService.getDailyChecklists());
    setWeeklyChecklists(StorageService.getWeeklyChecklists());
    setMonthlyChecklists(StorageService.getMonthlyChecklists());
    setIssues(StorageService.getIssues());
  };

  const visibleIssues = currentUser?.rol === 'Yönetici' ? issues : issues.filter(i => i.bildirenPersonel === currentUser?.adSoyad);

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Genel Durum & Şırnak 112 Komuta Kontrol';
      case 'vehicles':
        return 'Araç Kayıtları ve Filo Yönetimi';
      case 'stations':
        return 'İstasyonlarım ve Araç Dağılımı';
      case 'telsiz':
        return 'Vardiya & Telsiz Nöbet Devir Kontrolü';
      case 'equipment':
        return 'Medikal Ekipman ve Kalibrasyon Listesi';
      case 'issues':
        return 'Canlı Arıza ve Bildirim Panosu (Log)';
      default:
        return 'Ambulans Yönetim Sistemi';
    }
  };

  const handlePasswordReset = (userId: string, newPassword: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, sifre: newPassword } : u));
  };

  
  const handleRegisterNewUser = (newUser: Kullanici) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);
    // Log atmak için geçici olarak currentUser varmış gibi yapamayız çünkü login deðil,
    // o yüzden logsuz kaydediyoruz veya sistem logu ekleriz.
  };

  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} onPasswordReset={handlePasswordReset} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Masaüstü Sidebar */}
      <div className="hidden md:flex h-full">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onResetData={handleResetData}
          urgentCount={totalUrgentCount}
          isAdmin={currentUser.rol === 'Yönetici'}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobil Sidebar Drawer */}
      {isSidebarOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsSidebarOpenMobile(false)}
          />
          <div className="relative z-10 w-64 h-full bg-slate-900">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setIsSidebarOpenMobile(false);
              }}
              onResetData={handleResetData}
              urgentCount={totalUrgentCount}
              isAdmin={currentUser.rol === 'Yönetici'}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Ana İçerik Bölgesi */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpenMobile(true)}
          urgentCount={totalUrgentCount}
          onOpenNewIssue={() => {
            setEditingIssue(null);
            setIsIssueModalOpen(true);
          }}
          currentTabName={getTabTitle()}
          currentUser={currentUser}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-16">
          
          {currentTab === 'stations' && (
            <StationsView vehicles={vehicles} currentUser={currentUser} onNavigateToVehicles={() => setCurrentTab('vehicles')} onRemoveTemporaryAssignment={handleRemoveTemporaryAssignment} stationNotes={stationNotes} onAddNote={handleAddStationNote} onDeleteNote={handleDeleteStationNote} />
          )}

          {currentTab === 'dashboard' && currentUser.rol === 'Yönetici' && (
            <Dashboard
              vehicles={vehicles}
              equipment={equipment}
              issues={visibleIssues}
              dailyChecklists={dailyChecklists} telsizKontrolleri={telsizKontrolleri}
              onNavigate={setCurrentTab}
              onOpenNewIssue={() => {
                setEditingIssue(null);
                setIsIssueModalOpen(true);
              }}
              onOpenNewChecklist={() => {
                setDefaultChecklistType('gunluk');
                setIsChecklistModalOpen(true);
              }}
              onOpenNewVehicle={() => {
                setEditingVehicle(null);
                setIsVehicleModalOpen(true);
              }}
              onEditVehicle={(v) => {
                setEditingVehicle(v);
                setIsVehicleModalOpen(true);
              }}
              onEditIssue={(i) => {
                setEditingIssue(i);
                setIsIssueModalOpen(true);
              }}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'vehicles' && (
            <VehiclesView
              vehicles={vehicles}
              equipment={equipment}
              issues={issues}
              onAddVehicle={() => {
                setEditingVehicle(null);
                setIsVehicleModalOpen(true);
              }}
              onEditVehicle={(veh) => {
                setEditingVehicle(veh);
                setIsVehicleModalOpen(true);
              }}
              onDeleteVehicle={handleDeleteVehicle}
              onUpdateKm={handleUpdateKm}
              onSwapVehicle={handleSwapVehicle}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'telsiz' && (
            <TelsizView
              telsizKontrolleri={telsizKontrolleri}
              currentUser={currentUser}
              onSaveKontrol={handleSaveTelsizKontrol}
            />
          )}

          {currentTab === 'equipment' && (
            <EquipmentView
              equipment={equipment}
              vehicles={vehicles}
              onAddEquipment={() => {
                setEditingEquipment(null);
                setIsEquipmentModalOpen(true);
              }}
              onEditEquipment={(eq) => {
                setEditingEquipment(eq);
                setIsEquipmentModalOpen(true);
              }}
              onDeleteEquipment={handleDeleteEquipment}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'issues' && (
            <IssuesView
              issues={visibleIssues}
              onAddIssue={() => {
                setEditingIssue(null);
                setIsIssueModalOpen(true);
              }}
              onEditIssue={(iss) => {
                setEditingIssue(iss);
                setIsIssueModalOpen(true);
              }}
              onDeleteIssue={handleDeleteIssue}
              onUpdateStatus={handleUpdateIssueStatus}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'users' && currentUser.rol === 'Yönetici' && (
            <UsersView
              users={users}
              onAddUser={() => {
                setEditingUser(null);
                setIsUserModalOpen(true);
              }}
              onEditUser={(u) => {
                setEditingUser(u);
                setIsUserModalOpen(true);
              }}
              onDeleteUser={handleDeleteUser}
              currentUserId={currentUser.id}
            />
          )}

          {currentTab === 'logs' && currentUser.rol === 'Yönetici' && (
            <SystemLogsView logs={logs} />
          )}

          {currentTab === 'guide' && (
            <GuideView />
          )}


        </main>
      </div>

      {/* MODALLAR */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSave={handleSaveVehicle}
        initialVehicle={editingVehicle}
      />

      <EquipmentModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        onSave={handleSaveEquipment}
        vehicles={vehicles}
        initialEquipment={editingEquipment}
      />

      <IssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSave={handleSaveIssue}
        vehicles={vehicles}
        equipment={equipment}
        initialIssue={editingIssue}
        currentUser={currentUser!}
      />

      <ChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
        vehicles={vehicles}
        onSaveDaily={handleSaveDaily}
        onSaveWeekly={handleSaveWeekly}
        onSaveMonthly={handleSaveMonthly}
        defaultType={defaultChecklistType}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        initialUser={editingUser}
      />
    </div>
  );
}

export default App;
