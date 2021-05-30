let maps = ["de_dust2","de_mirage","de_nuke","de_inferno","de_train","de_overpass","de_vertigo"];
const red = 'background: radial-gradient(55.15% 528.85% at 50% 50%, rgb(252, 85, 0) 0%, rgba(252, 85, 0, 0) 64.27%); opacity: 1;';
const green = 'background: radial-gradient(55.15% 528.85% at 50% 50%, green 0%, rgba(252, 85, 0, 0) 64.27%); opacity: 1;'
describe('1 - Visit main pages', () => {
    it('Client page is available', () => {
        cy.visit('http://localhost:8383') // change URL to match your dev URL
    })
    it('Server page is available', () => {
        cy.visit('http://localhost:8181') // change URL to match your dev URL
    })
})

describe('2 - Changing teams', () => {
    it('Change teams', () => {
        cy.visit('http://localhost:8181') 
        cy.wait(1000)
        cy.get('#teaml').select(`1win`).trigger('change')
        //cy.get('#btn_accept').click()
        cy.get('#teamr').select(`100pg`).trigger('change')
        cy.get('#btn_accept').click()
    })
    it('Check changed teams', () => {
        cy.visit('http://localhost:8383') // change URL to match your dev URL
        cy.wait(1000)
        cy.get('#teaml').should('have.attr','src','../teams/1win.png')
        cy.get('#teamr').should('have.attr','src','../teams/100pg.png')
    })
})

describe('3 - Changing type and setting maps', () => {
    it('Change type and setting maps', () => {
        cy.visit('http://localhost:8181') 
        cy.wait(1000)

        cy.get('#gt').select('Bo3').trigger('change')
        for(let i=1;i<=7;i++){
            cy.get('#map_a_'+i).select(maps[i-1]).trigger('change')
        }
        cy.get('#btn_accept').click()
    })
    it('Check changed type and setted maps', () => {
        cy.visit('http://localhost:8383') // change URL to match your dev URL
        cy.wait(1000)
        for(let i=1;i<=7;i++){
            cy.get('#'+i+'_obs').should('have.attr','src',`../maps/${maps[i-1]}.map.png`)
            cy.get('#'+i+'_obs_span').should('have.text',maps[i-1])
            cy.get('#'+i+'_obs_span').should('have.attr','style',i%2?red:green)
        }
    })
})

describe('4 - Deleting maps', () => {
    it('Delete maps', () => {
        cy.visit('http://localhost:8181') 
        cy.wait(1000)

        for(let i=1;i<=3;i++){
            cy.get('#map_a_'+i).select('null').trigger('change')
        }
        
        cy.get('#btn_accept').click()
        
    })
    it('Check changed teams', () => {
        cy.visit('http://localhost:8383') // change URL to match your dev URL
        cy.wait(1000)
        cy.get('#teaml').should('have.attr','src','../teams/1win.png')
        cy.get('#teamr').should('have.attr','src','../teams/100pg.png')
        for(let i=1;i<=3;i++){
            cy.get('#'+i+'_obs').should('have.attr','src',`../maps/back_card.png`)
            cy.get('#'+i+'_obs_span').should('have.text','')
        }
    })
})

describe('5 - Refresh', () => {
    it('Press refresh', () => {
        cy.visit('http://localhost:8181') 
        cy.wait(1000)

        cy.get('#btn_close').click()
        
    })
    it('Check client page', () => {
        cy.visit('http://localhost:8383') // change URL to match your dev URL
        cy.wait(1000)
        cy.get('#teaml').should('have.attr','src','null')
        cy.get('#teamr').should('have.attr','src','null')
        for(let i=1;i<=7;i++){
            cy.get('#'+i+'_obs').should('have.attr','src',`../maps/back_card.png`)
            cy.get('#'+i+'_obs_span').should('have.text','')
        }
    })
})

describe('6 - Many uses', () => {
    it('First fill', () => {
        cy.visit('http://localhost:8181') 
        cy.wait(1000)
        cy.get('#btn_close').click()

        cy.get('#teaml').select(`ave`).trigger('change')
        cy.get('#teamr').select(`ex-winstrike`).trigger('change')
        cy.get('#gt').select('Bo1').trigger('change')
        for(let i=1;i<=7;i++){
            cy.get('#map_a_'+i).select(maps[7-i]).trigger('change')
        }
        cy.get('#btn_accept').click()
    })
    it('First check', () => {
        cy.visit('http://localhost:8383') // change URL to match your dev URL
        cy.wait(1000)
        cy.get('#teaml').should('have.attr','src','../teams/ave.png')
        cy.get('#teamr').should('have.attr','src','../teams/ex-winstrike.png')
        for(let i=1;i<=7;i++){
            cy.get('#'+i+'_obs').should('have.attr','src',`../maps/${maps[7-i]}.map.png`)
            cy.get('#'+i+'_obs_span').should('have.text',maps[7-i])
            cy.get('#'+i+'_obs_span').should('have.attr','style',(i!=4)?red:green)
        }
    })
    it('Second fill', () => {
        cy.visit('http://localhost:8181') 
        cy.wait(1000)
        cy.get('#btn_close').click()

        cy.get('#teaml').select(`nemiga`).trigger('change')
        cy.get('#teamr').select(`trident`).trigger('change')
        cy.get('#gt').select('Bo3').trigger('change')
        for(let i=1;i<=7;i++){
            if(i!=1 && i!=3 && i!=5 ) cy.get('#map_a_'+i).select(maps[7-i]).trigger('change')
        }
        cy.get('#btn_accept').click()
    })
    it('Second check', () => {
        cy.visit('http://localhost:8383') // change URL to match your dev URL
        cy.wait(1000)
        cy.get('#teaml').should('have.attr','src','../teams/nemiga.png')
        cy.get('#teamr').should('have.attr','src','../teams/trident.png')
        for(let i=1;i<=7;i++){
            
            if(i!=1 && i!=3 && i!=5 ) {
                cy.get('#'+i+'_obs').should('have.attr','src',`../maps/${maps[7-i]}.map.png`)
                cy.get('#'+i+'_obs_span').should('have.text',maps[7-i])
                cy.get('#'+i+'_obs_span').should('have.attr','style',(i%2)?red:green)
            }else{
                cy.get('#'+i+'_obs').should('have.attr','src',`../maps/back_card.png`)
                cy.get('#'+i+'_obs_span').should('have.text','')
            }

        }
    })
    it('Third fill', () => {
        cy.visit('http://localhost:8181') 
        cy.wait(1000)
        cy.get('#btn_close').click()

        cy.get('#teaml').select(`1win`).trigger('change')
        cy.get('#teamr').select(`nemiga`).trigger('change')
        cy.get('#gt').select('Bo5').trigger('change')
        for(let i=1;i<=7;i++){
            cy.get('#map_a_'+i).select(maps[7-i]).trigger('change')
        }
        cy.get('#btn_accept').click()
    })
    it('Third check', () => {
        cy.visit('http://localhost:8383') // change URL to match your dev URL
        cy.wait(1000)
        cy.get('#teaml').should('have.attr','src','../teams/1win.png')
        cy.get('#teamr').should('have.attr','src','../teams/nemiga.png')
        for(let i=1;i<=7;i++){
            cy.get('#'+i+'_obs').should('have.attr','src',`../maps/${maps[7-i]}.map.png`)
            cy.get('#'+i+'_obs_span').should('have.text',maps[7-i])
            cy.get('#'+i+'_obs_span').should('have.attr','style',(i==1 || i==7)?red:green)

        }
    })
})