
let cards = [];
let images = [ 'apple.jpg', 'apricot.png', 'banana.jpg', 'grapes.jpg', 'kiwi.jpg', 'orange.svg', 'plum.jpg', 'watermelon.jpg' ];
let activeCards = [];

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
			id: 'card' + cardId,
			pairFound: false
		}

		cards.push(card);
		cardId += 1;
	}	
}

function displayCards() {
	const container = document.getElementById('cards-container');
	const docFragment = document.createDocumentFragment();


	for (let cardX = 0; cardX < cards.length; cardX++) {
		const card = cards[cardX];
		const cardDiv = document.createElement('div');
		cardDiv.className = 'card flip';
		cardDiv.id = card.id;
		cardDiv.dataset.index = cardX;

		const html = `<div class="front">
						<img src="images/${card.image}">
					</div>
					<div class="back">
					</div>`;

		cardDiv.innerHTML = html;
		cardDiv.addEventListener('click', cardClick);
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

function cardClick(event) {
	const card = event.currentTarget;
	const cardIndex = card.dataset.index;

	if (!cards[cardIndex].pairFound && activeCards.length < 2) {
		card.classList.toggle('flip');
		activeCards.push(cardIndex);

		if (activeCards.length === 2) {
			setTimeout(checkCardsMatch, 500);
		}
	}
}

function checkCardsMatch() {
	const card1 = cards[activeCards[0]];
	const card2 = cards[activeCards[1]];

	if (card1.image === card2.image) {
		card1.pairFound = true;
		card2.pairFound = true;

		checkGameWon();
	} else {
		flipCardsBack();
	}

	activeCards = [];
}

function flipCardsBack() {
	for (let cardIndex of activeCards) {
		const cardId = cards[cardIndex].id;
		document.getElementById(cardId).classList.toggle('flip');
	}
}

function checkGameWon() {
	let gameWon = true;

	for (let card of cards) {
		if (!card.pairFound) {
			gameWon = false;
			break;
		}
	}

	if (gameWon) {
		alert('Congratulations, you won the game!');
	}
}