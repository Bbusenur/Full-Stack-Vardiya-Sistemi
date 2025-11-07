Feature: Departman Yönetimi
  Sistemde departmanları yönetebilmeliyim

  Background:
    Given veritabanı temizlendi

  Scenario: Yeni departman oluşturma
    Given yeni bir departman oluşturmak istiyorum
    When aşağıdaki bilgilerle departman oluşturuyorum:
      | name             | description        |
      | Satış            | Satış Departmanı   |
    Then departman başarıyla oluşturulmalı
    And departman adı "Satış" olmalı
    And departman açıklaması "Satış Departmanı" olmalı

  Scenario: Departman listeleme
    Given aşağıdaki departmanlar mevcut:
      | name             | description        |
      | İnsan Kaynakları| İK Departmanı      |
      | Üretim           | Üretim Departmanı  |
    When tüm departmanları listeliyorum
    Then 2 departman görüntülenmeli
    And listede "İnsan Kaynakları" olmalı
    And listede "Üretim" olmalı

  Scenario: Departman bilgilerini güncelleme
    Given "İnsan Kaynakları" adlı bir departman mevcut
    When departman bilgilerini aşağıdaki gibi güncelliyorum:
      | name             | description           |
      | İnsan Kaynakları| Güncellenmiş İK Dep.  |
    Then departman başarıyla güncellenmeli
    And departman açıklaması "Güncellenmiş İK Dep." olmalı

  Scenario: Departman silme
    Given "İnsan Kaynakları" adlı bir departman mevcut
    When bu departmanı siliyorum
    Then departman başarıyla silinmeli
    And departman listede görünmemeli

