console.log('Game')
window.addEventListener('DOMContentLoaded', () => {
const board = document.getElementById('cards-container')

const suits = [
    { symbol: '♠', color: 'black' },
    { symbol: '♣', color: 'black' },
    { symbol: '♥', color: 'red' },
    { symbol: '♦', color: 'red' }
]

const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']

let boardCard = []

suits.forEach(suit =>{
    values.forEach(value=>{
        boardCard.push({value, suit: suit.symbol, color: suit.color})
        boardCard.push({value, suit: suit.symbol, color: suit.color})
    })
})

boardCard.sort(()=> Math.random() - 0.5)

const freePosition = [0,14,90,104]

for (let i = 0; i < 105; i++) {
    const card = document.createElement('div')
    card.className = 'card board-card'

    if (freePosition.includes(i)) {
        card.classList.add('free')
        card.innerHTML = `<div class='center'>⚝</div>`
    } else {
        const currentCard = boardCard.pop()
        card.dataset.value = currentCard.value
        card.dataset.suit = currentCard.suit

        card.classList.add(currentCard.color)
        card.innerHTML = `
            <div class='corner top'>${currentCard.value} ${currentCard.suit}</div>
            <div class='center'>${currentCard.suit}</div>
            <div class='corner bottom'>${currentCard.value} ${currentCard.suit}</div>
        `
    }

    board.appendChild(card)
}
})