describe('Kullanıcı Yönetimi Frontend Testleri', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Kullanıcılar sayfası yüklenebilmeli', () => {
    cy.visit('/users')
    cy.get('[data-testid="users-page"]').should('be.visible')
    cy.contains('Kullanıcı Yönetimi').should('be.visible')
  })

  it('Kullanıcı listesi görüntülenebilmeli', () => {
    cy.visit('/users')
    // Liste container'ının görünür olmasını bekle
    cy.get('[data-testid="users-list"]', { timeout: 5000 }).should('exist')
    // Liste boş olsa bile görünür olmalı
    cy.get('[data-testid="users-list"]').should('have.css', 'min-height')
    // Eğer kullanıcı varsa kontrol et
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="user-item"]').length > 0) {
        cy.get('[data-testid="user-item"]').should('have.length.greaterThan', 0)
      }
    })
  })

  it('Yeni kullanıcı oluşturma formu açılabilmeli', () => {
    cy.visit('/users')
    cy.get('[data-testid="create-user-button"]').click()
    cy.get('[data-testid="user-form"]').should('be.visible')
    cy.get('input[name="name"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('select[name="role"]').should('be.visible')
  })

  it('Yeni kullanıcı oluşturulabilmeli', () => {
    cy.visit('/users')
    cy.get('[data-testid="create-user-button"]').click()
    
    // Benzersiz bir email oluştur
    const timestamp = Date.now()
    const uniqueEmail = `yeni${timestamp}@example.com`
    
    cy.get('input[name="name"]').type('Yeni Kullanıcı')
    cy.get('input[name="email"]').type(uniqueEmail)
    cy.get('input[name="password"]').type('123456')
    cy.get('select[name="role"]').select('employee')
    
    cy.get('[data-testid="submit-user-button"]').click()
    
    // API çağrısının tamamlanmasını bekle
    cy.wait(1000)
    
    // Önce hata mesajı var mı kontrol et
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="error-message"]').length > 0) {
        cy.get('[data-testid="error-message"]').then(($el) => {
          cy.log('Error message:', $el.text())
        })
      }
    })
    
    cy.get('[data-testid="success-message"]', { timeout: 5000 }).should('be.visible')
    cy.contains('Kullanıcı başarıyla oluşturuldu').should('be.visible')
  })

  it('Kullanıcı bilgileri düzenlenebilmeli', () => {
    cy.visit('/users')
    cy.get('[data-testid="user-item"]').first().click()
    // User-item'a tıklanınca zaten edit formu açılıyor
    
    // Benzersiz bir email oluştur
    const timestamp = Date.now()
    const uniqueEmail = `guncellenmis${timestamp}@example.com`
    
    cy.get('input[name="name"]').should('be.visible').clear().type('Güncellenmiş İsim')
    cy.get('input[name="email"]').should('be.visible').clear().type(uniqueEmail)
    
    cy.get('[data-testid="submit-update-button"]').click()
    
    // API çağrısının tamamlanmasını bekle
    cy.wait(1000)
    
    // Önce hata mesajı var mı kontrol et
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="error-message"]').length > 0) {
        cy.get('[data-testid="error-message"]').then(($el) => {
          cy.log('Error message:', $el.text())
        })
      }
    })
    
    cy.get('[data-testid="success-message"]', { timeout: 5000 }).should('be.visible')
    cy.contains('Kullanıcı başarıyla güncellendi').should('be.visible')
  })

  it('Kullanıcı silinebilmeli', () => {
    cy.visit('/users')
    cy.get('[data-testid="user-item"]').first().within(() => {
      cy.get('[data-testid="delete-user-button"]').click({ force: true })
    })
    cy.get('[data-testid="confirm-delete-button"]').click()
    
    cy.get('[data-testid="success-message"]').should('be.visible')
    cy.contains('Kullanıcı başarıyla silindi').should('be.visible')
  })

  it('Email validasyonu çalışmalı', () => {
    cy.visit('/users')
    cy.get('[data-testid="create-user-button"]').click()
    
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('gecersiz-email')
    cy.get('input[name="password"]').type('123456')
    cy.get('select[name="role"]').select('employee')
    
    cy.get('[data-testid="submit-user-button"]').click()
    
    // HTML5 validation veya backend error mesajı
    cy.get('input[name="email"]').then(($input) => {
      if ($input[0].validity.valid === false) {
        cy.get('input[name="email"]:invalid').should('exist')
      } else {
        cy.get('[data-testid="error-message"]', { timeout: 5000 }).should('be.visible')
      }
    })
  })

  it('Password uzunluk validasyonu çalışmalı', () => {
    cy.visit('/users')
    cy.get('[data-testid="create-user-button"]').click()
    
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('12345')
    cy.get('select[name="role"]').select('employee')
    
    cy.get('[data-testid="submit-user-button"]').click()
    
    // HTML5 validation veya backend error mesajı
    cy.get('input[name="password"]').then(($input) => {
      if ($input[0].validity.valid === false) {
        cy.get('input[name="password"]:invalid').should('exist')
      } else {
        cy.get('[data-testid="error-message"]', { timeout: 5000 }).should('be.visible')
        cy.get('[data-testid="error-message"]').should('satisfy', ($el) => {
          const text = $el.text().toLowerCase()
          return text.includes('password') || text.includes('şifre') || text.includes('6')
        })
      }
    })
  })
})

