import { Arac, ArizaKaydi, IslemKaydi } from '../types';
import { formatTRDate } from './dateUtils';

const printHtml = (title: string, tableHtml: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #333; }
          h1 { color: #e11d48; margin-bottom: 5px; font-size: 24px; }
          .date { color: #666; font-size: 12px; margin-bottom: 20px; }
          table { w-full; border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 12px; }
          th { background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left; padding: 10px; font-weight: bold; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background-color: #f8fafc; }
          @media print {
            @page { margin: 1.5cm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="date">Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}</div>
        ${tableHtml}
        <script>
          window.onload = () => {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const exportVehiclesToPdf = (vehicles: Arac[]) => {
  let rows = '';
  vehicles.forEach(v => {
    rows += `
      <tr>
        <td><strong>${v.plaka}</strong></td>
        <td>${v.aracModeli.marka} ${v.aracModeli.model} (${v.aracModeli.yil})</td>
        <td>${v.durum}</td>
        <td>${v.istasyon}</td>
        <td>${v.guncelKm.toLocaleString('tr-TR')} KM</td>
        <td>${v.sonrakiBakimKm ? v.sonrakiBakimKm.toLocaleString('tr-TR') + ' KM' : '-'}</td>
        <td>${formatTRDate(v.kaskoBitisTarihi)}</td>
      </tr>
    `;
  });

  const table = `
    <table>
      <thead>
        <tr>
          <th>Plaka</th>
          <th>Marka / Model</th>
          <th>Durum</th>
          <th>İstasyon</th>
          <th>Güncel KM</th>
          <th>Sonraki Bakım KM</th>
          <th>Kasko Bitiş</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  printHtml('Ambulans Filo Durum Raporu', table);
};

export const exportIssuesToPdf = (issues: ArizaKaydi[]) => {
  let rows = '';
  issues.forEach(iss => {
    rows += `
      <tr>
        <td><strong>${iss.kayitNo}</strong></td>
        <td>${iss.ilgiliTip}: ${iss.ilgiliHedef}</td>
        <td>${iss.arizaTanimi}</td>
        <td>${iss.aciliyetSeviyesi}</td>
        <td>${iss.sonDurum}</td>
        <td>${iss.bildirenPersonel}</td>
      </tr>
    `;
  });

  const table = `
    <table>
      <thead>
        <tr>
          <th>Kayıt No</th>
          <th>İlgili Araç / Ekipman</th>
          <th>Arıza Tanımı</th>
          <th>Aciliyet</th>
          <th>Durum</th>
          <th>Bildiren Personel</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  printHtml('Arıza ve Bildirim Kayıtları Raporu', table);
};


export const exportLogsToPdf = (logs: IslemKaydi[]) => {
  let table = '<table><thead><tr>';
  table += '<th>ID</th>';
  table += '<th>Kullanıcı Adı</th>';
  table += '<th>İşlem Tipi</th>';
  table += '<th>Modül (Hedef)</th>';
  table += '<th>Tarih / Saat</th>';
  table += '<th>Detay</th>';
  table += '</tr></thead><tbody>';

  logs.forEach(l => {
    // Make detail text a bit smaller if it's long
    table += '<tr>';
    table += '<td>' + l.id.slice(-6) + '</td>';
    table += '<td>' + l.kullaniciAdi + '</td>';
    table += '<td>' + l.islemTipi + '</td>';
    table += '<td>' + l.hedef + '</td>';
    table += '<td>' + new Date(l.tarih).toLocaleString('tr-TR') + '</td>';
    table += '<td>' + l.detay + '</td>';
    table += '</tr>';
  });

  table += '</tbody></table>';

  printHtml('Sistem İşlem Kayıtları (Audit Log)', table);
};
