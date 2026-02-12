// Define the four suits of a standard deck of cards, each with a symbol and color
const suits = [
    { symbol: '♠', color: 'black' },
    { symbol: '♣', color: 'black' },
    { symbol: '♥', color: 'red' },
    { symbol: '♦', color: 'red' }
];

// Define the possible card values from Ace to King
const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']

// Initialize an empty array to hold the deck of cards, attached to the global window object
window.cardDeck = []

// Loop through each suit
suits.forEach(suit => {
    // For each suit, loop through each value
    values.forEach(value => {
        // Add two identical cards for each suit-value combination (creating a double deck)
        window.cardDeck.push({value, suit: suit.symbol, color: suit.color})
        window.cardDeck.push({value, suit: suit.symbol, color: suit.color})
    })
})

// Shuffle the deck randomly using a simple sort with random comparator
window.cardDeck.sort(() => Math.random() - 0.5)
