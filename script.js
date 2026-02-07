console.log('Game')

const board = document.getElementById('cards-container')
const suits = [
  { symbol: '♠', color: 'black' },
  { symbol: '♣', color: 'black' },
  { symbol: '♥', color: 'red' },
  { symbol: '♦', color: 'red' }
]

const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']

for (let i = 0; i < 100; i++) {
  const suit = suits[Math.floor(Math.random() * suits.length)]
  const value = values[Math.floor(Math.random() * values.length)]

  const card = document.createElement('div')
  card.className = `card ${suit.color}`

  card.innerHTML = `
    <div class="corner top">${value} ${suit.symbol}</div>
    <div class="center">${suit.symbol}</div>
    <div class="corner bottom">${value} ${suit.symbol}</div>
  `

  board.appendChild(card)
}