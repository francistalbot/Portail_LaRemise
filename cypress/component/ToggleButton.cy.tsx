import React from 'react'
import ToggleButton from '../../resources/js/Components/ToggleButton'

describe('ToggleButton Component', () => {
  it('should toggle between On and Off when clicked', () => {
    // Mount the component
    cy.mount(<ToggleButton />)
    
    // Initial state should be "Off"
    cy.contains('Off').should('be.visible')
    
    // Click the button
    cy.get('button').click()
    
    // Should now show "On"
    cy.contains('On').should('be.visible')
    
    // Click again
    cy.get('button').click()
    
    // Should be back to "Off"
    cy.contains('Off').should('be.visible')
  })
})