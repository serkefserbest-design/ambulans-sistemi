import React, { useState } from 'react';
import { Kullanici } from '../types';
import { ShieldAlert, Ambulance, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  users: Kullanici[];
  onLogin: (user: Kullanici) => void;
  onPasswordReset: (userId: string, newPassword: string) => void;
  onRegister?: (newUser: Kullanici) => void;
}

type Mode = 'login' | 'forgot_request' | 'forgot_verify' | 'forgot_reset' | 'register';

export function Login({ users, onLogin, onPasswordReset, onRegister }: LoginProps) {
  const [mode, setMode] = useState<Mode>('login');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [resetContact, setResetContact] = useState('');
  const [resetUser, setResetUser] = useState<Kullanici | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const user = users.find(u => u.kullaniciAdi === username && u.sifre === password);
    if (user) {
      if (!user.aktifMi) {
        setError('Hesabınız askıya alınmış. Lütfen yönetici ile iletişime geçin.');
        return;
      }
      onLogin(user);
    } else {
      setError('Hatalı kullanıcı adı veya şifre.');
    }
  };

  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Geçici olarak localStorage'a kaydet (Firebase gelene kadar çalışması için)
    if (onRegister) {
      const newUser = {
        id: crypto.randomUUID(),
        kullaniciAdi: regUsername,
        sifre: regPassword,
        adSoyad: regName,
        rol: 'Personel' as any,
        aktifMi: true,
        telefon: regPhone
      };
      onRegister(newUser);
    }
    
    setSuccess('Kayıt başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.');
    setTimeout(() => {
      setMode('login');
      setSuccess('');
      setRegName('');
      setRegUsername('');
      setRegPassword('');
      setRegPhone('');
    }, 3000);
  };

  const handleForgotRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = users.find(u => 
      u.eposta === resetContact || 
      u.telefon === resetContact || 
      u.kullaniciAdi === resetContact
    );
    
    if (user) {
      setResetUser(user);
      setSuccess('Sıfırlama kodu SMS/E-posta ile gönderildi. (Test için "123456" giriniz)');
      setMode('forgot_verify');
    } else {
      setError('Sistemde bu bilgilere ait bir kullanıcı bulunamadı.');
    }
  };

  const handleForgotVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (verificationCode === '123456') {
      setMode('forgot_reset');
    } else {
      setError('Hatalı veya süresi dolmuş kod.');
    }
  };

  const handleForgotReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setError('Şifre en az 4 karakter olmalıdır.');
      return;
    }
    
    if (resetUser) {
      onPasswordReset(resetUser.id, newPassword);
      setSuccess('Şifreniz başarıyla değiştirildi! Yeni şifrenizle giriş yapabilirsiniz.');
      setMode('login');
      setUsername(resetUser.kullaniciAdi);
      setPassword('');
      setResetUser(null);
      setResetContact('');
      setVerificationCode('');
      setNewPassword('');
    }
  };

  const resetState = () => {
    setError('');
    setSuccess('');
    setMode('login');
    setResetUser(null);
    setResetContact('');
    setVerificationCode('');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
        
        {mode !== 'login' && (
          <button 
            onClick={resetState}
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col items-center mb-8 mt-2">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            {mode === 'login' ? <Ambulance size={32} /> : <KeyRound size={32} />}
          </div>
          <h1 className="text-2xl font-bold text-slate-800 text-center">
            {mode === 'login' ? 'Şırnak 112 Ambulans Yönetim Sistemi' : mode === 'register' ? 'Yeni Personel Kaydı' : 'Şifre Sıfırlama'}
          </h1>
          <p className="text-slate-500 text-center mt-2 text-sm">
            {mode === 'login' && 'Lütfen devam etmek için giriş yapın'}
            {mode === 'register' && 'Sisteme erişim sağlamak için bilgilerinizi doldurun.'}
            {mode === 'forgot_request' && 'Kayıtlı e-posta, telefon veya kullanıcı adınızı girin.'}
            {mode === 'forgot_verify' && 'Cihazınıza gelen 6 haneli doğrulama kodunu girin.'}
            {mode === 'forgot_reset' && 'Hesabınız için yeni bir şifre belirleyin.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{success}</p>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                E-posta Adresi
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                placeholder="Örn: admin"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Şifre
                </label>
                <button 
                  type="button"
                  onClick={() => { setError(''); setSuccess(''); setMode('forgot_request'); }}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Şifremi Unuttum
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white font-medium py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 mt-2"
            >
              Giriş Yap
            </button>

            <div className="mt-4 text-center">
              <span className="text-sm text-slate-500">Sistemde hesabınız yok mu? </span>
              <button 
                type="button" 
                onClick={() => { setError(''); setSuccess(''); setMode('register'); }} 
                className="text-sm text-red-600 font-bold hover:underline"
              >
                Yeni Kayıt Oluştur
              </button>
            </div>
          </form>
        )}

        
        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
              <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none" placeholder="Örn: Ali Yılmaz" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-posta Adresi</label>
              <input type="email" required value={regUsername} onChange={(e) => setRegUsername(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none" placeholder="Örn: ahmet@gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
              <input type="tel" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none" placeholder="05XX XXX XX XX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Şifre Belirleyin</label>
              <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full bg-slate-800 text-white font-medium py-2.5 rounded-lg hover:bg-slate-900 transition-colors shadow-lg mt-2">
              Kayıt Talebi Gönder
            </button>
            <button type="button" onClick={() => setMode('login')} className="w-full bg-slate-100 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-200 transition-colors mt-2">
              Giriş Ekranına Dön
            </button>
          </form>
        )}

        {/* FORGOT REQUEST FORM */}
        {mode === 'forgot_request' && (
          <form onSubmit={handleForgotRequest} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                E-posta, Telefon veya Kullanıcı Adı
              </label>
              <input
                type="text"
                required
                value={resetContact}
                onChange={(e) => setResetContact(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-colors"
                placeholder="İletişim bilginizi giriniz"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 text-white font-medium py-2.5 rounded-lg hover:bg-slate-900 transition-colors shadow-lg mt-2"
            >
              Sıfırlama Kodu Gönder
            </button>
          </form>
        )}

        {/* FORGOT VERIFY FORM */}
        {mode === 'forgot_verify' && (
          <form onSubmit={handleForgotVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-center">
                6 Haneli Doğrulama Kodu
              </label>
              <input
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 text-center tracking-[0.5em] font-mono text-xl border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-colors"
                placeholder="123456"
                maxLength={6}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 text-white font-medium py-2.5 rounded-lg hover:bg-slate-900 transition-colors shadow-lg mt-2"
            >
              Kodu Doğrula
            </button>
          </form>
        )}

        {/* FORGOT RESET FORM */}
        {mode === 'forgot_reset' && (
          <form onSubmit={handleForgotReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Yeni Şifreniz
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-colors"
                placeholder="En az 4 karakter"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 mt-2"
            >
              Şifreyi Güncelle
            </button>
          </form>
        )}

        {mode === 'login' && (
          <div className="mt-8 text-center text-xs text-slate-400 border-t pt-6">
            <p>İlk kurulum varsayılan yönetici:</p>
            <p className="mt-1 font-medium font-mono text-slate-500">Kullanıcı: admin | Şifre: admin123</p>
          </div>
        )}
      </div>
    </div>
  );
}
