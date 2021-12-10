
/* --- Level --- */
const LEVEL = {
    // icon getter
    icon(index) {
        return [
            '🔙',
            '1️⃣',
            '2️⃣',
            '3️⃣',
            '4️⃣',
            '5️⃣',
            '6️⃣',
            '7️⃣'
        ][index]
    },
    // dom element generator
    domElement(index) {
        const level = document.createElement('div')

        // set the level
        level.setAttribute('class', 'game-button level')
        level.innerHTML = this.icon(index)

        return level
    },
    // inject levels in a given div
    inject(div, n) {
        // array of levels
        const array = []

        // if there are some old levels
        if (div.innerHTML != '') return

        for (let i = 0; i < n + 1; i++) {
            const el = this.domElement(i)
            array.push(el)
            div.appendChild(el)
        }

        return array
    }
}
