Feature: Kullanıcı Yönetimi
  Sistemde çalışanları yönetebilmeliyim

  Background:
    Given veritabanı temizlendi

  Scenario: Yeni çalışan oluşturma
    Given yeni bir çalışan oluşturmak istiyorum
    When aşağıdaki bilgilerle çalışan oluşturuyorum:
      | name         | email             | password | role     |
      | Mehmet Kaya  | mehmet@test.com   | 123456   | employee |
    Then çalışan başarıyla oluşturulmalı
    And çalışan adı "Mehmet Kaya" olmalı
    And çalışan email'i "mehmet@test.com" olmalı
    And çalışan rolü "employee" olmalı

  Scenario: Çalışan listeleme
    Given aşağıdaki çalışanlar mevcut:
      | name         | email             | role     |
      | Ahmet Yılmaz | ahmet@test.com    | employee |
      | Ayşe Demir   | ayse@test.com     | manager  |
    When tüm çalışanları listeliyorum
    Then 2 çalışan görüntülenmeli
    And listede "Ahmet Yılmaz" olmalı
    And listede "Ayşe Demir" olmalı

  Scenario: Çalışan bilgilerini güncelleme
    Given "Ahmet Yılmaz" adlı bir çalışan mevcut
    When çalışan bilgilerini aşağıdaki gibi güncelliyorum:
      | name         | email              |
      | Ahmet Yılmaz | ahmet.new@test.com |
    Then çalışan başarıyla güncellenmeli
    And çalışan email'i "ahmet.new@test.com" olmalı

  Scenario: Çalışan silme
    Given "Ahmet Yılmaz" adlı bir çalışan mevcut
    When bu çalışanı siliyorum
    Then çalışan başarıyla silinmeli
    And çalışan listede görünmemeli

  Scenario: Aynı email ile çalışan oluşturulamaz
    Given "ahmet@test.com" email'ine sahip bir çalışan mevcut
    When aynı email ile yeni bir çalışan oluşturmaya çalışıyorum:
      | name         | email          | password | role     |
      | Yeni Çalışan  | ahmet@test.com | 123456   | employee |
    Then hata mesajı almalıyım
    And hata mesajı email'in zaten kullanıldığını belirtmeli

