
let cards = [];
let images = [ 'apple.jpg', 'apricot.png', 'banana.jpg', 'grapes.jpg', 'kiwi.jpg', 'orange.svg', 'plum.jpg', 'watermelon.jpg' ];

document.addEventListener('DOMContentLoaded', initialise);

function initialise() {
	createCards();
	shuffleCards();
	displayCards();
}

function createCards() {
	let cardId = 0;
	images = images.concat(images);

	for (let image of images) {
		let card = {
			image: image,
			id: cardId
		}

		cards.push(card);
		cardId += 1;
	}	
}

function displayCards() {
	const container = document.getElementById('cards-container');
	const docFragment = document.createDocumentFragment();

	for (let card of cards) {
		const cardDiv = document.createElement('div');
		cardDiv.className = 'card flip';
		cardDiv.id = card.id;

		const html = `<div class="front">
						<img src="images/${card.image}">
					</div>
					<div class="back">
					</div>`;

		cardDiv.innerHTML = html;
		cardDiv.addEventListener('click', flipCard);
		docFragment.appendChild(cardDiv);
	}

	container.appendChild(docFragment);
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

function flipCard(event) {
		const card = event.currentTarget;
		card.classList.toggle('flip');
}