Feature: Vardiya Yönetimi
  Vardiya sisteminde çalışanların vardiyalarını yönetebilmeliyim

  Background:
    Given veritabanı temizlendi
    And aşağıdaki departmanlar mevcut:
      | name              | description           |
      | İnsan Kaynakları  | İK Departmanı        |
      | Üretim            | Üretim Departmanı     |
    And aşağıdaki kullanıcılar mevcut:
      | name          | email              | role     |
      | Ahmet Yılmaz  | ahmet@example.com  | employee |
      | Ayşe Demir    | ayse@example.com   | manager  |

  Scenario: Yeni bir vardiya oluşturma
    Given "İnsan Kaynakları" departmanı için bir vardiya oluşturmak istiyorum
    When aşağıdaki bilgilerle vardiya oluşturuyorum:
      | date       | start_time | end_time |
      | 2024-11-08 | 09:00      | 17:00    |
    Then vardiya başarıyla oluşturulmalı
    And vardiya "İnsan Kaynakları" departmanına ait olmalı
    And vardiya tarihi "2024-11-08" olmalı
    And vardiya saatleri "09:00" - "17:00" arasında olmalı

  Scenario: Çalışanı vardiyaya atama
    Given "2024-11-08" tarihinde "09:00" - "17:00" saatleri arasında bir vardiya mevcut
    And "Ahmet Yılmaz" adlı çalışan mevcut
    When "Ahmet Yılmaz" çalışanını bu vardiyaya atıyorum
    Then atama başarıyla oluşturulmalı
    And atama durumu "pending" olmalı
    And "Ahmet Yılmaz" bu vardiyaya atanmış olmalı

  Scenario: Vardiya atamasını onaylama
    Given "Ahmet Yılmaz" çalışanı bir vardiyaya "pending" durumunda atanmış
    When bu atamanın durumunu "confirmed" olarak güncelliyorum
    Then atama durumu "confirmed" olmalı

  Scenario: Vardiyaları listeleme
    Given aşağıdaki vardiyalar mevcut:
      | date       | start_time | end_time | department        |
      | 2024-11-08 | 09:00      | 17:00    | İnsan Kaynakları  |
      | 2024-11-09 | 10:00      | 18:00    | Üretim            |
    When tüm vardiyaları listeliyorum
    Then 2 vardiya görüntülenmeli
    And listede "2024-11-08" tarihli vardiya olmalı
    And listede "2024-11-09" tarihli vardiya olmalı

  Scenario: Çalışanın vardiyalarını görüntüleme
    Given "Ahmet Yılmaz" çalışanı 2 vardiyaya atanmış
    When "Ahmet Yılmaz" çalışanının vardiyalarını listeliyorum
    Then 2 vardiya görüntülenmeli
    And tüm vardiyalarda "Ahmet Yılmaz" atanmış olmalı

  Scenario: Vardiya silme
    Given "2024-11-08" tarihinde bir vardiya mevcut
    When bu vardiyayı siliyorum
    Then vardiya başarıyla silinmeli
    And vardiya listede görünmemeli

