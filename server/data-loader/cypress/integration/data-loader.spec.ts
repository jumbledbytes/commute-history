/// <reference types="Cypress" />

context("Commute route", () => {
  it("Load commute data", done => {
    cy.visit("http://localhost:4002");
    setTimeout(done, 10000);
  });
});
