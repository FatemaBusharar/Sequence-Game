window.addEventListener('DOMContentLoaded', () => {
    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || []
    const playersContainer = document.querySelector('.player-info-container')
    const status = document.getElementById('status')
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
            if (cardDeck.length > 0) player.cards.push(cardDeck.pop())
        }
    })
    
    function getBoardGrid() {
        const board = document.querySelectorAll('.board-card')
        let grid = []
        for (let i = 0; i < 10; i++) {
            grid[i] = []
            for (let j = 0; j < 10; j++) {
                grid[i][j] = board[i * 10 + j]
            }
        }
        return grid
    }

    function checkSequencesFromCell(r, c, color, playerName, tempPlacement = false) {
        const grid = getBoardGrid()
        let sequencesFound = 0

        function checkDirection(dr, dc) {
            for (let k = -4; k <= 0; k++) {
                let cells = []
                for (let i = 0; i < 5; i++) {
                    let nr = r + (k + i) * dr
                    let nc = c + (k + i) * dc
                    if (nr < 0 || nr >= 10 || nc < 0 || nc >= 10) break
                    let cell = grid[nr][nc]
                    let hasColor = cell.classList.contains(color) || (tempPlacement && nr === r && nc === c)
                    if (!hasColor) break
                    if (!tempPlacement && cell.dataset['sequenceOwner'] === playerName) break
                    cells.push(cell)
                }
                if (cells.length === 5) {
                    if (!tempPlacement) cells.forEach(cell => cell.dataset['sequenceOwner'] = playerName)
                    sequencesFound++
                }
            }
        }

        checkDirection(0, 1)
        checkDirection(1, 0)
        checkDirection(1, 1)
        checkDirection(1, -1)

        return sequencesFound
    }

    function isBoardFull() {
        const boardCards = document.querySelectorAll('.board-card')
        return [...boardCards].every(card =>
            card.classList.contains('taken') ||
            card.classList.contains('free')
        )
    }

    function canPlayerPlay(player) {
        const freeBoard = document.querySelectorAll('.board-card:not(.taken):not(.free)')
        return player.cards.some(card => {
            return [...freeBoard].some(boardCard =>
                boardCard.dataset.value === card.value &&
                boardCard.dataset.suit === card.suit
            )
        })
    }

    function endGame() {
        let winner = players.reduce((a, b) => a.score > b.score ? a : b)
        alert(`Winner is ${winner.name} with ${winner.score} points`)
    }

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
                    updateHints()
                })
            })
        })
        status.textContent = `${players[currentPlayer].name}'s Turn`
    }

    function updateHints() {
        document.querySelectorAll('.board-card').forEach(card => card.classList.remove('hint-highlight'))
        if (!selectedCard) return
        const p = Number(selectedCard.dataset.player)
        const playerColor = playerColors[p]
        const playerName = players[p].name
        const grid = getBoardGrid()

        document.querySelectorAll('.board-card').forEach(boardCard => {
            if (boardCard.classList.contains('taken') || boardCard.classList.contains('free')) return
            if (
                boardCard.dataset.value !== selectedCard.dataset.value ||
                boardCard.dataset.suit !== selectedCard.dataset.suit
            ) return

            let r = [...grid].findIndex(row => row.includes(boardCard))
            let c = grid[r].indexOf(boardCard)
            const seq = checkSequencesFromCell(r, c, playerColor, playerName, true)
            if (seq >= 0) boardCard.classList.add('hint-highlight')
        })
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

            const p = Number(selectedCard.dataset.player)
            const playerColor = playerColors[p]
            const playerName = players[p].name
            boardCard.classList.add('taken', playerColor)

            const i = Number(selectedCard.dataset.index)
            players[p].cards.splice(i, 1) 

            const grid = getBoardGrid()
            let r = [...grid].findIndex(row => row.includes(boardCard))
            let c = grid[r].indexOf(boardCard)
            const seq = checkSequencesFromCell(r, c, playerColor, playerName)
            if (seq > 0) players[p].score += seq * 100

            selectedCard = null
            currentPlayer = (currentPlayer + 1) % players.length

            if (!canPlayerPlay(players[currentPlayer])) {
                while (players[currentPlayer].cards.length < 7 && cardDeck.length > 0) {
                    players[currentPlayer].cards.push(cardDeck.pop())
                }
            }

            document.querySelectorAll('.board-card').forEach(card => card.classList.remove('hint-highlight'))
            renderPlayers()
            updateHints()

            if (isBoardFull()) endGame()
        })
    })

    document.getElementById('resetGame').onclick = () => {
        location.reload()
    }
})