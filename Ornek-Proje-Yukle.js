/* ============================================================================
   ÖRNEK PROJE YÜKLEYİCİ  (FMEA + Kontrol Planı)
   Amaç: Formların şablon yapısına uygun doldurulduğunu test etmek için
         uygulamaya hazır bir örnek proje (akış + FMEA + Kontrol Planı) yükler.

   NASIL KULLANILIR
   1) Uygulamayı açın ve hesabınıza GİRİŞ YAPIN (veri yüklenmesi bittikten sonra).
      ÖNERİ: Gerçek hesabınızı kirletmemek için TEST amaçlı bir hesapla girin.
   2) F12 -> Console (Konsol) sekmesini açın.
   3) Bu dosyanın TAMAMINI kopyalayıp konsola yapıştırın ve Enter'a basın.
   4) Ekranda "ÖRNEK PROJE (TEST)" seçili gelir; akış, FMEA ve Kontrol Planı dolu olur.
   5) "Kontrol Planı Görüntüle" ve "Excel İndir" ile çıktıyı denetleyin.

   BULUTA_KAYDET = false  ->  örnek yalnızca ekranda/yerelde kalır (bulut hesabınıza
                              kaydedilmez; sayfa yenilenince buluttaki veri geri gelir).
   BULUTA_KAYDET = true   ->  örnek proje hesabınıza kaydedilir ve buluta senkronlanır
                              (kalıcı olması için bunu kullanın, sonra TEMİZLE ile temizleyin).

   TEMİZLEMEK İÇİN: dosyanın EN ALTINDAKİ "TEMİZLE" kodunu kullanın.
   ============================================================================ */
(function () {
  'use strict';

  var BULUTA_KAYDET = false;              // true yaparsanız örnek proje hesabınıza senkronlanır
  var PROJE_ADI = 'ÖRNEK PROJE (TEST)';

  /* ---------- FMEA başlık (meta) alanları - Excel üst bant ---------- */
  var fmeaMeta = {
    prosesAdi: 'Sac Kesim ve Montaj Hattı',
    prosesSorumlusu: 'Mehmet Yılmaz',
    firma: 'ÖRNEK OTO SİSTEMLERİ A.Ş. / Otomotiv',
    ekipLideri: 'Ayşe Demir',
    cekirdekEkip: 'Ayşe Demir, Mehmet Yılmaz, Can Ersoy, Elif Kaya',
    fmeaNo: 'FMEA-01-05',
    fmeaRevNo: '1',
    fmeaRevTarih: '09.10.2026',
    fmeaTarih: '09.10.2026',
    kpRevNo: '1',
    kpNo: 'CP-01-05',
    kpRevTarih: '09.10.2026',
    kpOlusturmaTarih: '09.10.2026',
    cpSayfa: '1/1'
  };

  /* ---------- Hata satırı yardımcısı (tüm FMEA kolonları dolu) ---------- */
  function hata(o) {
    return {
      tur: o.tur, etki: o.etki, neden: o.neden,
      s: o.s, o: o.o, d: o.d, sinif: o.sinif,
      onkontrol: o.onkontrol, tespitkontrol: o.tespitkontrol,
      faaliyet: o.faaliyet, sorumlu: o.sorumlu, hedefTarih: o.hedefTarih,
      aksiyon: o.aksiyon, gerceklesenTarih: o.gerceklesenTarih,
      s2: o.s2, o2: o.o2, d2: o.d2
    };
  }

  /* ---------- Akış (nodes) + FMEA verisi ---------- */
  var nodes = [
    { id: 'node_start_ornek', type: 'start', title: 'BAŞLANGIÇ', targetMode: 'new', targetId: '',
      sideTargetMode: 'next', sideTargetId: '', newProcessTitle: 'Red / Yeniden İşleme', altProsesler: [] },

    { id: 'node_kesim_ornek', type: 'process', title: 'Kesim', targetMode: 'new', targetId: 'node_montaj_ornek',
      sideTargetMode: 'next', sideTargetId: '', newProcessTitle: 'Red / Yeniden İşleme',
      altProsesler: [
        { id: 'sub_k1_ornek', code: '1.10', title: 'Hammadde Besleme',
          gerUrun: 'Rulo sac EN 10130, 1,5 mm', gerProses: 'Besleme hızı 12 m/dk',
          hatalar: [
            hata({ tur: 'Yanlış malzeme kalınlığı', etki: 'Montajda boşluk / uyumsuzluk',
              neden: 'Malzeme etiketi karışması', s: '7', o: '3', d: '4', sinif: 'Görev Kritik',
              onkontrol: 'Tedarikçi sertifikası kontrolü', tespitkontrol: 'Kalınlık mastarı ile ölçüm',
              faaliyet: 'Etiket ve barkod çift kontrolü', sorumlu: 'Depo Sorumlusu',
              hedefTarih: '15.10.2026', aksiyon: 'Barkod okuyucu ile otomatik doğrulama',
              gerceklesenTarih: '12.10.2026', s2: '7', o2: '2', d2: '3' }),
            hata({ tur: 'Yüzey çiziği', etki: 'Kozmetik ret', neden: 'Uygunsuz depolama',
              s: '3', o: '4', d: '3', sinif: 'Majör',
              onkontrol: 'Depolama talimatı', tespitkontrol: 'Görsel muayene',
              faaliyet: 'Ara stok ayırıcı kullanımı', sorumlu: 'Depo Sorumlusu',
              hedefTarih: '17.10.2026', aksiyon: 'Koruyucu folyo uygulaması',
              gerceklesenTarih: '', s2: '3', o2: '3', d2: '3' })
          ] },
        { id: 'sub_k2_ornek', code: '1.20', title: 'Kesme İşlemi',
          gerUrun: 'Kesim uzunluğu 250 mm ±0,5', gerProses: 'Kesme kuvveti 8 ton',
          hatalar: [
            hata({ tur: 'Kesim boyu tolerans dışı', etki: 'Montajda montaj zorluğu',
              neden: 'Bıçak aşınması', s: '6', o: '5', d: '3', sinif: 'Majör',
              onkontrol: 'Bıçak değişim planı', tespitkontrol: 'Kumpas ile numune ölçümü',
              faaliyet: 'Bıçak ömrü izleme', sorumlu: 'Kesim Operatörü',
              hedefTarih: '20.10.2026', aksiyon: '50.000 kesimde otomatik uyarı',
              gerceklesenTarih: '', s2: '6', o2: '3', d2: '2' })
          ] }
      ] },

    { id: 'node_montaj_ornek', type: 'process', title: 'Montaj', targetMode: 'new', targetId: 'node_end_ornek',
      sideTargetMode: 'next', sideTargetId: '', newProcessTitle: 'Red / Yeniden İşleme',
      altProsesler: [
        { id: 'sub_m1_ornek', code: '2.10', title: 'Cıvata Sıkma',
          gerUrun: 'Bağlantı torku 45 Nm ±5', gerProses: 'Sıkma istasyonu #3',
          hatalar: [
            hata({ tur: 'Yetersiz sıkma torku', etki: 'Bağlantı gevşemesi / fonksiyon kaybı',
              neden: 'Tork aleti kalibrasyon kaybı', s: '8', o: '3', d: '4', sinif: 'Emniyet Kritik',
              onkontrol: 'Kalibrasyon takvimi', tespitkontrol: 'Tork ölçer ile %10 numune',
              faaliyet: 'Akıllı tork aleti ile kayıt', sorumlu: 'Montaj Şefi',
              hedefTarih: '18.10.2026', aksiyon: 'Tork aletine data logger eklendi',
              gerceklesenTarih: '14.10.2026', s2: '8', o2: '2', d2: '2' })
          ] },
        { id: 'sub_m2_ornek', code: '2.20', title: 'Kaynak Kontrol',
          gerUrun: 'Dikiş boyu ≥ 25 mm', gerProses: 'MIG kaynak parametreleri',
          hatalar: [
            hata({ tur: 'Eksik kaynak dikişi', etki: 'Yapısal zayıflık', neden: 'Operatör dalgınlığı',
              s: '9', o: '4', d: '3', sinif: 'Emniyet Kritik',
              onkontrol: 'WPS talimatı', tespitkontrol: 'Görsel + sızdırmazlık testi',
              faaliyet: 'Dikiş boyu sensörü', sorumlu: 'Kaynak Operatörü',
              hedefTarih: '25.10.2026', aksiyon: 'Otomatik dikiş izleme', gerceklesenTarih: '',
              s2: '9', o2: '3', d2: '2' })
          ] }
      ] },

    { id: 'node_end_ornek', type: 'end', title: 'BİTİŞ', targetMode: 'new', targetId: '',
      sideTargetMode: 'next', sideTargetId: '', newProcessTitle: 'Red / Yeniden İşleme', altProsesler: [] }
  ];

  /* ---------- Kontrol Planı satır verisi (sub.code ile anahtarlanır) ---------- */
  var kpEdits = {
    '1.10': { karak: 'Malzeme kalınlığı', spes: '1,5 mm ±0,05', sinif: 'Görev Kritik',
      olcum: 'Mikrometre', miktar: '5 adet/vardiya', siklik: 'Her parti',
      kontrol: 'Ölçüm ve kayıt', kayitSorumlu: 'Kalite',
      reaksiyon: 'Parti karantinaya alınır, tedarikçi bilgilendirilir.' },
    '1.20': { karak: 'Kesim boyu', spes: '250 mm ±0,5', sinif: 'Majör',
      olcum: 'Kumpas', miktar: '3 adet/saat', siklik: 'Saatlik',
      kontrol: 'Numune ölçümü', kayitSorumlu: 'Operatör',
      reaksiyon: 'Makine durdurulur, bıçak değiştirilir.' },
    '2.10': { karak: 'Sıkma torku', spes: '45 Nm ±5', sinif: 'Emniyet Kritik',
      olcum: 'Tork ölçer', miktar: '%10 numune', siklik: 'Her vardiya',
      kontrol: 'Tork ölçümü ve kayıt', kayitSorumlu: 'Montaj Şefi',
      reaksiyon: 'Parça sökülür, yeniden sıkılır, alet kalibre edilir.' },
    '2.20': { karak: 'Kaynak dikiş boyu', spes: '≥ 25 mm', sinif: 'Emniyet Kritik',
      olcum: 'Görsel + mastar', miktar: '%100', siklik: 'Her parça',
      kontrol: 'Görsel muayene', kayitSorumlu: 'Kaynak Operatörü',
      reaksiyon: 'Parça red edilir, yeniden kaynak yapılır.' }
  };

  /* ---------- Doğru (hesaba ozel) depolama anahtarlarini bul ---------- */
  var K_SATIR = (typeof key !== 'undefined' && key) || 'proses_fmea_v30';
  var K_META = (typeof metaKey !== 'undefined' && metaKey) || 'proses_fmea_meta_v30';
  var K_PROJ = (typeof projectsKey !== 'undefined' && projectsKey) || 'proses_fmea_projects_v31';
  var K_CUR = (typeof currentKey !== 'undefined' && currentKey) || 'proses_fmea_current_v31';
  var K_KP = (typeof kpKey === 'function') ? kpKey() : 'kpEdits';

  /* ---------- Projeyi kaydet ---------- */
  var projRec = {
    name: PROJE_ADI, type: 'proses',
    nodes: JSON.parse(JSON.stringify(nodes)),
    fmeaMeta: JSON.parse(JSON.stringify(fmeaMeta)),
    updatedAt: Date.now(),
    onayDurumu: 'taslak', onayZaman: null, onayNot: ''
  };

  try {
    localStorage.setItem(K_SATIR, JSON.stringify(nodes));
    localStorage.setItem(K_META, JSON.stringify(fmeaMeta));
    localStorage.setItem(K_CUR, PROJE_ADI);
    localStorage.setItem(K_KP, JSON.stringify(kpEdits));
    var liste;
    try { liste = JSON.parse(localStorage.getItem(K_PROJ) || '[]'); } catch (e) { liste = []; }
    if (!Array.isArray(liste)) liste = [];
    liste = liste.filter(function (p) { return !p || p.name !== PROJE_ADI; });
    liste.push(projRec);
    localStorage.setItem(K_PROJ, JSON.stringify(liste));
  } catch (e) {
    console.warn('localStorage yazılamadı:', e);
  }

  /* ---------- Arayüzü anında güncelle (yenilemeye gerek yok) ---------- */
  try {
    nodes = JSON.parse(JSON.stringify(nodes));
    fmeaMeta = projRec.fmeaMeta;
    currentProject = PROJE_ADI;
    fmeaType = 'proses';
    if (typeof projects !== 'undefined') {
      projects = JSON.parse(JSON.stringify(liste));
    }
    if (typeof autoNumberNodes === 'function') autoNumberNodes();
    if (typeof refreshProjectSel === 'function') refreshProjectSel();
    if (typeof render === 'function') render();
    if (BULUTA_KAYDET && typeof save === 'function') save();   // kalıcı + bulut senkronu
    console.log('%c✔ Örnek proje yüklendi: ' + PROJE_ADI +
      '  (2 proses / 4 işlem adımı / 5 hata + 4 Kontrol Planı satırı)' +
      (BULUTA_KAYDET ? '  [buluta kaydedildi]' : '  [yalnız yerel - buluta gönderilmedi]'),
      'color:#15803d;font-weight:bold');
  } catch (e) {
    console.warn('Veri yazıldı, arayüz güncellenemedi. Sayfayı (F5) yenileyin.', e);
  }
})();

/* ============================================================================
   TEMİZLE  —  Yüklediğiniz örnek projeyi kaldırmak için bu bloğu kullanın:
   (aşağıdaki satırların başındaki // işaretlerini silip konsola yapıştırın)

// (function () {
//   var P = 'ÖRNEK PROJE (TEST)';
//   var K_PROJ = (typeof projectsKey !== 'undefined' && projectsKey) || 'proses_fmea_projects_v31';
//   var liste = []; try { liste = JSON.parse(localStorage.getItem(K_PROJ) || '[]'); } catch (e) {}
//   liste = (liste || []).filter(function (p) { return !p || p.name !== P; });
//   localStorage.setItem(K_PROJ, JSON.stringify(liste));
//   if (typeof projects !== 'undefined') projects = liste;
//   if (typeof currentProject !== 'undefined' && currentProject === P) {
//     nodes = []; fmeaMeta = {}; currentProject = '';
//     localStorage.setItem((typeof key !== 'undefined' && key) || 'proses_fmea_v30', '[]');
//     localStorage.setItem((typeof metaKey !== 'undefined' && metaKey) || 'proses_fmea_meta_v30', '{}');
//     localStorage.setItem((typeof currentKey !== 'undefined' && currentKey) || 'proses_fmea_current_v31', '');
//   }
//   if (typeof render === 'function') render();
//   if (typeof save === 'function') save();
//   console.log('Örnek proje temizlendi.');
// })();
   ============================================================================ */
