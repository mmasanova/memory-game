
let cards = [];
let images = [ 'cat.svg', 'cow.svg', 'fish.svg', 'owl.svg', 'panda.svg', 'pig.svg', 'penguin.svg', 'rabbit.svg' ];
let activeCards = [];
let startTime;
let finalTime;
let timer = null;
let noMoves = 0;
let starRating = 3;
let gameWon = false;

document.addEventListener('DOMContentLoaded', initialise);

function initialise() {
	const restart = document.getElementById('restart');
	restart.addEventListener('click', resetGame);

	images = images.concat(images);

	createCards();
	prepareGame();
}

/* Set up game */

function prepareGame() {
	noMoves = 0;
	starRating = 3;

	setUpStarRating();
	shuffleCards();
	displayCards();
}

function createCards() {
	let cardId = 0;

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

/* Restart game */

function resetGame() {
	resetTimer();
	resetMoves();
	clearCards();
	prepareGame();
}

function clearCards() {
	const container = document.getElementById('cards-container');

	for (let rowX = container.childNodes.length - 1; rowX >= 0; rowX--) {
		const row = container.childNodes[rowX];

		for (let cardX = row.childNodes.length - 1; cardX >= 0; cardX--) { 
			const card = row.childNodes[cardX];
			card.removeEventListener('click', cardClick);
			card.remove();
		}

		row.remove();
	}
}

/* Shuffle cards */

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

/* Handle card click */

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

	if (timer === null) startTimer();
}

function checkCardsMatch() {
	const card1 = cards[activeCards[0]];
	const card2 = cards[activeCards[1]];

	updateMoves();

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
	let won = true;

	for (let card of cards) {
		if (!card.pairFound) {
			won = false;
			break;
		}
	}

	if (won) {
		clearTimeout(timer);
		gameWon = true;
		alert('Congratulations, you won the game!');
	}
}

/* Timer */

function startTimer() {
	const dateNow = new Date();
	startTime = dateNow.getTime();
	timerTick();
}

function timerTick() {
	const dateNow = new Date();
	const timerElement = document.getElementById('timer');
	const ellapsedTime = new Date(dateNow.getTime() - startTime);
	const hours = formatTime(ellapsedTime.getHours());
	const minutes = formatTime(ellapsedTime.getMinutes());
	const seconds = formatTime(ellapsedTime.getSeconds());
	let displayTime = `${minutes}:${seconds}`;

	if (hours > 0) displayTime = `${hours}:${displayTime}`;

	timerElement.innerHTML = displayTime;

	if (!gameWon) {
		timer = setTimeout(timerTick, 1000);
	}
}

function formatTime(time) {
	if (time < 10) time = '0' + time;

	return time;
}

function resetTimer() {
	const timerElement = document.getElementById('timer');

	clearTimeout(timer);

	timer = null;
	timerElement.innerHTML = '00:00';
}

/* Moves */

function updateMoves() {
	const moves = document.getElementById('moves');
	
	noMoves += 1;
	moves.innerHTML = noMoves;

	updateStarRating();
}

function resetMoves() {
	const moves = document.getElementById('moves');
	moves.innerHTML = 0;
}

/* Star rating */

function updateStarRating() {
	const oldRating = starRating;
	let newRating;

	switch (true) {
		case noMoves <= 12:
			newRating = 3;
			break;

		case noMoves > 12 && noMoves <= 18:
			newRating = 2;
			break;

		case noMoves > 18 && noMoves <= 24:
			newRating = 1;
			break;

		default:
			newRating = 0;
	}

	if (newRating !== oldRating) {
		starRating = newRating;
		displayStarRating();
	}
}

function displayStarRating() {
	let updateStar = null;

	switch (starRating) {
		case 0:
			updateStar = document.getElementById('star-1');
			break;

		case 1:
			updateStar = document.getElementById('star-2');
			break;

		case 2:
			updateStar = document.getElementById('star-3');
			break;

		default:
			break;
	}

	if (updateStar !== null) {
		updateStar.classList.remove('mdi-star');
		updateStar.classList.add('mdi-star-outline');
	}
}

function setUpStarRating() {
	const starRating = document.getElementById('star-rating');
	let html = '';

	for (let starX = 0; starX < 3; starX++) {
		html += `<i id="star-${starX + 1}" class="mdi mdi-star star"></i>`;
	}

	starRating.innerHTML = html;
}