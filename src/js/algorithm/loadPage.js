            // load page
            (async () => {
                // animate the content
                await Promise.all([
                    ANIMATIONS.animateContent(),
                    new Promise(resolve => {
                        window.addEventListener('load', resolve)
                    })
                ])

                // add after the window has been loaded
                // ELEMENTS['COURTAIN']['DIV'].onclick = () => HANDLER.hideCourtain()
            })()