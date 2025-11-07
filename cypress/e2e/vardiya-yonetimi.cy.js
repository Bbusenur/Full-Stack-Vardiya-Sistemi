describe('Vardiya Yönetimi API Testleri', () => {
  let departmentId
  let userId
  let shiftId

  before(() => {
    // Test verilerini oluştur
    cy.createDepartment({
      name: 'Test Departman',
      description: 'Test açıklama'
    }).then((response) => {
      expect(response.status).to.eq(201)
      departmentId = response.body.id
    })

    cy.createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      role: 'employee'
    }).then((response) => {
      expect(response.status).to.eq(201)
      userId = response.body.id
    })
  })

  it('Yeni bir vardiya oluşturulabilmeli', () => {
    cy.createShift({
      date: '2024-11-08',
      start_time: '09:00:00',
      end_time: '17:00:00',
      department_id: departmentId
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('id')
      expect(response.body.date).to.eq('2024-11-08')
      expect(response.body.department.id).to.eq(departmentId)
      shiftId = response.body.id
    })
  })

  it('Vardiyalar listelenebilmeli', () => {
    cy.getShifts().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
      expect(response.body.length).to.be.greaterThan(0)
    })
  })

  it('Çalışan vardiyaya atanabilmeli', () => {
    cy.createShiftAssignment({
      user_id: userId,
      shift_id: shiftId,
      status: 'pending'
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('id')
      expect(response.body.status).to.eq('pending')
      expect(response.body.user.id).to.eq(userId)
      expect(response.body.shift.id).to.eq(shiftId)
    })
  })

  it('Vardiya ataması güncellenebilmeli', () => {
    cy.createShiftAssignment({
      user_id: userId,
      shift_id: shiftId,
      status: 'pending'
    }).then((createResponse) => {
      const assignmentId = createResponse.body.id
      
      cy.apiRequest('PATCH', `/shift_assignments/${assignmentId}`, {
        shift_assignment: {
          status: 'confirmed'
        }
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200)
        expect(updateResponse.body.status).to.eq('confirmed')
      })
    })
  })

  it('Vardiya silinebilmeli', () => {
    cy.createShift({
      date: '2024-11-09',
      start_time: '10:00:00',
      end_time: '18:00:00',
      department_id: departmentId
    }).then((createResponse) => {
      const newShiftId = createResponse.body.id
      
      cy.apiRequest('DELETE', `/shifts/${newShiftId}`).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(204)
      })
    })
  })
})

