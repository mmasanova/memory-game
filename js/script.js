
let cards = [];
let images = [ 'apple.jpg', 'apricot.png', 'banana.jpg', 'grapes.jpg', 'kiwi.jpg', 'orange.svg', 'plum.jpg', 'watermelon.jpg' ];

document.addEventListener('DOMContentLoaded', initialise);

function initialise() {
	createCards();
	shuffleCards();
	displayCards();
}

function createCards() {
	images = images.concat(images);

	for (let image of images) {
		let card = {
			image: image
		}

		cards.push(card);
	}	
}

function displayCards() {
	let html = '';
	const container = document.getElementById('cards-container');

	for (let card of cards) {
		html += `<div class="card">
					<div class="front">
						<img src="images/${card.image}">
					</div>
					<div class="back">
					</div>
				</div>`;
	}

	container.innerHTML = html;
}

function shuffleCards() {
	for (let cardX = 0; cardX < cards.length; cardX++) {
		const randomIndex = getRandomNumber(7);
		const tempCard = cards[cardX]
		cards[cardX] = cards[randomIndex];
		cards[randomIndex] = tempCard;
	}
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}