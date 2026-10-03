import React from 'react';
import { Kullanici, KullaniciRolu } from '../types';
import { Users, Plus, Edit2, ShieldAlert, CheckCircle2, Ban, Trash2 } from 'lucide-react';

interface UsersViewProps {
  users: Kullanici[];
  onAddUser: () => void;
  onEditUser: (user: Kullanici) => void;
  onDeleteUser: (id: string) => void;
  currentUserId: string;
}

export function UsersView({ users, onAddUser, onEditUser, onDeleteUser, currentUserId }: UsersViewProps) {
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Kullanıcı Yönetimi</h2>
          <p className="text-sm text-slate-500">Sisteme giriş yapabilen yönetici ve personelleri yönetin.</p>
        </div>
        <button
          onClick={onAddUser}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Yeni Kullanıcı
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Ad Soyad</th>
                <th className="px-6 py-4">Kullanıcı Adı</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {user.adSoyad}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">
                      {user.kullaniciAdi}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.rol === 'Yönetici' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.rol === 'Yönetici' ? <ShieldAlert className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.aktifMi ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Ban className="w-4 h-4" />
                        Pasif
                      </span>
                    )}
                  </td>
<td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onEditUser(user)}
                      className="text-slate-400 hover:text-blue-600 p-1 transition-colors mr-2"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Sistemde henüz kayıtlı kullanıcı yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
