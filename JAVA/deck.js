window.addEventListener('DOMContentLoaded', () => {
    const suits = [
        { symbol: '♠', color: 'black' },
        { symbol: '♣', color: 'black' },
        { symbol: '♥', color: 'red' },
        { symbol: '♦', color: 'red' }
    ]
    const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    window.cardDeck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            window.cardDeck.push({value, suit: suit.symbol, color: suit.color});
            window.cardDeck.push({value, suit: suit.symbol, color: suit.color});
        });
    });
    window.cardDeck.sort(() => Math.random() - 0.5);
});