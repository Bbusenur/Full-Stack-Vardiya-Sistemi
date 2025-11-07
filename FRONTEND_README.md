# Frontend Kurulum ve Çalıştırma

## Kurulum

```bash
cd vardiya_frontend
npm install
```

## Çalıştırma

```bash
npm run dev
```

Frontend `http://localhost:3001` adresinde çalışacak.

## Backend Bağlantısı

Backend'in `http://localhost:3000` adresinde çalışıyor olması gerekiyor.

## Test Etme

Cypress testlerini çalıştırmak için:

```bash
# Backend klasörüne dön
cd ../vardiya_backend

# Frontend testlerini çalıştır
npm run cypress:run:frontend
```

## Sayfalar

- `/` - Ana sayfa
- `/shifts` - Vardiyalar listesi ve yönetimi
- `/users` - Kullanıcılar listesi ve yönetimi
- `/departments` - Departmanlar listesi ve yönetimi
- `/shift-assignments` - Vardiya atamaları listesi ve yönetimi

## Özellikler

- ✅ React Router ile routing
- ✅ Axios ile API çağrıları
- ✅ Modal formlar
- ✅ CRUD işlemleri
- ✅ Cypress testleri için data-testid attribute'ları

