describe('Kullanıcı Yönetimi API Testleri', () => {
  it('Yeni bir kullanıcı oluşturulabilmeli', () => {
    cy.createUser({
      name: 'Ahmet Yılmaz',
      email: 'ahmet@test.com',
      password: '123456',
      role: 'employee'
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('id')
      expect(response.body.name).to.eq('Ahmet Yılmaz')
      expect(response.body.email).to.eq('ahmet@test.com')
      expect(response.body.role).to.eq('employee')
      expect(response.body).to.not.have.property('password_digest')
    })
  })

  it('Kullanıcılar listelenebilmeli', () => {
    cy.getUsers().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
      response.body.forEach((user) => {
        expect(user).to.have.property('id')
        expect(user).to.have.property('name')
        expect(user).to.have.property('email')
        expect(user).to.not.have.property('password_digest')
      })
    })
  })

  it('Kullanıcı bilgileri güncellenebilmeli', () => {
    cy.createUser({
      name: 'Test User',
      email: 'testupdate@example.com',
      password: '123456',
      role: 'employee'
    }).then((createResponse) => {
      const userId = createResponse.body.id
      
      cy.apiRequest('PATCH', `/users/${userId}`, {
        user: {
          name: 'Updated User',
          email: 'updated@example.com'
        }
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200)
        expect(updateResponse.body.name).to.eq('Updated User')
        expect(updateResponse.body.email).to.eq('updated@example.com')
      })
    })
  })

  it('Kullanıcı silinebilmeli', () => {
    cy.createUser({
      name: 'Delete Test',
      email: 'delete@test.com',
      password: '123456',
      role: 'employee'
    }).then((createResponse) => {
      const userId = createResponse.body.id
      
      cy.apiRequest('DELETE', `/users/${userId}`).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(204)
      })
    })
  })

  it('Aynı email ile kullanıcı oluşturulamaz', () => {
    const email = 'duplicate@test.com'
    
    cy.createUser({
      name: 'First User',
      email: email,
      password: '123456',
      role: 'employee'
    }).then(() => {
      cy.createUser({
        name: 'Second User',
        email: email,
        password: '123456',
        role: 'employee'
      }).then((response) => {
        expect(response.status).to.eq(422)
        expect(response.body).to.have.property('errors')
      })
    })
  })

  it('Password 6 karakterden kısa olamaz', () => {
    cy.createUser({
      name: 'Short Password',
      email: 'shortpass@test.com',
      password: '12345',
      role: 'employee'
    }).then((response) => {
      expect(response.status).to.eq(422)
      expect(response.body).to.have.property('errors')
    })
  })
})

