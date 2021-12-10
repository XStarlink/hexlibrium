        /* --- Split --- */
        const SPLIT = Split(ELEMENTS['GAME']['SPLITS'], {
            onDragEnd: () => {
                // resize
                gamepad.blocklyManager.resize()
                Three.handleWindowResize()
            },
            elementStyle: (dimension, size, gutterSize) => {
                return {
                    'flex-basis': `calc(${size}% - ${gutterSize - 3}px)`
                }
            },
            gutterStyle: (dimension, gutterSize) => {
                if (/Mobi/.test(navigator.userAgent))
                    gutterSize += 13

                return {
                    'flex-basis': `${gutterSize}px`,
                }
            }
        })