describe('UNWIND-API', () => {
    it('should return user info on login passed', () => {
        cy.request({
            url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/auth/signin',
            method: 'POST',
            body: {
                "email": "admin@admin.com",
                "password": "password"
            }
        })
            .as('response');

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

    it('should modify admin account', () => {
        cy.request({
            url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/auth/signin',
            method: 'POST',
            body: {
                "email": "admin@admin.com",
                "password": "password"
            }
        })
            .then(response => {
                cy.request({
                    url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/user/details',
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${response.body.token}`
                    },
                    body: {
                        "firstName": "Florian",
                        "lastName": "Admin",
                        "email": "admin@admin.com",
                        "oldPassword": "",
                        "newPassword": ""
                    }
                })
                    .as('response')
                    .its('status').should('equal', 200);
            })

        cy.get('@response')
            .its('body')
            .should((body) => {
                expect(body).to.have.property('firstName').to.be.equal('Florian');
                expect(body).to.have.property('lastName').to.be.equal('Admin');
                expect(body).to.have.property('email').to.be.equal('admin@admin.com');
                expect(body).to.have.property('error').to.be.null;
            });
    })

    it('should creates a Holiday Period and deletes it', () => {
        cy.request({
            url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/auth/signin',
            method: 'POST',
            body: {
                "email": "admin@admin.com",
                "password": "password"
            }
        })
            .then(loginResponse => {

                cy.request({
                    url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/holidayperiod',
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${loginResponse.body.token}`
                    },
                    body: {
                        "name": "Nom",
                        "startDateTime": "2023-11-23T00:00:00",
                        "endDateTime": "2023-11-24T00:00:00",
                        "place": {
                            "country": "BE",
                            "city": "Ville",
                            "street": "Rue",
                            "num": "10",
                            "zipCode": "1010"
                        }
                    }
                })
                    .then(postResponse => {
                        expect(postResponse.status).to.equal(200);
                        cy.request({
                            url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/holidayperiod/',
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${loginResponse.body.token}`
                            }
                        })
                            .then(getHolidayResponse => {
                                cy.request({
                                    url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/holidayperiod/' + getHolidayResponse.body[0].idHoliday,
                                    method: 'GET',
                                    headers: {
                                        'Authorization': `Bearer ${loginResponse.body.token}`
                                    }
                                })
                                    .then(getResponse => {
                                        expect(getResponse.status).to.equal(200);
                                        expect(getResponse.body).to.have.property('name').to.be.equal('Nom');
                                        expect(getResponse.body).to.have.property('startDateTime').to.be.equal('2023-11-23T00:00:00');
                                        expect(getResponse.body).to.have.property('endDateTime').to.be.equal('2023-11-24T00:00:00');
                                        expect(getResponse.body).to.have.property('place');
                                        expect(getResponse.body.place).to.have.property('country').to.be.equal('BE');
                                        expect(getResponse.body.place).to.have.property('city').to.be.equal('Ville');
                                        expect(getResponse.body.place).to.have.property('street').to.be.equal('Rue');
                                        expect(getResponse.body.place).to.have.property('num').to.be.equal('10');
                                        expect(getResponse.body.place).to.have.property('zipCode').to.be.equal('1010');
                                        cy.request({
                                            url: 'https://studapps.cg.helmo.be:5011/REST_DETI_EPPE/holidayperiod/' + getHolidayResponse.body[0].idHoliday,
                                            method: 'DELETE',
                                            headers: {
                                                'Authorization': `Bearer ${loginResponse.body.token}`
                                            }
                                        })
                                            .then(deleteResponse => {
                                                expect(deleteResponse.status).to.equal(200);
                                            })
                                    })
                            })
                    })
            })
    })
});