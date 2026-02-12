// Get references to DOM elements for player container, buttons, and error message
const playersContainer = document.getElementById('players-container')
const addPlayerBtn = document.getElementById('add-player')
const startGameBtn = document.getElementById('start-game')
const errorMsg = document.getElementById('error-msg')

// Initialize player count to 2
let playerCount = 2

// Function to update the placeholder text for player input fields based on their index
function updatePlayerNumbers() {
  const inputs = playersContainer.querySelectorAll('.player-input input')
  inputs.forEach((input, index) => {
    input.placeholder = `Player Name ${index + 1}`
  })
  playerCount = inputs.length
}

// Function to display a temporary message overlay
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

// Add event listener to the add player button
addPlayerBtn.addEventListener('click', () => {
  // Check if the player count has reached the maximum of 4
  if(playerCount >= 4){
    showMessage('Maximum number of players is 4')
    return
  }

  // Create a new div element for the player input
  const div = document.createElement('div')
  div.className = 'player-input'
  div.innerHTML = `
    <input type='text' placeholder='Player Name ${playerCount + 1}'>
    <button class="remove-player">✖</button>
  `
  // Append the new player input to the container
  playersContainer.appendChild(div)
  // Focus on the new input field
  div.querySelector('input').focus()
  // Add event listener to the remove button to delete the player input
  div.querySelector('.remove-player').addEventListener('click', () => {
    div.remove()
    updatePlayerNumbers()
  })
  // Update the player numbers after adding
  updatePlayerNumbers()
})

// Add event listener to the start game button
startGameBtn.addEventListener('click', () => {
  // Get all input fields for player names
  const inputs = document.querySelectorAll('#players-container input')
  const playerNames = []

  // Collect non-empty player names from inputs
  inputs.forEach(input => {
    const name = input.value.trim()
    if(name !== '') playerNames.push(name)
  })

  // Validate that at least two players are entered
  if(playerNames.length < 2){
    errorMsg.textContent = `At least two players' names must be entered!`
    return
  }

  // Store player names in localStorage and redirect to the game page
  localStorage.setItem('playerNames', JSON.stringify(playerNames))
  window.location.href = 'Player.html'
})