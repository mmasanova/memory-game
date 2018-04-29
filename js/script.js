
let cards = [];
let images = [ 'cat.svg', 'cow.svg', 'fish.svg', 'owl.svg', 'panda.svg', 'pig.svg', 'penguin.svg', 'rabbit.svg' ];
let activeCards = [];
let startTime;
let timer = null;
let ellapsedTime;
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
	gameWon = false;

	setUpStarRating();
	resetCards();
	shuffleCards();
	displayCards();
}

function createCards() {
	let cardId = 0;

	images.forEach(function(image) {
		let card = {
			image: image,
			id: 'card' + cardId,
			pairFound: false
		}

		cards.push(card);
		cardId += 1;
	});	
}

function resetCards() {
	cards.forEach(function (card) {
		card.pairFound = false;
	});
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

		const front = document.createElement('div');
		front.className = 'front';

		const img = document.createElement('img');
		img.src = 'images/' + card.image;

		front.appendChild(img);
		cardDiv.appendChild(front);

		const back = document.createElement('div');
		back.className = 'back';
		cardDiv.appendChild(back);

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

/* Remove cards including listeners to avoid memory leaks in older browsers */
function clearCards() {
	const container = document.getElementById('cards-container');

	for (let rowX = container.childNodes.length - 1; rowX >= 0; rowX--) {
		const row = container.childNodes[rowX];

		for (let cardX = row.childNodes.length - 1; cardX >= 0; cardX--) { 
			const card = row.childNodes[cardX];
			card.removeEventListener('click', cardClick);
			card.parentNode.removeChild(card);
		}

		row.parentNode.removeChild(row);
	}
}

/* Shuffle cards */

/* Switch each card with another card with random index */
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
	activeCards.forEach(function(cardIndex) {
		const cardId = cards[cardIndex].id;
		document.getElementById(cardId).classList.toggle('flip');
	});
}

/* Game won */

function checkGameWon() {
	let won = true;

	for (let cardX = 0; cardX < cards.length; cardX++) {
		if (!cards[cardX].pairFound) {
			won = false;
			break;
		}
	}
	
	if (won) {
		gameWon = true;
		clearTimeout(timer);
		showWinningPopup();
	}
}

function showWinningPopup() {
	const wrapper = document.createElement('div');
	wrapper.id = 'popup-wrapper';

	const popup = document.createElement('div');
	popup.id = 'popup';

	const message = document.createElement('div');
	message.id = 'popup-message';
	message.innerText = 'Congratulations, you won the game in '; 

	if (ellapsedTime.minutes > 0) {
		const minutesText = (ellapsedTime.minutes > 1) ? 'minutes' : 'minute';
		message.innerText += ellapsedTime.minutes + ' ' + minutesText + ' and ';
	}

	message.innerText += ellapsedTime.seconds + ' seconds with ' + starRating + ' star rating.'
	message.innerText += '\r\nWould you like to play again?'

	popup.appendChild(message);

	const footer = document.createElement('div');
	footer.id = 'popup-footer';

	const noButton = document.createElement('button');
	noButton.innerHTML = 'No';
	noButton.id = 'popup-no';
	noButton.className = 'popup-button';
	noButton.addEventListener('click', removePopup);

	footer.appendChild(noButton);

	const yesButton = document.createElement('button');
	yesButton.innerHTML = 'Yes';
	yesButton.id = 'popup-yes';
	yesButton.className = 'popup-button';
	yesButton.addEventListener('click', popupYesClick);

	footer.appendChild(yesButton);

	popup.appendChild(footer);
	wrapper.appendChild(popup);
	document.body.appendChild(wrapper);
}

function popupYesClick() {
	removePopup();
	resetGame();
}

function removePopup() {
	const wrapper = document.getElementById('popup-wrapper');

	/* Remove event listeners to avoid memory leaks in older browsers */
	const noButton = document.getElementById('popup-no');
	noButton.removeEventListener('click', removePopup);

	const yesButton = document.getElementById('popup-yes');
	yesButton.removeEventListener('click', popupYesClick);

	wrapper.parentNode.removeChild(wrapper);
}

/* Timer */

function startTimer() {
	const dateNow = new Date();
	startTime = dateNow.getTime();
	timerTick();
}

/* Check difference between start time and time now, display the difference */
function timerTick() {
	const dateNow = new Date();
	const timerElement = document.getElementById('timer');
	
	const ellapsedTimeMills = dateNow.getTime() - startTime;
	ellapsedTime = getTimeFromMilliseconds(ellapsedTimeMills);
	
	let displayTime = formatTime(ellapsedTime.minutes) + ':' + formatTime(ellapsedTime.seconds);

	timerElement.innerHTML = displayTime;

	if (!gameWon) {
		timer = setTimeout(timerTick, 1000);
	}
}

function getTimeFromMilliseconds(mills) {
	const secondsMills = (mills % 60000);
	const seconds = (secondsMills / 1000).toFixed(0);
	const minutes = (mills - secondsMills) / 60000;

	return { seconds: seconds, minutes: minutes };
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
	ellapsedTime = {
		minutes: 0,
		seconds: 0
	};
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

		default:
			newRating = 1;
	}

	if (newRating !== oldRating) {
		starRating = newRating;
		displayStarRating();
	}
}

function displayStarRating() {
	let updateStar = null;

	switch (starRating) {
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
		html += '<i id="star-' + (starX + 1) + '" class="mdi mdi-star star"></i>';
	}

	starRating.innerHTML = html;
}