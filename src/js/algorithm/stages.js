Worlds.forEach(world => {
    world.stages.forEach(stage => {
        const colors = world.colors.blocks

        stage.levels.forEach((level, index) => {
            stage.levels[index] = Parser(level, colors)
        })
    })
})