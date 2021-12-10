let resetted = false,
currentStage = {}

// show alert if the user has not loaded the code
const showAlert = () => {
swal.fire({
    type: 'warning',
    title: 'You didn\'t load the code',
    text: 'You can\'t play the game until you load your code with the button below 🔄'
})
}

// set the colors
const setColors = (colors) => {
// set the blockly colours
Blockly.FieldColour.COLOURS = colors.blocks.concat(JollyColor)

// add the gradient effect
ELEMENTS['COURTAIN']['DIV'].style['background-image'] = 'linear-gradient(' + colors['background'][0] + ', ' + colors['background'][1] + ')';
ELEMENTS['GAME']['BOARD']['WORLD'].style['background-image'] = 'linear-gradient(' + colors['background'][0] + ', ' + colors['background'][1] + ')';
ELEMENTS['GAME']['BOARD']['CONTAINER'].style['background-image'] = 'linear-gradient(' + colors['background'][0] + ', ' + colors['background'][1] + ')';

// add the font color
ELEMENTS['LEVELS']['NAME'].style.color = colors.title
ELEMENTS['COURTAIN']['TITLE'].style.color = colors.title
ELEMENTS['GAME']['BOARD']['MENU-INFO'].style.color = colors.title

// change the hue of the buttons
ELEMENTS['LEVELS']['BUTTONS'].concat(Object.values(ELEMENTS['GAME']['BUTTONS']))
    .forEach(value => value.style.filter = 'hue-rotate(' + colors.hue + 'deg)')

// custom hue
ELEMENTS['LEVELS']['BUTTONS'][0].style.filter = 'hue-rotate(' + (colors.hue + 45) + 'deg)'
}

// level on click handler
const levelonclick = (stage, i) => () => {
if (HANDLER.animating) return
// update split sizes
SPLIT.setSizes([30, 70])

// update the current level
currentStage = stage

// update the blockly div
ELEMENTS['GAME']['DIV'].style = 'block'
ELEMENTS['GAME']['BOARD']['MENU-INFO'].innerHTML = 'Level - ' + (i + 1)
gamepad.blocklyManager.reset()
gamepad.restore(currentStage.name)

// update resetted
resetted = false

// load the level
game.load(stage.levels)

// show the game
HANDLER.showGame()

// resize
setTimeout(() => {
    Three.handleWindowResize()
    gamepad.blocklyManager.resize()
})
}

// world on click handler
const worldonclick = (i) => () => {
if (HANDLER.animating) return
const world = Worlds[i]

// update the world element
ELEMENTS['LEVELS']['FRAME'].style['background-image'] = WORLD.path(i)
ELEMENTS['GAME']['BOARD']['IMAGE'].style['background-image'] = WORLD.path(i)
ELEMENTS['LEVELS']['NAME'].innerHTML = world['name']

// set levels
ELEMENTS['LEVELS']['BUTTONS'] = LEVEL.inject(ELEMENTS['LEVELS']['CONTAINER'], world.stages.length) || ELEMENTS['LEVELS']['BUTTONS']
ELEMENTS['LEVELS']['BUTTONS'].slice(1).forEach((button, i) => button.onclick = levelonclick(world.stages[i], i))
ELEMENTS['LEVELS']['BUTTONS'][0].onclick = () => HANDLER.hideLevels()

// set colors
setColors(world.colors)

// show levels
HANDLER.showLevels()
}

// link the handlers
ELEMENTS['WORLDS']['WORLDS'].forEach((world, i) => world.onclick = worldonclick(i))

ELEMENTS['GAME']['BOARD']['WORLD'].onclick = async () => HANDLER.toggleMenu()
ELEMENTS['GAME']['BOARD']['SAVE'].onclick = () => gamepad.save(currentStage.name) + swal.fire({
type: 'success',
title: 'The code has been saved!'
})
ELEMENTS['GAME']['BOARD']['RESTORE'].onclick = () => gamepad.restore(currentStage.name) + swal.fire({
type: 'success',
title: 'The code has been restored from the last saved!'
})
ELEMENTS['GAME']['BOARD']['INFO'].onclick = () => swal.fire({
type: 'info',
title: currentStage.name,
html: currentStage.description
})
ELEMENTS['GAME']['BOARD']['SLIDER'].oninput = function () {
guiData.speed = this.value
}

ELEMENTS['GAME']['BUTTONS']['BACK'].onclick = () => HANDLER.hideGame() + game.reset()
ELEMENTS['GAME']['BUTTONS']['FORWARD'].onclick = () => resetted ? gamepad.forward() + gui.removeAnimation() : showAlert()
ELEMENTS['GAME']['BUTTONS']['BACKWARD'].onclick = () => resetted ? gamepad.backward() + gui.removeAnimation() : showAlert()
ELEMENTS['GAME']['BUTTONS']['PLAY'].onclick = () => resetted ? gamepad.togglePlay() : showAlert()
ELEMENTS['GAME']['BUTTONS']['RESET'].onclick = () => (resetted = true) + game.reset()

ELEMENTS['GAME']['BUTTONS']['SHOW-NEXT'].onclick = () => game.showNext()
ELEMENTS['GAME']['BUTTONS']['SHOW-PRIOR'].onclick = () => game.showPrior()

ELEMENTS['WORLDS']['HOME'].onclick = () => HANDLER.showHome()
//ELEMENTS['WORLDS']['FULLSCREEN'].onclick = toggleFullScreen

ELEMENTS['LEVELS']['WORLD'].onclick = () => HANDLER.hideLevels()