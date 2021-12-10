const WORLD = {
    // image path
    path: i => 'url("images/worlds/' + (i + 1) + '.png")',
    // depths for parallax effect
    depth: text => /Mobi/.test(navigator.userAgent)
        ? (text ? Math.random() * .1 + .1 : Math.random() * .3 + .3) + ''
        : (text ? '0.1' : '0.2'),
    // dom element generator
    domElement(i, name) {
        //  <world>
        //    <world-container>
        //       <world-text>
        //       <world-frame>
        // 
        let world = document.createElement('div'),
            container = document.createElement('div'),
            text = document.createElement('div'),
            frame = document.createElement('div')

        // set the world
        world.setAttribute('class', 'world')
        world.setAttribute('data-name', name)
        world.appendChild(container)

        // set the frame
        frame.setAttribute('class', 'world-frame')
        frame.style['background-image'] = this.path(i)
        frame.setAttribute('data-depth', this.depth())

        // set the text
        if (name) {
            text.setAttribute('class', 'world-text')
            text.setAttribute('data-depth', this.depth(true))
            text.innerHTML = name
            container.appendChild(text)
        }

        // set the container
        container.setAttribute('class', 'world-container')
        container.appendChild(frame)

        // return the world
        return world
    }
}