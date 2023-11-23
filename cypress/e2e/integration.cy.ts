describe('UNWIND-API', () => {
    it('should return stats when get dates', () => {
        cy.request({
            url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/home/stats',
            method: 'GET',
        })
            .as('response')
            .its('status')
            .should('equal', 200);

        cy.get('@response').its('body').should((body) => {
            expect(body).to.have.property('totalUsers');
            expect(body).to.have.property('usersInHolidayPerPlace');
        })
    });

    it('should return stats of the app when get stats dates', () => {
        cy.request({
            url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/home/statsdates?startDate=2023-11-23&endDate=2023-11-25',
            method: 'GET',
        })
            .as('response')
            .its('status')
            .should('equal', 200);

        cy.get('@response').its('body').should((body) => {
            expect(body).to.have.property('totalUsers');
            expect(body).to.have.property('usersInHolidayPerPlace');
        })
    });

    

    it('should return user info on login passed', () => {
        cy.request({
            url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/auth/signin',
            method: 'POST',
            body: {
                "email": "admin@admin.com",
                "password": "password"
            }
        })
            .as('response')
            .its('status').should('equal', 200);


        cy.get('@response')
            .its('body')
            .should((body) => {
                expect(body).to.have.property('token');
                expect(body).to.have.property('email');
                expect(body).to.have.property('firstName');
                expect(body).to.have.property('lastName');
                expect(body).to.have.property('error').to.be.null;
            });
        cy.get('@response').its('body').then((body) => {
            const token = body.token;
            cy.request({
                url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/user/details',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .as('userDetails')
                .its('status')
                .should('equal', 200);

            cy.get('@userDetails')
                .its('body')
                .should((body) => {
                    expect(body).to.have.property('email');
                    expect(body).to.have.property('firstName');
                    expect(body).to.have.property('lastName');
                    expect(body).to.have.property('error').to.be.null;
                });
        });
    });

    it('should return an error on login not passed', () => {
        cy.request({
            url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/auth/signin',
            method: 'POST',
            failOnStatusCode: false,
            body: {
                "email": "admin@admin.com",
                "password": "wrongpassword"
            }
        })
            .as('response')
            .as('response')
            .its('status').should('equal', 400);

        cy.get('@response')
            .its('body')
            .should((body) => {
                expect(body).to.have.property('token').to.be.null;
                expect(body).to.have.property('email').to.be.null;
                expect(body).to.have.property('firstName').to.be.null;
                expect(body).to.have.property('lastName').to.be.null;
                expect(body).to.have.property('error').to.be.equal('Email ou mot de passe incorect.');
            });
    });
})