import {Game, actions} from './game.js'

// Website and Animation
var player_cards = null
var dealer_card = null

const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const cardNames = [2, 3, 4, 5, 6, 7, 8,9, 10, 11, 12, 13, 1];
var selectedCards = [null, null, null, null, null, null];

document.querySelectorAll('[data-index]').forEach(container => {
  const idx = parseInt(container.getAttribute('data-index'));
  cardValues.forEach((val,i) => {
    const btn = document.createElement('button');
    btn.textContent = val;
    btn.className = "card-btn inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white hover:bg-blue-100";
    btn.id = cardNames[i]
    btn.addEventListener('click', () => {
      container.querySelectorAll('button').forEach(b => b.classList.remove("bg-blue-600", "text-white"));
      btn.classList.add("bg-blue-600", "text-white");
      selectedCards[idx] = cardNames[i]
      update();
    });
    container.appendChild(btn);
  });
});

function update() {
    if(selectedCards[0] != null && selectedCards[1] != null && selectedCards[5] != null) {
        player_cards = []
        for (let i in selectedCards) {
            if(selectedCards[i]!=null && i != selectedCards.length -1){
                player_cards.push(selectedCards[i])
            }
        }
        dealer_card = selectedCards[5]
    }
}

document.getElementById('reset').addEventListener('click', ()=> {
  player_cards=null;
  dealer_card=null
  selectedCards = [null, null, null, null, null, null]
  info_label.innerHTML = 'Selectionne les cartes'
  document.querySelectorAll('[data-index]').forEach((container) => {
    container.querySelectorAll('button').forEach(b => b.classList.remove("bg-blue-600", "text-white"));
  })
})


const N=1000
const info_label = document.getElementById('info')

function loop(t) {
  if(player_cards != null) {
    var win = 0
    var egality = 0
    var loose = 0

      try {
          for (let i = 0; i<N; i++) {
              const game = new Game(1, player_cards.slice(), [dealer_card])
              const bet = game.play()
              if(bet > 0) {win+=1}
              else if(bet < 0) {loose+=1}
              else if(bet == 0) {egality+=1}
          }

          const game = new Game(1, player_cards.slice(), [dealer_card])
          const action = game.getActionFromTable(game.player, game.player_value)

          win = win/N
          egality = egality/N
          loose = loose/N
          info_label.innerHTML = 'Win prob : ' + (Math.round(win*100)/100).toString() 
          + '<br>Loose prob : ' + (Math.round(loose*100)/100).toString() 
          + '<br>Egality prob : ' + (Math.round(egality*100)/100).toString()
          + '<br>Action : ' + actions[action]
      } catch (error) {
        console.log(error)
        info_label.innerHTML = "Dépassement, veuillez reset" 
      }
  }

  requestAnimationFrame(loop)
}

loop()