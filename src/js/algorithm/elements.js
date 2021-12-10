        /* --- Elements --- */
        const ELEMENTS = {
            // game elements
            'GAME': {
                'DIV': document.querySelector('.game'),
                'SPLIT': document.querySelector('.split'),
                'SPLITS': document.querySelectorAll('.split-container'),
                'TOOLBOX': document.getElementById('toolbox'),
                'CANVAS': document.getElementById('canvas'),
                'MENU': document.querySelector('.game-menu'),
                'GAMEBOARD': {
                    'MOVES': document.querySelector('[data-use="moves"]'),
                    'TAKEN': document.querySelector('[data-use="taken"]'),
                    'OVER': document.querySelector('[data-use="over"]'),
                    'LEVEL': document.querySelector('[data-use="show-level"]')
                },
                'BUTTONS': {
                    'FORWARD': document.querySelector('[data-use="forward"]'),
                    'BACKWARD': document.querySelector('[data-use="backward"]'),
                    'RESET': document.querySelector('[data-use="reset"]'),
                    'PLAY': document.querySelector('[data-use="play"]'),
                    'SHOW-NEXT': document.querySelector('[data-use="show-next"]'),
                    'SHOW-PRIOR': document.querySelector('[data-use="show-prior"]'),
                    'BACK': document.querySelector('[data-use="back"]')
                },
                'BOARD': {
                    'WORLD': document.querySelector('.game-menu-world'),
                    'IMAGE': document.querySelector('.game-menu-image'),
                    'CONTAINER': document.querySelector('.game-menu-container'),
                    'MENU-INFO': document.querySelector('.game-menu-level'),
                    'SAVE': document.querySelector('[data-use="save"]'),
                    'RESTORE': document.querySelector('[data-use="restore"]'),
                    'INFO': document.querySelector('[data-use="info"]'),
                    'SLIDER': document.querySelector('[data-use="slider"]')
                }
            },
            // levels elements
            'LEVELS': {
                'DIV': document.querySelector('.levels'),
                'WORLD-VIEW': document.querySelector('.world-view'),
                'LEVEL-VIEW': document.querySelector('.level-view'),
                'CONTAINER': document.querySelector('.levels-container'),
                'NAME': document.querySelector('.name'),
                'BUTTONS': []
            },
            // worlds elements
            'WORLDS': {
                'DIV': document.querySelector('.worlds'),
                'HOME': document.querySelector('[data-use="home"]'),
                'TUTORIAL': document.querySelector('[data-use="tutorial"]'),
                'FULLSCREEN': document.querySelector('[data-use="fullscreen"]'),
                'WORLDS': [],
                'CONTAINERS': []
            },
            // courtain elements
            'COURTAIN': {
                'DIV': document.querySelector('.courtain'),
                'PLANE': document.querySelector('.aviator'),
                'CONTENT': document.querySelector('.content'),
                'TITLE': document.querySelector('.title')
            }
        }

        // generate all the worlds
        for (let i = 0; i < Worlds.length; i++) {
            const world = WORLD.domElement(i, Worlds[i].name)

            // push the elements
            ELEMENTS['WORLDS']['WORLDS'].push(world)
            ELEMENTS['WORLDS']['DIV'].appendChild(world)
            ELEMENTS['WORLDS']['CONTAINERS'].push(world.querySelector('.world-container'))
        }

        // generate the view
        ELEMENTS['LEVELS']['WORLD'] = WORLD.domElement()
        ELEMENTS['LEVELS']['WORLD-VIEW'].appendChild(ELEMENTS['LEVELS']['WORLD'])

        // set the frame
        ELEMENTS['LEVELS']['FRAME-CONTAINER'] = ELEMENTS['LEVELS']['WORLD-VIEW'].querySelector('.world-container')
        ELEMENTS['LEVELS']['FRAME'] = ELEMENTS['LEVELS']['FRAME-CONTAINER'].querySelector('.world-frame')

        // set all the texts
        ELEMENTS['WORLDS']['NAMES'] = document.querySelectorAll('.world-text')

        // close the menu
        ELEMENTS['GAME']['MENU'].style.right = '-590px'