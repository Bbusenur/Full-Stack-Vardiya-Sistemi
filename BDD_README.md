# BDD Test Kılavuzu

Bu proje Behavior Driven Development (BDD) yaklaşımıyla geliştirilmektedir. Cucumber ve Cypress kullanılarak testler yazılmıştır.

## Kurulum

### 1. Ruby Gem'leri
```bash
bundle install
```

### 2. Node.js Paketleri (Cypress için)
```bash
npm install
```

## Test Çalıştırma

### Cucumber Testleri

Cucumber testlerini çalıştırmak için önce Rails sunucusunun çalışıyor olması gerekir:

```bash
# Terminal 1: Rails sunucusunu başlat
rails server

# Terminal 2: Cucumber testlerini çalıştır
bundle exec cucumber

# Belirli bir feature dosyasını çalıştır
bundle exec cucumber features/vardiya_yonetimi.feature

# Belirli bir senaryoyu çalıştır
bundle exec cucumber features/vardiya_yonetimi.feature:15
```

### Cypress Testleri

```bash
# Cypress'i interaktif modda aç
npm run cypress:open

# Cypress testlerini headless modda çalıştır
npm run cypress:run

# Belirli bir test dosyasını çalıştır
npx cypress run --spec "cypress/e2e/vardiya-yonetimi.cy.js"
```

## Feature Dosyaları

### 1. Vardiya Yönetimi (`features/vardiya_yonetimi.feature`)
- Yeni vardiya oluşturma
- Çalışanı vardiyaya atama
- Vardiya atamasını onaylama
- Vardiyaları listeleme
- Çalışanın vardiyalarını görüntüleme
- Vardiya silme

### 2. Kullanıcı Yönetimi (`features/kullanici_yonetimi.feature`)
- Yeni çalışan oluşturma
- Çalışan listeleme
- Çalışan bilgilerini güncelleme
- Çalışan silme
- Email validasyonu

### 3. Departman Yönetimi (`features/departman_yonetimi.feature`)
- Yeni departman oluşturma
- Departman listeleme
- Departman bilgilerini güncelleme
- Departman silme

## Step Definitions

Step definitions dosyaları `features/step_definitions/` klasöründe bulunur:

- `api_steps.rb` - API istekleri için yardımcı metodlar
- `database_steps.rb` - Veritabanı setup ve teardown işlemleri
- `user_steps.rb` - Kullanıcı yönetimi step'leri
- `department_steps.rb` - Departman yönetimi step'leri
- `shift_steps.rb` - Vardiya yönetimi step'leri

## Cypress Test Dosyaları

Cypress test dosyaları `cypress/e2e/` klasöründe bulunur:

- `vardiya-yonetimi.cy.js` - Vardiya yönetimi API testleri
- `kullanici-yonetimi.cy.js` - Kullanıcı yönetimi API testleri

## Test Senaryoları Yazma

### Cucumber Senaryosu Örneği

```gherkin
Scenario: Yeni bir vardiya oluşturma
  Given "İnsan Kaynakları" departmanı için bir vardiya oluşturmak istiyorum
  When aşağıdaki bilgilerle vardiya oluşturuyorum:
    | date       | start_time | end_time |
    | 2024-11-08 | 09:00      | 17:00    |
  Then vardiya başarıyla oluşturulmalı
  And vardiya "İnsan Kaynakları" departmanına ait olmalı
```

### Cypress Test Örneği

```javascript
it('Yeni bir vardiya oluşturulabilmeli', () => {
  cy.createShift({
    date: '2024-11-08',
    start_time: '09:00:00',
    end_time: '17:00:00',
    department_id: departmentId
  }).then((response) => {
    expect(response.status).to.eq(201)
    expect(response.body).to.have.property('id')
  })
})
```

## Önemli Notlar

1. **Test Veritabanı**: Cucumber testleri çalıştırılmadan önce test veritabanının hazır olması gerekir:
   ```bash
   rails db:test:prepare
   ```

2. **Sunucu**: API testleri için Rails sunucusunun çalışıyor olması gerekir (`rails server`)

3. **Database Cleaner**: Her test senaryosu öncesi veritabanı otomatik olarak temizlenir.

4. **Base URL**: API endpoint'leri `http://localhost:3000` üzerinden test edilir.


