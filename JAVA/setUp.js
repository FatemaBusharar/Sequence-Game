const playersContainer = document.getElementById('players-container')
const addPlayerBtn = document.getElementById('add-player')
const startGameBtn = document.getElementById('start-game')
const errorMsg = document.getElementById('error-msg')

let playerCount = 2;

function updatePlayerNumbers() {
  const inputs = playersContainer.querySelectorAll('.player-input input')
  inputs.forEach((input, index) => {
    input.placeholder = `Player Name ${index + 1}`
  })
  playerCount = inputs.length
}

addPlayerBtn.addEventListener('click', () => {
  if(playerCount >= 12){
    alert('Maximum number of players is 12')
    return
  }

  const div = document.createElement('div')
  div.className = 'player-input'
  div.innerHTML = `
    <input type='text' placeholder='Player Name ${playerCount + 1}'>
    <button class="remove-player">✖</button>
  `
  playersContainer.appendChild(div)
  div.querySelector('input').focus()
  div.querySelector('.remove-player').addEventListener('click', () => {
    div.remove()
    updatePlayerNumbers()
  })
  updatePlayerNumbers()
});

startGameBtn.addEventListener('click', () => {
  const inputs = document.querySelectorAll('#players-container input')
  const playerNames = []

  inputs.forEach(input => {
    const name = input.value.trim()
    if(name !== '') playerNames.push(name)
  });

  if(playerNames.length < 2){
    errorMsg.textContent = `At least two players' names must be entered!`
    return
  }

  localStorage.setItem('playerNames', JSON.stringify(playerNames))
  window.location.href = 'Player.html'
})