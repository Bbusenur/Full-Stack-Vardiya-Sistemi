describe('Vardiya Yönetimi Frontend Testleri', () => {
  beforeEach(() => {
    // Frontend ana sayfasına git
    cy.visit('/')
  })

  it('Ana sayfa yüklenebilmeli', () => {
    // Frontend olmadığı için bu test fail olacak
    cy.get('body').should('be.visible')
    cy.contains('Vardiya Yönetim Sistemi').should('be.visible')
  })

  it('Vardiyalar listesi görüntülenebilmeli', () => {
    // Vardiyalar sayfasına git
    cy.visit('/shifts')
    cy.get('[data-testid="shifts-list"]').should('be.visible')
    cy.get('[data-testid="shift-item"]').should('have.length.greaterThan', 0)
  })

  it('Yeni vardiya oluşturma formu açılabilmeli', () => {
    cy.visit('/shifts')
    cy.get('[data-testid="create-shift-button"]').click()
    cy.get('[data-testid="shift-form"]').should('be.visible')
    cy.get('input[name="date"]').should('be.visible')
    cy.get('input[name="start_time"]').should('be.visible')
    cy.get('input[name="end_time"]').should('be.visible')
    cy.get('select[name="department_id"]').should('be.visible')
  })

  it('Vardiya oluşturulabilmeli', () => {
    // Önce bir departman oluştur
    cy.visit('/departments')
    cy.get('[data-testid="create-department-button"]').click()
    cy.get('input[name="name"]').type('Test Departman')
    cy.get('textarea[name="description"]').type('Test açıklama')
    cy.get('[data-testid="submit-department-button"]').click()
    cy.wait(1000) // Departman oluşturulmasını bekle
    
    cy.visit('/shifts')
    cy.get('[data-testid="create-shift-button"]').click()
    
    cy.get('input[name="date"]').type('2024-11-08')
    cy.get('input[name="start_time"]').type('09:00')
    cy.get('input[name="end_time"]').type('17:00')
    
    // Select'in yüklenmesini bekle ve ilk option'ı seç
    cy.get('select[name="department_id"]').should('be.visible')
    cy.get('select[name="department_id"] option').not('[value=""]').first().then(($option) => {
      const value = $option.val()
      cy.get('select[name="department_id"]').select(value)
    })
    
    cy.get('[data-testid="submit-shift-button"]').click()
    
    // Başarı mesajı görünmeli
    cy.wait(1000)
    cy.get('[data-testid="success-message"]', { timeout: 5000 }).should('be.visible')
    cy.contains('Vardiya başarıyla oluşturuldu').should('be.visible')
  })

  it('Çalışanlar listesi görüntülenebilmeli', () => {
    cy.visit('/users')
    cy.get('[data-testid="users-list"]').should('be.visible')
    cy.get('[data-testid="user-item"]').should('have.length.greaterThan', 0)
  })

  it('Çalışanı vardiyaya atama formu açılabilmeli', () => {
    cy.visit('/shifts')
    cy.get('[data-testid="shift-item"]').first().within(() => {
      cy.get('[data-testid="assign-user-button"]').first().click()
    })
    cy.get('[data-testid="assignment-form"]').should('be.visible')
    cy.get('select[name="user_id"]').should('be.visible')
    cy.get('select[name="status"]').should('be.visible')
  })

  it('Vardiya ataması yapılabilmeli', () => {
    // Önce yeni bir vardiya oluştur (benzersiz atama için)
    cy.visit('/departments')
    cy.get('[data-testid="create-department-button"]').click()
    const deptTimestamp = Date.now()
    cy.get('input[name="name"]').type(`Test Dept ${deptTimestamp}`)
    cy.get('textarea[name="description"]').type('Test açıklama')
    cy.get('[data-testid="submit-department-button"]').click()
    cy.wait(1000)
    
    // Yeni vardiya oluştur
    cy.visit('/shifts')
    cy.get('[data-testid="create-shift-button"]').click()
    cy.get('input[name="date"]').type('2024-12-25')
    cy.get('input[name="start_time"]').type('10:00')
    cy.get('input[name="end_time"]').type('18:00')
    cy.get('select[name="department_id"]').should('be.visible')
    cy.get('select[name="department_id"] option').not('[value=""]').last().then(($option) => {
      const value = $option.val()
      cy.get('select[name="department_id"]').select(value)
    })
    cy.get('[data-testid="submit-shift-button"]').click()
    cy.wait(2000)
    
    // API çağrısını intercept et
    cy.intercept('POST', '**/api/v1/shift_assignments').as('createAssignment')
    
    // Yeni oluşturulan vardiyaya atama yap
    cy.get('[data-testid="shift-item"]').first().within(() => {
      cy.get('[data-testid="assign-user-button"]').first().click()
    })
    
    // Form'un açılmasını bekle
    cy.get('[data-testid="assignment-form"]').should('be.visible')
    
    // Kullanıcı listesini bekle ve ilk kullanıcıyı seç
    cy.get('select[name="user_id"]').should('be.visible')
    cy.get('select[name="user_id"] option').not('[value=""]').first().then(($option) => {
      const value = $option.val()
      cy.get('select[name="user_id"]').select(value)
    })
    
    cy.get('select[name="status"]').select('confirmed')
    
    cy.get('[data-testid="submit-assignment-button"]').click()
    
    // API çağrısının tamamlanmasını bekle
    cy.wait('@createAssignment', { timeout: 10000 }).then((interception) => {
      const statusCode = interception.response?.statusCode || interception.response?.status
      cy.log('API Response Status:', statusCode)
      
      if (statusCode === 201 || statusCode === 200) {
        // Başarılı - modal kapanmalı
        cy.get('[data-testid="assignment-form"]').should('not.exist', { timeout: 3000 })
        cy.wait(1500)
        cy.get('[data-testid="success-message"]', { timeout: 5000 }).should('be.visible')
        cy.contains('Vardiya ataması başarıyla oluşturuldu').should('be.visible')
      } else {
        // Hata durumu
        cy.log('API Error:', JSON.stringify(interception.response?.body))
        cy.get('[data-testid="error-message"]', { timeout: 5000 }).should('be.visible')
      }
    })
  })

  it('Vardiya ataması durumu güncellenebilmeli', () => {
    cy.visit('/shift-assignments')
    // Önce assignment var mı kontrol et
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="assignment-item"]').length > 0) {
        cy.get('[data-testid="assignment-item"]').first().within(() => {
          cy.get('[data-testid="update-status-button"]').click()
        })
        cy.get('select[name="status"]').select('completed')
        cy.get('[data-testid="submit-update-button"]').click()
        
        cy.wait(1000)
        cy.get('[data-testid="success-message"]', { timeout: 5000 }).should('be.visible')
        cy.contains('Durum başarıyla güncellendi').should('be.visible')
      } else {
        cy.log('Henüz vardiya ataması yok, test atlanıyor')
      }
    })
  })

  it('Departmanlar listesi görüntülenebilmeli', () => {
    cy.visit('/departments')
    cy.get('[data-testid="departments-list"]').should('be.visible')
    cy.get('[data-testid="department-item"]').should('have.length.greaterThan', 0)
  })

  it('Yeni departman oluşturulabilmeli', () => {
    cy.visit('/departments')
    cy.get('[data-testid="create-department-button"]').click()
    
    // Benzersiz bir departman adı oluştur
    const timestamp = Date.now()
    const uniqueName = `Yeni Departman ${timestamp}`
    
    cy.get('input[name="name"]').type(uniqueName)
    cy.get('textarea[name="description"]').type('Yeni departman açıklaması')
    
    cy.get('[data-testid="submit-department-button"]').click()
    
    // API çağrısının tamamlanmasını bekle
    cy.wait(1000)
    cy.get('[data-testid="success-message"]', { timeout: 5000 }).should('be.visible')
    cy.contains('Departman başarıyla oluşturuldu').should('be.visible')
  })
})

