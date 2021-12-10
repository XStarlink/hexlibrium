var originalBlocklyContextMenuPopulate = Blockly.ContextMenu.populate_;
Blockly.ContextMenu.populate_ = function (options, rtl) {
    options = options.concat(
        {
            text: 'Set as breakpoint (forward)',
            enabled: true,
            callback: async () => {
                if (resetted) {
                    // do the debug without loading the animations
                    gui.asynchronizer.async.animarions && gui.asynchronizer.async.animarions.complete()
                    guiData.time = 0
                    await gamepad.debug(Blockly.selected.id, false)
                    guiData.time = 1
                } else {
                    showAlert()
                }
            }
        },
        {
            text: 'Set as breakpoint (backward)',
            enabled: true,
            callback: async () => {
                if (resetted) {
                    // do the debug without loading the animations
                    gui.asynchronizer.async.animarions && gui.asynchronizer.async.animarions.complete()
                    guiData.time = 0
                    await gamepad.debug(Blockly.selected.id, true)
                    guiData.time = 1
                } else {
                    showAlert()
                }
            }
        })

    return originalBlocklyContextMenuPopulate.apply(Blockly.ContextMenu, [options, rtl]);
}

// Remove the context menu of the functions to avoid the use of variables
Blockly.Blocks.procedures_callnoreturn.contextMenu = false
Blockly.Blocks.procedures_callreturn.contextMenu = false
Blockly.Blocks.procedures_defnoreturn.contextMenu = false
Blockly.Blocks.procedures_defreturn.contextMenu = false
Blockly.Blocks.procedures_ifreturn.contextMenu = false
Blockly.Blocks.procedures_mutatorarg.contextMenu = false
Blockly.Blocks.procedures_mutatorcontainer.contextMenu = false