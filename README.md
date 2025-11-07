# Vardiya Yönetim Sistemi - Full Stack

Rails 8 API backend ve React frontend ile geliştirilmiş vardiya yönetim sistemi.

## 🚀 Özellikler

- ✅ Kullanıcı yönetimi (CRUD)
- ✅ Departman yönetimi (CRUD)
- ✅ Vardiya yönetimi (CRUD)
- ✅ Vardiya atamaları ve durum takibi
- ✅ BDD (Behavior-Driven Development) yaklaşımı
- ✅ Cucumber test senaryoları
- ✅ Cypress E2E testleri
- ✅ RESTful API
- ✅ Modern React UI

## 📋 Teknolojiler

### Backend
- Ruby on Rails 8
- PostgreSQL
- RSpec
- Cucumber
- Bcrypt (şifre hashleme)

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Modern CSS

### Test
- Cypress (E2E)
- Cucumber (BDD)

## 🛠️ Kurulum

### Gereksinimler
- Ruby 3.4+
- PostgreSQL
- Node.js 22+
- npm veya yarn

### Backend Kurulumu

```bash
cd vardiya_backend
bundle install
rails db:create
rails db:migrate
rails server
```

Backend `http://localhost:3000` adresinde çalışacak.

### Frontend Kurulumu

```bash
cd vardiya_frontend
npm install
npm run dev
```

Frontend `http://localhost:3001` adresinde çalışacak.

## 🧪 Testler

### Cucumber Testleri
```bash
npm run test:cucumber
```

### Cypress Testleri
```bash
# Tüm frontend testleri
npm run cypress:run:frontend

# Demo video oluştur
npm run cypress:demo:video

# Interaktif mod
npm run cypress:open
```

## 📁 Proje Yapısı

```
vardiya_backend/
├── app/
│   ├── controllers/api/v1/
│   ├── models/
│   └── views/
├── config/
├── db/
├── features/          # Cucumber feature dosyaları
├── cypress/          # Cypress test dosyaları
└── spec/

vardiya_frontend/
├── src/
│   ├── pages/        # React sayfaları
│   ├── services/     # API servisleri
│   └── App.jsx
└── public/
```

## 🔌 API Endpoints

### Kullanıcılar
- `GET /api/v1/users` - Tüm kullanıcıları listele
- `GET /api/v1/users/:id` - Kullanıcı detayı
- `POST /api/v1/users` - Yeni kullanıcı oluştur
- `PATCH /api/v1/users/:id` - Kullanıcı güncelle
- `DELETE /api/v1/users/:id` - Kullanıcı sil

### Departmanlar
- `GET /api/v1/departments` - Tüm departmanları listele
- `GET /api/v1/departments/:id` - Departman detayı
- `POST /api/v1/departments` - Yeni departman oluştur
- `PATCH /api/v1/departments/:id` - Departman güncelle
- `DELETE /api/v1/departments/:id` - Departman sil

### Vardiyalar
- `GET /api/v1/shifts` - Tüm vardiyaları listele
- `GET /api/v1/shifts/:id` - Vardiya detayı
- `POST /api/v1/shifts` - Yeni vardiya oluştur
- `PATCH /api/v1/shifts/:id` - Vardiya güncelle
- `DELETE /api/v1/shifts/:id` - Vardiya sil

### Vardiya Atamaları
- `GET /api/v1/shift_assignments` - Tüm atamaları listele
- `GET /api/v1/shift_assignments/:id` - Atama detayı
- `POST /api/v1/shift_assignments` - Yeni atama oluştur
- `PATCH /api/v1/shift_assignments/:id` - Atama güncelle
- `DELETE /api/v1/shift_assignments/:id` - Atama sil

## 📝 Veritabanı Yapısı

### Users
- id, name, email, password_digest, role, created_at, updated_at

### Departments
- id, name, description, created_at, updated_at

### Shifts
- id, department_id, date, start_time, end_time, created_at, updated_at

### ShiftAssignments
- id, user_id, shift_id, status, notes, created_at, updated_at

## 🎬 Demo Video

Demo video oluşturmak için:
```bash
npm run cypress:demo:video
```

Video `cypress/videos/demo.cy.js.mp4` konumunda oluşturulur.

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👤 Geliştirici

Bbusenur

## 🙏 Teşekkürler

- Rails Community
- React Community
- Cypress Team
