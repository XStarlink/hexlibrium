
/* --- Parallax ---*/
const PARALLAX = {
    // play the parallax effect
    play() {
        for (let world of this.worlds) world.enable()
    },
    // pause the parallax effect
    pause() {
        for (let world of this.worlds) world.disable()
    },
    worlds: []
}

// load parallax effect
for (frame of ELEMENTS['WORLDS']['CONTAINERS'])
    PARALLAX.worlds.push(new Parallax(frame, {
        relativeInput: true,
        limitX: 60,
        limitY: 60
    }))

// adjust the names after parallax has loaded
ELEMENTS['WORLDS']['NAMES'].forEach(el => el.style.top = '-1vw')
