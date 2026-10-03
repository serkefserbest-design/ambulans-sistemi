import React, { useState } from 'react';
import { ArizaKaydi, ArizaDurumu, AciliyetSeviyesi, Arac, MedikalEkipman, Kullanici } from '../types';
import {
  AlertTriangle,
  Plus,
  Search,
  Trash2,
  Edit2,
  LayoutGrid,
  List,
} from 'lucide-react';

interface IssuesViewProps {
  issues: ArizaKaydi[];
  onAddIssue: () => void;
  onEditIssue: (issue: ArizaKaydi) => void;
  onDeleteIssue: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: ArizaDurumu) => void;
  currentUser: Kullanici;
}

export const IssuesView: React.FC<IssuesViewProps> = ({
  issues,
  onAddIssue,
  onEditIssue,
  onDeleteIssue,
  onUpdateStatus,
  currentUser,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('Tümü');

    const filteredIssues = issues.filter((iss) => {
    const matchesUser = currentUser.rol === 'Yönetici' || iss.bildirenPersonel === currentUser.adSoyad;
    
    const matchesSearch =
      iss.kayitNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iss.ilgiliHedef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iss.arizaTanimi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iss.bildirenPersonel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'Tümü' || iss.aciliyetSeviyesi === filterPriority;
    
    return matchesSearch && matchesPriority && matchesUser;
  });

  const beklemedeList = filteredIssues.filter((i) => i.sonDurum === 'Arızada');
  const tamirdeList = filteredIssues.filter((i) => i.sonDurum === 'Tamirde');
  const cozulduList = filteredIssues.filter((i) => i.sonDurum === 'Çözüldü');

  const getPriorityBadge = (p: AciliyetSeviyesi) => {
    switch (p) {
      case 'Kritik':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-800 border border-red-300">🔴 KRİTİK</span>;
      case 'Yüksek':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">🟠 YÜKSEK</span>;
      case 'Orta':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">🔵 ORTA</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">🟢 DÜŞÜK</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Hızlı Ekle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            4. Arıza / Bildirim Kayıtları Canlı Panosu (Log)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Teknik aksaklıkların, araç arızalarının ve medikal ekipman problemlerinin gerçek zamanlı operasyon panosu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Görünüm Değiştirici */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban Pano Görünümü"
            >
              <LayoutGrid className="w-4 h-4" />
              Pano
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Liste/Tablo Görünümü"
            >
              <List className="w-4 h-4" />
              Tablo
            </button>
          </div>

          {currentUser.rol === 'Yönetici' && (
            <button
              onClick={() => {
                import('../utils/pdfExport').then((m) => m.exportIssuesToPdf(issues));
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 text-xs md:text-sm cursor-pointer"
            >
              PDF Rapor Al
            </button>
          )}

          <button
            onClick={onAddIssue}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 text-xs md:text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Yeni Arıza Bildir
          </button>
        </div>
      </div>

      {/* Arama ve Aciliyet Filtresi */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Kayıt no, plaka, cihaz S/N, arıza tanımı veya personel adı ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Aciliyet:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 text-slate-700"
          >
            <option value="Tümü">Tüm Seviyeler</option>
            <option value="Kritik">🔴 Kritik</option>
            <option value="Yüksek">🟠 Yüksek</option>
            <option value="Orta">🔵 Orta</option>
            <option value="Düşük">🟢 Düşük</option>
          </select>
        </div>
      </div>

      {/* KANBAN PANO GÖRÜNÜMÜ */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SÜTUN 1: 🟡 BEKLEMEDE */}
          <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="font-bold text-slate-800 text-sm">Arızada (Müdahale Bekliyor)</h3>
              </div>
              <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full font-bold text-xs">
                {beklemedeList.length}
              </span>
            </div>

            <div className="space-y-3">
              {beklemedeList.length === 0 ? (
                <div className="bg-white/60 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 text-xs">
                  Bekleyen yeni arıza yok
                </div>
              ) : (
                beklemedeList.map((iss) => (
                  <div
                    key={iss.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-amber-400 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded">
                        {iss.kayitNo}
                      </span>
                      {getPriorityBadge(iss.aciliyetSeviyesi)}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                        {iss.ilgiliTip === 'Araç' ? '🚑 Ambulans:' : '⚡ Ekipman:'}
                        <span className="font-mono text-slate-700">{iss.ilgiliHedef}</span>
                      </div>
                      <p className="text-xs text-slate-700 line-clamp-3 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2">
                        "{iss.arizaTanimi}"
                      </p>
                      {iss.ekDosya && (
                        <div className="w-full h-24 overflow-hidden rounded-lg border border-slate-200">
                          <img src={iss.ekDosya} alt="Arıza fotoğrafı" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between items-center border-t border-slate-100 pt-2">
                      <span>{iss.bildirenPersonel}</span>
                      <span className="font-mono text-[10px]">{iss.olusturulmaTarihi}</span>
                    </div>

                    {/* Hızlı Geçiş Butonu */}
                    {currentUser.rol === 'Yönetici' && (
                      <div className="flex items-center justify-between pt-1 gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditIssue(iss)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            title="Düzenle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteIssue(iss.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => onUpdateStatus(iss.id, 'Tamirde')}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          Tamire Al 🔵
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SÜTUN 2: 🔵 TAMİRDE */}
          <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-bold text-slate-800 text-sm">Tamirde (Serviste / Sanayide)</h3>
              </div>
              <span className="px-2 py-0.5 bg-blue-200 text-blue-900 rounded-full font-bold text-xs">
                {tamirdeList.length}
              </span>
            </div>

            <div className="space-y-3">
              {tamirdeList.length === 0 ? (
                <div className="bg-white/60 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 text-xs">
                  Şu anda tamirde olan araç/ekipman yok
                </div>
              ) : (
                tamirdeList.map((iss) => (
                  <div
                    key={iss.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded">
                        {iss.kayitNo}
                      </span>
                      {getPriorityBadge(iss.aciliyetSeviyesi)}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                        {iss.ilgiliTip === 'Araç' ? '🚑 Ambulans:' : '⚡ Ekipman:'}
                        <span className="font-mono text-slate-700">{iss.ilgiliHedef}</span>
                      </div>
                      <p className="text-xs text-slate-700 line-clamp-3 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2">
                        "{iss.arizaTanimi}"
                      </p>
                      {iss.ekDosya && (
                        <div className="w-full h-24 overflow-hidden rounded-lg border border-slate-200 mb-2">
                          <img src={iss.ekDosya} alt="Arıza fotoğrafı" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {iss.cozumNotu && (
                        <p className="text-[11px] text-blue-700 bg-blue-50 p-2 rounded-lg mt-2 font-medium">
                          🛠️ {iss.cozumNotu}
                        </p>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between items-center border-t border-slate-100 pt-2">
                      <span>{iss.bildirenPersonel}</span>
                      <span className="font-mono text-[10px]">{iss.olusturulmaTarihi}</span>
                    </div>

                    {currentUser.rol === 'Yönetici' && (
                      <div className="flex items-center justify-between pt-1 gap-2">
                        <button
                          onClick={() => onUpdateStatus(iss.id, 'Arızada')}
                          className="text-[11px] text-slate-500 hover:text-slate-800 underline"
                        >
                          Beklemeye Al
                        </button>

                        <button
                          onClick={() => onUpdateStatus(iss.id, 'Çözüldü')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          Çözüldü Olarak Kapat 🟢
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SÜTUN 3: 🟢 ÇÖZÜLDÜ */}
          <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-slate-800 text-sm">Çözüldü (Sorun Giderildi)</h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full font-bold text-xs">
                {cozulduList.length}
              </span>
            </div>

            <div className="space-y-3">
              {cozulduList.length === 0 ? (
                <div className="bg-white/60 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 text-xs">
                  Henüz çözülmüş kayıt yok
                </div>
              ) : (
                cozulduList.map((iss) => (
                  <div
                    key={iss.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-400 transition-all opacity-90"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded">
                        {iss.kayitNo}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        🟢 ÇÖZÜLDÜ
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                        {iss.ilgiliTip === 'Araç' ? '🚑 Ambulans:' : '⚡ Ekipman:'}
                        <span className="font-mono text-slate-700">{iss.ilgiliHedef}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg">
                        "{iss.arizaTanimi}"
                      </p>
                      {iss.cozumNotu && (
                        <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg mt-2 font-medium">
                          ✅ {iss.cozumNotu}
                        </p>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 flex justify-between items-center border-t border-slate-100 pt-2">
                      <span>Bildiren: {iss.bildirenPersonel}</span>
                      <span>{iss.cozulmeTarihi || iss.olusturulmaTarihi}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TABLO GÖRÜNÜMÜ */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Kayıt No</th>
                  <th className="py-3.5 px-4">İlgili Araç / Ekipman</th>
                  <th className="py-3.5 px-4">Arıza Tanımı</th>
                  <th className="py-3.5 px-4">Aciliyet</th>
                  <th className="py-3.5 px-4">Bildiren Personel</th>
                  <th className="py-3.5 px-4">Tarih</th>
                  <th className="py-3.5 px-4">Son Durum</th>
                  <th className="py-3.5 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((iss) => (
                    <tr key={iss.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">{iss.kayitNo}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 font-mono">{iss.ilgiliHedef}</td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs">{iss.arizaTanimi}</td>
                      <td className="py-3.5 px-4">{getPriorityBadge(iss.aciliyetSeviyesi)}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{iss.bildirenPersonel}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{iss.olusturulmaTarihi}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            iss.sonDurum === 'Arızada'
                              ? 'bg-amber-100 text-amber-800'
                              : iss.sonDurum === 'Tamirde'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {iss.sonDurum === 'Arızada' && '🟡 Arızada'}
                          {iss.sonDurum === 'Tamirde' && '🔵 Tamirde'}
                          {iss.sonDurum === 'Çözüldü' && '🟢 Çözüldü'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {currentUser.rol === 'Yönetici' && (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onEditIssue(iss)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Düzenle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteIssue(iss.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
