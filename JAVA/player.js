window.addEventListener('DOMContentLoaded', () => {
    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || []
    const playersContainer = document.querySelector('.player-info-container')
    const status = document.getElementById('status')
    const boardState = Array(100).fill(null)

    const playerColors = ['red', 'blue', 'green', 'yellow']
    let currentPlayer = 0
    let selectedCard = null

    const players = playerNames.map(name => ({
        name,
        score: 0,
        cards: []
    }))

    players.forEach(player => {
        for (let i = 0; i < 7; i++) {
            player.cards.push(cardDeck.pop())
        }
    })

    function renderPlayers() {
        playersContainer.innerHTML = ''

        players.forEach((player, index) => {
            const div = document.createElement('div')
            div.className = 'player-info'
            div.innerHTML = `
                <h2>${player.name}</h2>
                <p>Score: ${player.score}</p>
                <p>Cards: <span id="count-${index}">${player.cards.length}</span></p>
                <div class="cards-player" id="cards-${index}"></div>
            `
            playersContainer.appendChild(div)

            const cardsDiv = div.querySelector('.cards-player')
            player.cards.forEach((card, i) => {
                const c = document.createElement('div')
                c.className = `cardp ${card.color}`
                c.dataset.value = card.value
                c.dataset.suit = card.suit
                c.dataset.index = i
                c.dataset.player = index
                c.innerHTML = `
                    <div class='corner top'>${card.value} ${card.suit}</div>
                    <div class='center'>${card.suit}</div>
                    <div class='corner bottom'>${card.value} ${card.suit}</div>
                `
                cardsDiv.appendChild(c)

                c.addEventListener('click', () => {
                    if (index !== currentPlayer) return
                    document.querySelectorAll('.cardp').forEach(x => x.classList.remove('selected'))
                    c.classList.add('selected')
                    selectedCard = c
                })
            })
        })

        status.textContent = `${players[currentPlayer].name}'s Turn`
    }

    renderPlayers()

    document.querySelectorAll('.board-card').forEach(boardCard => {
        boardCard.addEventListener('click', () => {
            if (!selectedCard) return
            if (boardCard.classList.contains('taken')) return
            if (boardCard.classList.contains('free')) return

            if (
                boardCard.dataset.value !== selectedCard.dataset.value ||
                boardCard.dataset.suit !== selectedCard.dataset.suit
            ) return

            boardCard.classList.add('taken', playerColors[currentPlayer])
            const index = document.querySelectorAll('.board-card').indexOf(boardCard)
            boardState[index] = playerColors[currentPlayer]

            const p = Number(selectedCard.dataset.player)
            const i = Number(selectedCard.dataset.index)
            players[p].cards.splice(i, 1)

            currentPlayer = (currentPlayer + 1) % players.length
            selectedCard = null
            renderPlayers()
        })
    })

    function checkWin(playerColor) {
        const directions = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1]
        ]
        for (let i = 0; i < 100; i++) {
            if (boardState[i] !== playerColor) continue
            const row = Math.floor(i / 10)
            const col = i % 10
            for (let [dx, dy] of directions) {
                let count = 1
                let cells = [i]
                for (let step = 1; step < 5; step++) {
                    const r = row + dx * step
                    const c = col + dy * step
                    if (r < 0 || r > 9 || c < 0 || c > 9) break
                    const idx = r * 10 + c
                    if (boardState[idx] === playerColor) {
                        count++
                        cells.push(idx)
                    } else break
                }
                if (count === 5) {
                    drawLine(cells)
                    return true
                }
            }
        }
        return false
    }
    document.getElementById('resetGame').onclick = () => {
        location.reload()
    }
})