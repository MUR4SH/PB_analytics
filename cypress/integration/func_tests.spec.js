let maps = ["de_dust2","de_mirage","de_nuke","de_inferno","de_train","de_overpass","de_vertigo"];
const red = 'background: radial-gradient(55.15% 528.85% at 50% 50%, rgb(252, 85, 0) 0%, rgba(252, 85, 0, 0) 64.27%); opacity: 1;';
const green = 'background: radial-gradient(55.15% 528.85% at 50% 50%, green 0%, rgba(252, 85, 0, 0) 64.27%); opacity: 1;'
describe('Visit main pages', () => {
    it('Client page is available', () => {
        cy.visit('http://localhost:8383') // change URL to match your dev URL
    })
    it('Server page is available', () => {
        cy.visit('http://localhost:8181') // change URL to match your dev URL
    })
})

describe('Changing teams', () => {
    it('Change teams', () => {
        cy.visit('http://localhost:8181') 
        cy.get('#teaml').select(`1win`).trigger('change')
        //cy.get('#btn_accept').click()
        cy.get('#teamr').select(`100pg`).trigger('change')
        cy.get('#btn_accept').click()
    })
    it('Check changed teams', () => {
        cy.visit('http://localhost:8383') // change URL to match your dev URL
        cy.get('#teaml').should('have.attr','src','../teams/1win.png')
        cy.get('#teamr').should('have.attr','src','../teams/100pg.png')
    })
})

describe('Changing type and setting maps', () => {
    it('Change teams', () => {
        cy.visit('http://localhost:8181') 
        for(let i=1;i<=7;i++){
            cy.get('#map_a_'+i).select(maps[i-1]).trigger('change')
        }
        cy.get('#btn_accept').click()
    })
    it('Check changed teams', () => {
        cy.visit('http://localhost:8383') // change URL to match your dev URL
        cy.get('#teaml').should('have.attr','src','../teams/1win.png')
        cy.get('#teamr').should('have.attr','src','../teams/100pg.png')
        for(let i=1;i<=7;i++){
            cy.get('#'+i+'_obs').should('have.attr','src',`../maps/${maps[i-1]}.map.png`)
            cy.get('#'+i+'_obs_span').should('have.text',maps[i-1])
            cy.get('#'+i+'_obs_span').should('have.attr','style',i%2?red:green)
        }
    })
})