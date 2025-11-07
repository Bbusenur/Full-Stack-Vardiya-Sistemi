// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('apiRequest', (method, endpoint, body = null) => {
  const options = {
    method: method,
    url: `${Cypress.env('apiUrl')}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
    failOnStatusCode: false,
  }

  if (body) {
    options.body = body
  }

  return cy.request(options)
})

Cypress.Commands.add('createUser', (userData) => {
  return cy.apiRequest('POST', '/users', { user: userData })
})

Cypress.Commands.add('createDepartment', (departmentData) => {
  return cy.apiRequest('POST', '/departments', { department: departmentData })
})

Cypress.Commands.add('createShift', (shiftData) => {
  return cy.apiRequest('POST', '/shifts', { shift: shiftData })
})

Cypress.Commands.add('createShiftAssignment', (assignmentData) => {
  return cy.apiRequest('POST', '/shift_assignments', { shift_assignment: assignmentData })
})

Cypress.Commands.add('getUsers', () => {
  return cy.apiRequest('GET', '/users')
})

Cypress.Commands.add('getDepartments', () => {
  return cy.apiRequest('GET', '/departments')
})

Cypress.Commands.add('getShifts', () => {
  return cy.apiRequest('GET', '/shifts')
})

Cypress.Commands.add('cleanDatabase', () => {
  // Bu komut backend'de bir endpoint olmalı veya direkt database'e erişim gerekir
  // Şimdilik manuel temizleme yapılacak
  cy.log('Database temizleme - backend endpoint gerekli')
})

