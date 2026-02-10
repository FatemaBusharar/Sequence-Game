window.addEventListener('DOMContentLoaded', () => {

    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || []
    const playersContainer = document.querySelector('.player-info-container')
    const status = document.getElementById('status')
    const boardCards = document.querySelectorAll('.board-card')

    const playerColors = ['red', 'blue', 'green', 'yellow']
    let currentPlayer = 0
    let selectedCard = null
    let gameOver = false

    const boardState = Array(100).fill(null)

    const players = playerNames.map(name => ({
        name,
        score: 0,
        cards: []
    }))

    players.forEach(player => {
        for (let i = 0; i < 7; i++) {
            if (cardDeck.length) player.cards.push(cardDeck.pop())
        }
    })

    function renderPlayers() {
        playersContainer.innerHTML = ''

        players.forEach((player, pIndex) => {
            const div = document.createElement('div')
            div.className = 'player-info'
            div.innerHTML = `
                <h2>${player.name}</h2>
                <p>Score: ${player.score}</p>
                <p>Cards: ${player.cards.length}</p>
                <div class="cards-player"></div>
            `
            playersContainer.appendChild(div)

            const cardsDiv = div.querySelector('.cards-player')

            player.cards.forEach((card, cIndex) => {
                const c = document.createElement('div')
                c.className = `cardp ${card.color}`
                c.dataset.value = card.value
                c.dataset.suit = card.suit
                c.dataset.player = pIndex
                c.dataset.index = cIndex
                c.innerHTML = `
                    <div class='corner top'>${card.value} ${card.suit}</div>
                    <div class='center'>${card.suit}</div>
                    <div class='corner bottom'>${card.value} ${card.suit}</div>
                `
                cardsDiv.appendChild(c)

                c.onclick = () => {
                    if (pIndex !== currentPlayer || gameOver) return
                    document.querySelectorAll('.cardp').forEach(x => x.classList.remove('selected'))
                    c.classList.add('selected')
                    selectedCard = c
                }
            })
        })

        status.textContent = `${players[currentPlayer].name}'s Turn`
    }

    function checkWin(color) {
        const dirs = [[1,0],[0,1],[1,1],[1,-1]]

        for (let i = 0; i < 100; i++) {
            if (boardState[i] !== color) continue

            const r = Math.floor(i / 10)
            const c = i % 10

            for (let [dx, dy] of dirs) {
                let cells = [i]
                for (let s = 1; s < 5; s++) {
                    const nr = r + dx * s
                    const nc = c + dy * s
                    if (nr < 0 || nr > 9 || nc < 0 || nc > 9) break
                    const ni = nr * 10 + nc
                    if (boardState[ni] === color) cells.push(ni)
                    else break
                }
                if (cells.length === 5) {
                    cells.forEach(i => boardCards[i].classList.add('sequence'))
                    return true
                }
            }
        }
        return false
    }

    boardCards.forEach((bCard, index) => {
        bCard.onclick = () => {
            if (!selectedCard || gameOver) return
            if (bCard.classList.contains('taken') || bCard.classList.contains('free')) return

            if (
                bCard.dataset.value !== selectedCard.dataset.value ||
                bCard.dataset.suit !== selectedCard.dataset.suit
            ) return

            bCard.classList.add('taken', playerColors[currentPlayer])
            boardState[index] = playerColors[currentPlayer]

            const p = Number(selectedCard.dataset.player)
            const i = Number(selectedCard.dataset.index)
            players[p].cards.splice(i, 1)

            if (checkWin(playerColors[currentPlayer])) {
                document.getElementById('winnerText').textContent =
                    `${players[currentPlayer].name} Wins!`
                document.getElementById('winnerOverlay').style.display = 'flex'
                gameOver = true
                return
            }

            currentPlayer = (currentPlayer + 1) % players.length
            selectedCard = null
            renderPlayers()
        }
    })

    document.getElementById('resetGame').onclick = () => location.reload()

    renderPlayers()
})