// 1. Gerekli paketleri çağırıyoruz
const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Dosya okuma/yazma için Node.js'in kendi paketi
const path = require('path'); // Dosya yolları ile çalışmak için

// 2. Express uygulamasını oluşturuyoruz
const app = express();

// DEĞİŞİKLİK BURADA: Port'u Render'ın istediği gibi dinamik hale getiriyoruz
const PORT = process.env.PORT || 3000;

// 3. Gerekli ara yazılımları (middleware) kullanıyoruz
app.use(cors()); // Frontend'den gelen isteklere izin ver (ÇOK ÖNEMLİ)

// Bu satır, backend sunucusunun, ../frontend klasöründeki dosyaları
// sanki kendi dosyalarıymış gibi sunmasını sağlar.
app.use(express.static(path.join(__dirname, '../frontend')));

// 4. API Endpoint'imizi (İstek Atacağımız Adres) oluşturuyoruz
app.get('/api/update-views', (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');

    // Veritabanı dosyasını oku
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Sunucu hatası');
        }

        // JSON verisini objeye çevir
        const dbData = JSON.parse(data);
        
        // Sayacı 1 artır
        dbData.viewCount++;

        // Güncellenmiş objeyi tekrar JSON string'ine çevir
        const updatedDbData = JSON.stringify(dbData, null, 2);

        // Yeni veriyi dosyaya yaz
        fs.writeFile(dbPath, updatedDbData, 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).send('Sunucu hatası');
            }
            
            // Her şey yolundaysa, güncel sayacı frontend'e geri gönder
            res.json({ views: dbData.viewCount });
        });
    });
});

// 5. Sunucuyu dinlemeye başlıyoruz
app.listen(PORT, () => {
    // Bu log mesajı hem Render'da hem kendi bilgisayarında doğru portu gösterecek
    console.log(`Sunucu ${PORT} portunda başarıyla başlatıldı.`);
});