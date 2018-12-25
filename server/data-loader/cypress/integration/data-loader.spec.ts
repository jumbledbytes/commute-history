/// <reference types="Cypress" />

context("Commute route", () => {
  it("Load commute data", () => {
    cy.visit("http://localhost:4002");
  });
});
