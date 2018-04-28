
let cards = [];
let images = [ 'cat.svg', 'cow.svg', 'fish.svg', 'owl.svg', 'panda.svg', 'pig.svg', 'penguin.svg', 'rabbit.svg' ];
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
	let row;

	for (let cardX = 0; cardX < cards.length; cardX++) {
		if (cardX % 4 === 0) {
			if (cardX !== 0) {
				docFragment.appendChild(row);
			}

			row = document.createElement('div');
			row.className = 'row';
		}

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
		row.appendChild(cardDiv);
	}

	docFragment.appendChild(row);
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
	const alreadyFlipped = (activeCards.indexOf(cardIndex) !== -1);

	if (!cards[cardIndex].pairFound && activeCards.length < 2 && !alreadyFlipped) {
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