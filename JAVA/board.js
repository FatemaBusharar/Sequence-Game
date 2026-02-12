console.log('Game')
// Wait for the DOM content to load before executing the script
window.addEventListener('DOMContentLoaded', () => {
    // Get the container element where the cards will be placed
    const board = document.getElementById('cards-container')

    // Define the four suits of a standard deck of cards, each with a symbol and color
    const suits = [
        { symbol: '♠', color: 'black' },
        { symbol: '♣', color: 'black' },
        { symbol: '♥', color: 'red' },
        { symbol: '♦', color: 'red' }
    ]

    // Define the possible card values from Ace to King
    const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']

    // Initialize an array to hold the cards for the board (double deck)
    let boardCard = []

    // Loop through each suit
    suits.forEach(suit => {
        // For each suit, loop through each value
        values.forEach(value => {
            // Add two identical cards for each suit-value combination
            boardCard.push({value, suit: suit.symbol, color: suit.color})
            boardCard.push({value, suit: suit.symbol, color: suit.color})
        })
    })

    // Shuffle the board cards randomly
    boardCard.sort(() => Math.random() - 0.5)

    // Define the positions for free/joker cells (indices 0, 14, 90, 104)
    const freePosition = [0, 14, 90, 104]

    // Create 105 card elements (for a 105-card board layout)
    for (let i = 0; i < 105; i++) {
        // Create a new div element for each card
        const card = document.createElement('div')
        // Set the base class for the card
        card.className = 'card board-card'

        // Check if the current position is a free/joker cell
        if (freePosition.includes(i)) {
            // Add classes for free and joker cell
            card.classList.add('free', 'joker-cell')
            // Set data attributes for joker
            card.dataset.value = 'JOKER'
            card.dataset.suit = 'gold'
            // Set inner HTML to display a star symbol
            card.innerHTML = `<div class='center'>★</div>`
        } else {
            // Pop a card from the shuffled boardCard array
            const currentCard = boardCard.pop()
            // Set data attributes for the card's value and suit
            card.dataset.value = currentCard.value
            card.dataset.suit = currentCard.suit
            // Add the color class based on the suit
            card.classList.add(currentCard.color)
            // Set inner HTML to display the card with corners and center
            card.innerHTML = `
                <div class='corner top'>${currentCard.value} ${currentCard.suit}</div>
                <div class='center'>${currentCard.suit}</div>
                <div class='corner bottom'>${currentCard.value} ${currentCard.suit}</div>
            `
        }

        // Append the card element to the board container
        board.appendChild(card)
    }
})