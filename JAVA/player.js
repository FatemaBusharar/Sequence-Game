window.addEventListener('DOMContentLoaded', () => {
    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || []
    const playersContainer = document.querySelector('.player-info-container')
    let currentPlayerIndex = 0
    const cardDeck = window.cardDeck || []

    const players = playerNames.map((name, index) => {
        const playerCards = []
        for (let i = 0; i < 7; i++) {
            if(cardDeck.length === 0) break
            playerCards.push(cardDeck.pop())
        }
        const div = document.createElement('div')
        div.className = 'player-info'
        div.dataset.index = index
        div.innerHTML = `
        <h2 id="player-name-${index}">${name}</h2>
        <p>SCORE: <span id="score-${index}">0</span></p>
        <p>Cards: <span id="card-count-${index}">${playerCards.length}</span></p>
        <div class="cards-player" id="cards-player-${index}"></div>
        <button class="add-card" id="add-card-${index}">Add Card</button>`
        playersContainer.appendChild(div)
        const deckDiv = document.getElementById(`cards-player-${index}`)
        playerCards.forEach(card => {
            const cardDiv = document.createElement('div')
            cardDiv.classList.add('cardp', card.color)
            cardDiv.innerHTML = `
            <div class='corner top'>${card.value} ${card.suit}</div>
            <div class='center'>${card.suit}</div>
            <div class='corner bottom'>${card.value} ${card.suit}</div>`
            deckDiv.appendChild(cardDiv)
        })
        document.getElementById(`add-card-${index}`).addEventListener('click', () => {
            if(cardDeck.length === 0) return
            const newCard = cardDeck.pop()
            playerCards.push(newCard)
            const cardDiv = document.createElement('div')
            cardDiv.classList.add('cardp', newCard.color)
            cardDiv.innerHTML = `
            <div class='corner top'>${newCard.value} ${newCard.suit}</div>
            <div class='center'>${newCard.suit}</div>
            <div class='corner bottom'>${newCard.value} ${newCard.suit}</div>`
            deckDiv.appendChild(cardDiv)
            document.getElementById(`card-count-${index}`).textContent = playerCards.length
        })
        return { name, score: 0, cards: playerCards }
    })

    function updatePlayerDisplay() {
        const currentPlayer = players[currentPlayerIndex]
        document.getElementById('status').textContent = `${currentPlayer.name} 's Goes First `
        players.forEach((p, index) => {
            document.getElementById(`score-${index}`).textContent = p.score
            document.getElementById(`card-count-${index}`).textContent = p.cards.length
        })
    }

    updatePlayerDisplay();

    document.getElementById('resetGame').addEventListener('click', () => {
        currentPlayerIndex = 0
        players.forEach(p => {
            p.score = 0
            p.cards = []
            for (let i = 0; i < 7; i++) {
                if(cardDeck.length === 0) break
                p.cards.push(cardDeck.pop())
            }
        });
        players.forEach((p, index) => {
            const deckDiv = document.getElementById(`cards-player-${index}`)
            deckDiv.innerHTML = ''
            p.cards.forEach(card => {
                const cardDiv = document.createElement('div')
                cardDiv.classList.add('cardp', card.color)
                cardDiv.innerHTML = `
                    <div class='corner top'>${card.value} ${card.suit}</div>
                    <div class='center'>${card.suit}</div>
                    <div class='corner bottom'>${card.value} ${card.suit}</div>
                `
                deckDiv.appendChild(cardDiv)
            })
        })
        updatePlayerDisplay()
    })

    window.nextPlayer = function() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length
        updatePlayerDisplay()
    }
})