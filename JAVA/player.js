window.addEventListener('DOMContentLoaded', () => {

    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || []
    const playersContainer = document.querySelector('.player-info-container')
    const status = document.getElementById('status')
    const playerColors = ['red', 'blue', 'green', 'yellow']
    const deckCountEl = document.getElementById('deck-count')
    const sequenceCountEl = document.getElementById('sequence-count')
    const drawBtn = document.getElementById('drawCardBtn')
    const ROWS = 15
    const COLS = 6
    let turnTime = 15
    let timerInterval
    let currentPlayer = 0
    let selectedCard = null
    let totalSequences = 0

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

    deckCountEl.textContent = cardDeck.length
    sequenceCountEl.textContent = totalSequences

    function getBoardGrid() {
        const board = document.querySelectorAll('.board-card')
        let grid = []
        for (let i = 0; i < ROWS; i++) {
            grid[i] = []
            for (let j = 0; j < COLS; j++) grid[i][j] = board[i * COLS + j]
        }
        return grid
    }

    function checkSequencesFromCell(r, c, color, playerName) {
        const grid = getBoardGrid()
        let sequencesFound = 0
        function checkDirection(dr, dc) {
            for (let k = -4; k <= 0; k++) {
                let cells = []
                let valid = true
                for (let i = 0; i < 5; i++) {
                    let nr = r + (k + i) * dr
                    let nc = c + (k + i) * dc
                    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) { valid = false; break }
                    let cell = grid[nr][nc]
                    if (!cell.classList.contains(color)) { valid = false; break }
                    cells.push(cell)
                }
                if (!valid) continue
                const alreadyCounted = cells.every(cell => cell.dataset.sequenceOwner === playerName)
                if (alreadyCounted) continue
                cells.forEach(cell => cell.dataset.sequenceOwner = playerName)
                sequencesFound++
            }
        }
        checkDirection(0, 1)
        checkDirection(1, 0)
        checkDirection(1, 1)
        checkDirection(1, -1)
        return sequencesFound
    }

    function updateHints() {
        document.querySelectorAll('.board-card').forEach(card => card.classList.remove('hint-highlight'))
        if (!selectedCard) return
        const playerIndex = Number(selectedCard.dataset.player)
        const playerColor = playerColors[playerIndex]
        const playerName = players[playerIndex].name
        const grid = getBoardGrid()
        document.querySelectorAll('.board-card').forEach(boardCard => {
            if (boardCard.classList.contains('taken') || boardCard.classList.contains('free')) return
            if (boardCard.dataset.value !== selectedCard.dataset.value || boardCard.dataset.suit !== selectedCard.dataset.suit) return
            boardCard.classList.add('hint-highlight')
        })
    }

    function isBoardFull() {
        const boardCards = document.querySelectorAll('.board-card')
        return [...boardCards].every(card => card.classList.contains('taken') || card.classList.contains('free'))
    }

    function canPlayerPlay(player) {
        const freeBoard = document.querySelectorAll('.board-card:not(.taken):not(.free)')
        if (freeBoard.length === 0) return false
        return player.cards.some(card => [...freeBoard].some(boardCard => boardCard.dataset.value === card.value && boardCard.dataset.suit === card.suit))
    }

    function endGame() {
        let winner = players.reduce((a, b) => a.score > b.score ? a : b)
        alert(`Winner is ${winner.name} with ${winner.score} points`)
    }

    function showMessage(text, duration = 2000) {
        let overlay = document.getElementById('message-overlay')
        if (!overlay) {
            overlay = document.createElement('div')
            overlay.id = 'message-overlay'
            overlay.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0,0,0,0.85); color: white; padding: 20px 40px; font-size: 20px; border-radius: 10px; z-index: 9999; opacity: 0; transition: opacity 0.3s ease; pointer-events: none;'
            document.body.appendChild(overlay)
        }
        overlay.textContent = text
        overlay.style.opacity = '1'
        setTimeout(() => overlay.style.opacity = '0', duration)
    }

    function startTurnTimer() {
        clearInterval(timerInterval)
        let timeLeft = turnTime
        const timerEl = document.getElementById('timer')
        timerEl.textContent = `Time: ${timeLeft}s`
        timerInterval = setInterval(() => {
            timeLeft--
            timerEl.textContent = `Time: ${timeLeft}s`
            if (timeLeft <= 0) {
                clearInterval(timerInterval)
                showMessage(`${players[currentPlayer].name}'s time ran out! Turn skipped.`)
                nextPlayer()
            }
        }, 1000)
    }

    function nextPlayer() {
        selectedCard = null
        currentPlayer = (currentPlayer + 1) % players.length
        if (!canPlayerPlay(players[currentPlayer]) && cardDeck.length > 0 && !isBoardFull()) {
            while (players[currentPlayer].cards.length < 7 && cardDeck.length > 0) player.cards.push(cardDeck.pop())
        }
        renderPlayers()
        startTurnTimer()
    }

    function renderPlayers() {
        playersContainer.innerHTML = ''
        players.forEach((player, index) => {
            const div = document.createElement('div')
            div.className = 'player-info'
            div.innerHTML = `<h2>${player.name}</h2><p>Score: ${player.score}</p><p>Cards: ${player.cards.length}</p><div class="cards-player"></div>`
            playersContainer.appendChild(div)
            const cardsDiv = div.querySelector('.cards-player')
            player.cards.forEach((card, i) => {
                const c = document.createElement('div')
                c.className = `cardp ${card.color}`
                c.dataset.value = card.value
                c.dataset.suit = card.suit
                c.dataset.index = i
                c.dataset.player = index
                if (index !== currentPlayer) c.classList.add('disabled')
                c.innerHTML = `<div class='corner top'>${card.value} ${card.suit}</div><div class='center'>${card.suit}</div><div class='corner bottom'>${card.value} ${card.suit}</div>`
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
        deckCountEl.textContent = cardDeck.length
        sequenceCountEl.textContent = totalSequences
    }

    document.querySelectorAll('.board-card').forEach(boardCard => {
        boardCard.addEventListener('click', () => {
            if (!selectedCard) return
            const p = Number(selectedCard.dataset.player)
            if (p !== currentPlayer) return
            if (boardCard.classList.contains('taken') || boardCard.classList.contains('free')) return
            if (boardCard.dataset.value !== selectedCard.dataset.value || boardCard.dataset.suit !== selectedCard.dataset.suit) return
            const playerColor = playerColors[p]
            const playerName = players[p].name
            boardCard.classList.add('taken', playerColor)
            players[p].cards.splice(Number(selectedCard.dataset.index), 1)
            const grid = getBoardGrid()
            let r = Math.floor([...document.querySelectorAll('.board-card')].indexOf(boardCard) / COLS)
            let c = [...document.querySelectorAll('.board-card')].indexOf(boardCard) % COLS
            const seq = checkSequencesFromCell(r, c, playerColor, playerName)
            if (seq > 0) {
                players[p].score += seq * 100
                totalSequences += seq
            }
            selectedCard = null
            nextPlayer()
            document.querySelectorAll('.board-card').forEach(card => card.classList.remove('hint-highlight'))
            if (isBoardFull()) endGame()
        })
    })

    drawBtn.addEventListener('click', () => {
        const player = players[currentPlayer]
        if (player.cards.length >= 7) { showMessage('You already have 7 cards, cannot draw more'); return }
        const freeBoard = document.querySelectorAll('.board-card:not(.taken):not(.free)')
        const playableCards = player.cards.filter(card => [...freeBoard].some(boardCard => boardCard.dataset.value === card.value && boardCard.dataset.suit === card.suit))
        if (playableCards.length > 0) { showMessage('You still have playable cards'); return }
        if (cardDeck.length === 0) { showMessage('No more cards in the deck to draw'); return }
        player.cards.push(cardDeck.pop())
        renderPlayers()
    })

    document.getElementById('resetGame').onclick = () => location.reload()

    renderPlayers()
    startTurnTimer()

})