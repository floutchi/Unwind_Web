describe('template spec', () => {

  beforeEach(() => {
    cy.visit('https://panoramix.cg.helmo.be/~q210126/unwind/')
  })

  it('visit', () => {

    const title = cy.get('h2').first()

    title.contains('Unwind')
  })
})