export function formatTRDate(isoDateStr: string): string {
  if (!isoDateStr) return '-';
  try {
    const parts = isoDateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(isoDateStr);
    if (isNaN(d.getTime())) return isoDateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return isoDateStr;
  }
}

export function formatDateTimeTR(date?: Date | string): string {
  const d = date ? new Date(date) : new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function getDaysRemaining(isoDateStr: string): number {
  if (!isoDateStr) return 999;
  const target = new Date(isoDateStr.split('T')[0]);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getStatusBadge(days: number): {
  text: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  isUrgent: boolean;
} {
  if (days < 0) {
    return {
      text: `Süresi Doldu (${Math.abs(days)} gün önce)`,
      bgClass: 'bg-rose-50',
      textClass: 'text-rose-700',
      borderClass: 'border-rose-200',
      isUrgent: true,
    };
  }
  if (days === 0) {
    return {
      text: 'Bugün Son Gün',
      bgClass: 'bg-rose-100',
      textClass: 'text-rose-800',
      borderClass: 'border-rose-300',
      isUrgent: true,
    };
  }
  if (days <= 15) {
    return {
      text: `${days} gün kaldı (Kritik)`,
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-800',
      borderClass: 'border-amber-300',
      isUrgent: true,
    };
  }
  if (days <= 30) {
    return {
      text: `${days} gün kaldı (Yaklaşıyor)`,
      bgClass: 'bg-yellow-50',
      textClass: 'text-yellow-800',
      borderClass: 'border-yellow-200',
      isUrgent: false,
    };
  }
  return {
    text: `${days} gün kaldı (Geçerli)`,
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    isUrgent: false,
  };
}
