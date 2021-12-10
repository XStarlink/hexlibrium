const ANIMATIONS = {
    time: 1,
    // aviator animation
    aviatorAnimation: TweenMax.to(ELEMENTS['COURTAIN']['PLANE'], 3, {
        yoyoEase: Power1.easeInOut,
        ease: Power1.easeOut,
        top: '45%',
        repeat: -1,
        paused: true
    }),

    // courtain content animation
    animateContent() {
        return new Promise(resolve => {
            const tl = new TimelineMax({
                onComplete: () => setTimeout(resolve, 150)
            })
                // title animation
                .to(ELEMENTS['COURTAIN']['TITLE'], this.time, {
                    'opacity': 1,
                    'margin-left': 0,
                    'ease': Power3.easeOut
                })
                // plane animation
                .to(ELEMENTS['COURTAIN']['PLANE'], this.time, {
                    'top': '50%',
                    'left': '60%',
                    'ease': Power3.easeOut,
                    onComplete: () => ANIMATIONS.aviatorAnimation.play()
                })
        })
    },
    // show courtain content
    showContent() {
        return new Promise(onComplete => {
            // show the content
            ELEMENTS['COURTAIN']['CONTENT'].style.display = 'block'

            // change the opacity
            TweenMax.to(ELEMENTS['COURTAIN']['CONTENT'], this.time / 2, {
                opacity: 1,
                ease: Power1.easeIn,
                onComplete
            })
        })
    },
    // hide courtain content
    hideContent() {
        // hide content
        ELEMENTS['COURTAIN']['CONTENT'].style.opacity = 0
        ELEMENTS['COURTAIN']['CONTENT'].style.display = 'none'
    },
    // animate levels buttons
    animateLevels() {
        return new Promise(onComplete => {
            const tl = new TimelineMax({
                onComplete,
                delay: this.time / 3 * 2
            })

            // buttons animation
            ELEMENTS['LEVELS']['BUTTONS'].forEach(level => {
                tl.to(level, this.time / 2, {
                    'margin-left': 0,
                    'opacity': 1
                }, '-=' + this.time / 3)
            })
        })
    },

    // show courtain
    showCourtain() {
        return Promise.all([
            new Promise(onComplete => {
                // show courtain
                ELEMENTS['COURTAIN']['DIV'].style.display = 'block'

                const tl = new TimelineMax({
                    onComplete
                })
                    // courtain animation
                    .to(ELEMENTS['COURTAIN']['DIV'], this.time,
                        {
                            left: 0,
                            ease: Power2.easeOut
                        })
            }),
            // show courtain animation
            this.showContent()
        ])
    },
    // hide courtain
    hideCourtain() {
        return new Promise(resolve => {
            const tl = new TimelineMax({
                onComplete: () => {
                    // hide courtain
                    ELEMENTS['COURTAIN']['DIV'].style.display = 'none'
                    this.hideContent()

                    this.aviatorAnimation.pause()

                    resolve()
                }
            })
                // courtain animation
                .to(ELEMENTS['COURTAIN']['DIV'], this.time,
                    {
                        left: '-100vw',
                        ease: Power2.easeOut
                    })
        })
    },

    /* show/hide methods */

    // show levels
    showLevels() {
        return Promise.all([
            new Promise(async onComplete => {
                PARALLAX.pause()

                // set initial style
                TweenMax.set(ELEMENTS['COURTAIN']['DIV'], { left: '150vw' })
                TweenMax.set(ELEMENTS['LEVELS']['DIV'], { left: '100vw' })
                ELEMENTS['GAME']['DIV'].style.display = 'none'
                ELEMENTS['COURTAIN']['DIV'].style.display = 'block'
                ELEMENTS['LEVELS']['DIV'].style.display = 'grid'

                const tl = new TimelineMax({
                    onComplete
                })
                    // blur effect
                    .to(ELEMENTS['WORLDS']['DIV'], this.time, {
                        filter: 'blur(8px)',
                        ease: Power1.easeOut
                    })
                    // levels animation
                    .to(ELEMENTS['LEVELS']['DIV'], this.time, {
                        left: 0,
                        ease: Power3.easeOut
                    }, '-=' + this.time)
                    // courtain animation
                    .to(ELEMENTS['COURTAIN']['DIV'], this.time, {
                        left: '50vw',
                        ease: Power3.easeOut
                    }, '-= ' + this.time)
            }),
            this.animateLevels()
        ])
    },
    // hide levels
    hideLevels() {
        return new Promise(async resolve => {
            PARALLAX.play()

            const tl = new TimelineMax({
                onComplete: () => {
                    ELEMENTS['LEVELS']['DIV'].style.display = 'none'
                    ELEMENTS['COURTAIN']['DIV'].style.display = 'none'
                    ELEMENTS['LEVELS']['CONTAINER'].innerHTML = ''


                    resolve()
                }
            })
                // remove blur effect
                .to(ELEMENTS['WORLDS']['DIV'], this.time / 2, {
                    filter: 'blur(0)',
                    ease: Power1.easeOut
                })
                // level animation
                .to(ELEMENTS['LEVELS']['DIV'], this.time, {
                    left: '100vw',
                    ease: Power3.easeOut
                }, '-=' + this.time / 2)
                // courtain animation
                .to(ELEMENTS['COURTAIN']['DIV'], this.time, {
                    left: '100vw',
                    ease: Power3.easeOut
                }, '-= ' + this.time)
        })
    },
    // show game
    showGame() {
        return new Promise(async resolve => {
            const tl = new TimelineMax({
                onComplete: () => {
                    ELEMENTS['COURTAIN']['DIV'].style.left = '100vw'
                    ELEMENTS['LEVELS']['DIV'].style.left = '100vw'
                    ELEMENTS['LEVELS']['CONTAINER'].innerHTML = ''

                    this.hideContent()
                    resolve()
                }
            })

            this.showContent()

            tl
                // level animation
                .to(ELEMENTS['LEVELS']['DIV'], this.time, {
                    left: '-100vw',
                    ease: Power3.easeOut
                })
                // courtain animation
                .to(ELEMENTS['COURTAIN']['DIV'], this.time, {
                    left: '0',
                    ease: Power3.easeOut,
                    onComplete: () => {
                        // show the game
                        ELEMENTS['GAME']['DIV'].style.display = 'block'
                        ELEMENTS['WORLDS']['DIV'].style.display = 'none'
                        ELEMENTS['WORLDS']['DIV'].style.filter = 'blur(0px)'
                    }
                }, '-= ' + this.time)
                // game animation
                .to(ELEMENTS['COURTAIN']['DIV'], this.time, {
                    left: '-100vw',
                    ease: Power3.easeOut
                })
        })
    },
    // hide game
    hideGame() {
        return new Promise(async resolve => {
            // show courtain
            await this.showCourtain()
            // set the style
            ELEMENTS['WORLDS']['DIV'].style.display = 'block'
            ELEMENTS['GAME']['DIV'].style.display = 'none'
            TweenMax.set(ELEMENTS['GAME']['SPLIT'], { 'height': '100%' })
            // play the parrallax effect
            PARALLAX.play()
            // hide courtain
            await this.hideCourtain()
            resolve()
        })
    },
    // show home
    showHome() {
        this.aviatorAnimation.play()
        // show courtain
        return this.showCourtain()
    },
    // toggle menu
    toggleMenu() {
        return new Promise(async onComplete => {
            if (ELEMENTS['GAME']['MENU'].style.right == '-590px') {
                // show menu
                TweenMax
                    .to(ELEMENTS['GAME']['MENU'], this.time / 2, {
                        right: '0px',
                        ease: Power1.easeOut,
                        onComplete
                    })
            } else {
                // hide menu
                TweenMax
                    .to(ELEMENTS['GAME']['MENU'], this.time / 2, {
                        right: '-590px',
                        ease: Power1.easeOut,
                        onComplete
                    })
            }
        })
    }
}

// the handler will avoid the loading of an animations if the previous one is not finished
const HANDLER = new Proxy({ animating: false }, {
    get: function (target, prop) {
        // return the animating flag
        if (prop == 'animating') return target['animating']

        // if the old animation has finished
        if (!target['animating']) {
            target['animating'] = true
            // load animation
            return () => ANIMATIONS[prop]().then(() => target['animating'] = false)
        }

        return _ => _
    }
})