describe('Vardiya Yönetim Sistemi - Demo', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Tam Sistem Demo - Tüm Özellikler', () => {
    // 1. Ana Sayfa
    cy.contains('Vardiya Yönetim Sistemi').should('be.visible')
    cy.wait(1000)

    // 2. Departman Oluşturma - Navbar'dan git
    cy.get('nav').contains('Departmanlar').click()
    cy.wait(500)
    
    const deptTimestamp = Date.now()
    cy.get('[data-testid="create-department-button"]').click()
    cy.get('input[name="name"]').type(`Demo Departman ${deptTimestamp}`)
    cy.get('textarea[name="description"]').type('Demo departman açıklaması')
    cy.get('[data-testid="submit-department-button"]').click()
    cy.wait(1500)
    cy.get('[data-testid="success-message"]').should('be.visible')
    cy.wait(1000)

    // 3. Kullanıcı Oluşturma - Navbar'dan git
    cy.get('nav').contains('Kullanıcılar').click()
    cy.wait(500)
    
    const userTimestamp = Date.now()
    cy.get('[data-testid="create-user-button"]').click()
    cy.get('input[name="name"]').type(`Demo Kullanıcı ${userTimestamp}`)
    cy.get('input[name="email"]').type(`demo${userTimestamp}@example.com`)
    cy.get('input[name="password"]').type('123456')
    cy.get('select[name="role"]').select('employee')
    cy.get('[data-testid="submit-user-button"]').click()
    cy.wait(1500)
    cy.get('[data-testid="success-message"]').should('be.visible')
    cy.wait(1000)

    // 4. Vardiya Oluşturma - Navbar'dan git
    cy.get('nav').contains('Vardiyalar').click()
    cy.wait(500)
    
    cy.get('[data-testid="create-shift-button"]').click()
    cy.get('input[name="date"]').type('2024-12-25')
    cy.get('input[name="start_time"]').type('09:00')
    cy.get('input[name="end_time"]').type('17:00')
    cy.get('select[name="department_id"]').should('be.visible')
    cy.get('select[name="department_id"] option').not('[value=""]').last().then(($option) => {
      cy.get('select[name="department_id"]').select($option.val())
    })
    cy.get('[data-testid="submit-shift-button"]').click()
    cy.wait(1500)
    cy.get('[data-testid="success-message"]').should('be.visible')
    cy.wait(1000)

    // 5. Vardiya Ataması
    cy.get('[data-testid="shift-item"]').first().within(() => {
      cy.get('[data-testid="assign-user-button"]').first().click()
    })
    cy.wait(500)
    
    cy.get('select[name="user_id"]').should('be.visible')
    cy.get('select[name="user_id"] option').not('[value=""]').last().then(($option) => {
      cy.get('select[name="user_id"]').select($option.val())
    })
    cy.get('select[name="status"]').select('confirmed')
    cy.get('[data-testid="submit-assignment-button"]').click()
    cy.wait(1500)
    cy.get('[data-testid="success-message"]').should('be.visible')
    cy.wait(1000)

    // 6. Vardiya Atamalarını Görüntüleme - Navbar'dan git
    cy.get('nav').contains('Vardiya Atamaları').click()
    cy.wait(500)
    cy.get('[data-testid="assignments-list"]').should('be.visible')
    cy.wait(1000)

    // 7. Atama Durumu Güncelleme
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="assignment-item"]').length > 0) {
        cy.get('[data-testid="assignment-item"]').first().within(() => {
          cy.get('[data-testid="update-status-button"]').click()
        })
        cy.get('select[name="status"]').select('completed')
        cy.get('[data-testid="submit-update-button"]').click()
        cy.wait(1500)
        cy.get('[data-testid="success-message"]').should('be.visible')
        cy.wait(1000)
      }
    })

    // 8. Kullanıcı Düzenleme - Navbar'dan git
    cy.get('nav').contains('Kullanıcılar').click()
    cy.wait(500)
    cy.get('[data-testid="user-item"]').first().click()
    cy.wait(500)
    cy.get('input[name="name"]').clear().type('Güncellenmiş Demo Kullanıcı')
    cy.get('[data-testid="submit-update-button"]').click()
    cy.wait(1500)
    cy.get('[data-testid="success-message"]').should('be.visible')
    cy.wait(1000)

    // 9. Ana Sayfaya Dönüş - Navbar'dan git
    cy.get('nav').contains('Ana Sayfa').click()
    cy.wait(1000)
    cy.contains('Vardiya Yönetim Sistemi').should('be.visible')
    cy.wait(1000)
  })
})

