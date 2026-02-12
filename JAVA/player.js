window.addEventListener('DOMContentLoaded', () => {

    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || []
    const playersContainer = document.querySelector('.player-info-container')
    const status = document.getElementById('status')
    const playerColors = ['red', 'blue', 'green', 'yellow']
    const deckCountEl = document.getElementById('deck-count')
    const sequenceCountEl = document.getElementById('sequence-count')
    const drawBtn = document.getElementById('drawCardBtn')
    const ROWS = 15
    const COLS = 7

    let turnTime = 15
    let timerInterval
    let currentPlayer = 0
    let selectedCard = null
    let totalSequences = 0

    const players = playerNames.map(name => ({
        name,
        score: 0,
        cards: [],
        placedPositions: []  
    }))

    players.forEach(player => {
        for (let i = 0; i < 7; i++) {
            if (cardDeck.length > 0) player.cards.push(cardDeck.pop())
        }
    })

    deckCountEl.textContent = cardDeck.length
    sequenceCountEl.textContent = totalSequences

    function getCellCoordinates(boardCard) {
        const index = [...document.querySelectorAll('.board-card')].indexOf(boardCard)
        const r = Math.floor(index / COLS)
        const c = index % COLS
        return { r, c }
    }

    function checkSequencesFromCell(r, c, playerName) {
        const player = players.find(p => p.name === playerName)
        console.log(`Checking sequences for ${playerName} at (${r}, ${c}), placedPositions: ${JSON.stringify(player.placedPositions)}`)
        let sequencesFound = 0
        const positions = player.placedPositions
        const countedSequences = new Set()  
        const directions = [
            { dr: 0, dc: 1 },  
            { dr: 1, dc: 0 },  
            { dr: 1, dc: 1 },  
            { dr: 1, dc: -1 } 
        ]
        directions.forEach(({ dr, dc }) => {
            for (let i = 0; i < positions.length; i++) {
                const pos1 = positions[i]
                const pos2 = positions.find(p => p.r === pos1.r + dr && p.c === pos1.c + dc)
                const pos3 = positions.find(p => p.r === pos1.r + 2 * dr && p.c === pos1.c + 2 * dc)
                const pos4 = positions.find(p => p.r === pos1.r + 3 * dr && p.c === pos1.c + 3 * dc)
                if (pos2 && pos3 && pos4) {
                    const sequenceKey = `${pos1.r},${pos1.c}-${pos2.r},${pos2.c}-${pos3.r},${pos3.c}-${pos4.r},${pos4.c}`
                    if (!countedSequences.has(sequenceKey)) {
                        countedSequences.add(sequenceKey)
                        console.log(`Sequence found in direction (${dr}, ${dc}) at (${pos1.r}, ${pos1.c})`)
                        sequencesFound++
                    }
                }
            }
        })
        console.log(`Total sequences found at (${r}, ${c}): ${sequencesFound}`)
        return sequencesFound
    }

    function updateHints() {
        document.querySelectorAll('.board-card').forEach(card => card.classList.remove('hint-highlight'))
        if (!selectedCard) return
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
        console.log(`End game: checking scores...`)
        players.forEach(player => console.log(`${player.name}: ${player.score}`))
        let winner = players.reduce((a, b) => a.score > b.score ? a : b)
        alert(`Winner is ${winner.name} with ${winner.score} points`)
    }

    function showMessage(text, duration = 2000) {
        let overlay = document.getElementById('message-overlay')
        if (!overlay) {
            overlay = document.createElement('div')
            overlay.id = 'message-overlay'
            document.body.appendChild(overlay)
        }
        overlay.textContent = text
        overlay.classList.add('show')
        setTimeout(() => {
            overlay.classList.remove('show')
        }, duration)
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
        renderPlayers()
        startTurnTimer()
    }

    function renderPlayers() {
        playersContainer.innerHTML = ''
        players.forEach((player, index) => {
            const div = document.createElement('div')
            div.className = 'player-info'
            if (index===currentPlayer){
                div.classList.add('active')
            }
            div.innerHTML = `<h2>${player.name}</h2><p>Score: ${player.score}</p><p>Cards: ${player.cards.length}</p><div class="cards-player"></div>`
            console.log(`Rendering Player ${player.name}: score = ${player.score}`)
            playersContainer.appendChild(div)
            const cardsDiv = div.querySelector('.cards-player')
            player.cards.forEach((card, i) => {
                const c = document.createElement('div')
                c.className = `cardp ${card.color}`
                c.dataset.value = card.value
                c.dataset.suit = card.suit
                c.dataset.index = i
                c.dataset.player = index
                if (index !== currentPlayer) {
                    c.classList.add('disabled', 'face-down')
                    c.innerHTML = `<div class='center'></div>`
                } else {
                    c.innerHTML = `<div class='corner top'>${card.value} ${card.suit}</div><div class='center'>${card.suit}</div><div class='corner bottom'>${card.value} ${card.suit}</div>`
                }
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
            boardCard.dataset.sequenceOwner = playerName
            players[p].cards.splice(Number(selectedCard.dataset.index), 1)
            const { r, c } = getCellCoordinates(boardCard)
            players[p].placedPositions.push({ r, c })
            console.log(`Player ${playerName} placedPositions: ${JSON.stringify(players[p].placedPositions)}`)
            console.log(`Placed at (${r}, ${c})`)
            console.log(`Before: Player ${p} score: ${players[p].score}`)
            const seq = checkSequencesFromCell(r, c, playerName)
            console.log(`seq f:${seq},player: ${playerName}`)
            if (seq > 0) {
                players[p].score += seq * 100  
                totalSequences += seq
                console.log(`After: Player ${p} score: ${players[p].score}, totalSequences: ${totalSequences}`)
            } else {
                console.log(`No points added: seq = ${seq}`)
            }
            selectedCard = null
            nextPlayer()
            document.querySelectorAll('.board-card').forEach(card => card.classList.remove('hint-highlight'))
            if (isBoardFull()) endGame()
        })
    })

    drawBtn.addEventListener('click', () => {
        const player = players[currentPlayer]
        if (player.cards.length >= 7) { 
            showMessage('You already have 7 cards, cannot draw more') 
            return 
        }
        const freeBoard = document.querySelectorAll('.board-card:not(.taken):not(.free)')
        const playableCards = player.cards.filter(card => [...freeBoard].some(boardCard => boardCard.dataset.value === card.value && boardCard.dataset.suit === card.suit))
        if (playableCards.length > 0) { 
            showMessage('You still have playable cards') 
            return 
        }
        if (cardDeck.length === 0) { 
            showMessage('No more cards in the deck to draw') 
            return 
        }
        while (player.cards.length < 7 && cardDeck.length > 0) {
            player.cards.push(cardDeck.pop())
        }
        renderPlayers()
    })

    document.getElementById('resetGame').onclick = () => {
        document.querySelectorAll('.board-card').forEach(card => {
            card.dataset.sequenceOwner = ''  
            card.classList.remove('taken', 'red', 'blue', 'green', 'yellow')
        })
        players.forEach(player => player.placedPositions = [])
        location.reload()
    }

    renderPlayers()
    startTurnTimer()
})