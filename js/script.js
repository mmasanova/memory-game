
let cards = [];
let activeCards = [];
let startTime;
let timer = null;
let ellapsedTime;
let noMoves = 0;
let starRating = 3;
let gameWon = false;
let animationTimeouts = {
	match: null,
	mismatch: null
};
let images = [ 
	'cat.svg', 
	'cow.svg', 
	'fish.svg', 
	'owl.svg', 
	'panda.svg', 
	'pig.svg', 
	'penguin.svg', 
	'rabbit.svg'
];

document.addEventListener('DOMContentLoaded', initialise);

/**
* @description Initialises images, restart button, cards and the game
*/
function initialise() {
	const restart = document.getElementById('restart');
	restart.addEventListener('click', resetGame);

	images = images.concat(images);

	createCards();
	prepareGame();
}

/* Set up game */

/**
* @description Prepares and displays new game
*/
function prepareGame() {
	gameWon = false;

	setUpStarRating();
	shuffleCards();
	displayCards();
}

/**
* @description Creates card objects
*/
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

/**
* @description Resets card objects' pairFound attributes
*/
function resetCards() {
	cards.forEach(function (card) {
		card.pairFound = false;
	});
}

/**
* @description Displays cards
*/
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

/**
* @description Resets the game
*/
function resetGame() {
	cancelAnimations();
	resetTimer();
	resetMoves();
	clearCards();
	resetCards();
	prepareGame();
}

/**
* @description Removes cards including listeners to avoid memory leaks in older browsers
*/
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

/**
* @description Shuffles cards, switches each card with another card with random index
*/
function shuffleCards() {
	for (let cardX = 0; cardX < cards.length; cardX++) {
		const randomIndex = getRandomNumber(7);
		const tempCard = cards[cardX]
		cards[cardX] = cards[randomIndex];
		cards[randomIndex] = tempCard;
	}
}

/**
* @description Calculates random number between 0 and max
* @param {number} max 
* @returns {number} random number
*/
function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/* Handle card click */

/**
* @description Turns clicked card
* @param {object} event Event that triggered the function
*/
function cardClick(event) {
	if (activeCards.length === 2) return;

	const card = event.currentTarget;
	const cardIndex = card.dataset.index;
	const alreadyFlipped = (activeCards.indexOf(cardIndex) !== -1);

	if (!cards[cardIndex].pairFound && activeCards.length < 2 && !alreadyFlipped) {
		card.classList.toggle('flip');
		activeCards.push(cardIndex);

		if (activeCards.length === 2) {
			setTimeout(checkCardsMatch, 300);
		}
	}

	if (timer === null) startTimer();
}

/**
* @description Checks if revealed pair of cards matches
*/
function checkCardsMatch() {
	const card1 = cards[activeCards[0]];
	const card2 = cards[activeCards[1]];
	const updateCards = activeCards.slice();

	updateMoves();
	updateStarRating();

	if (card1.image === card2.image) {
		card1.pairFound = true;
		card2.pairFound = true;

		animateMatchingCards(updateCards);
		checkGameWon();
	} else {
		shakeCards(updateCards);

		setTimeout(function() {
			flipCardsBack(updateCards);
		}, 300);
	}
}

/**
* @description Adds and removes animation to correctly matched cards
* @param {array} cardIndexes of cards to animate
*/
function animateMatchingCards(cardIndexes) {
	cardIndexes.forEach(function(cardIndex) {
		const card = document.getElementById(cards[cardIndex].id);
		card.classList.add('grow-shrink');

		animationTimeouts.match = setTimeout(function() { 
			card.classList.remove('grow-shrink');
			activeCards = [];
		}, 500);
	});
}

/**
* @description Adds and removes shaking animation to mismatched cards
* @param {array} cardIndexes of cards to shake
*/
function shakeCards(cardIndexes) {
	cardIndexes.forEach(function(cardIndex) {
		const card = document.getElementById(cards[cardIndex].id);
		card.classList.add('shake');

		animationTimeouts.mismatch = setTimeout(function() { 
			card.classList.remove('shake');
			activeCards = [];
		}, 300);
	});
}

/**
* @description Cancels any card animation timeouts that are running
*/
function cancelAnimations() {
	if (animationTimeouts.match !== null) {
		clearTimeout(animationTimeouts.match);
		animationTimeouts.match = null;
	}

	if (animationTimeouts.mismatch !== null) {
		clearTimeout(animationTimeouts.mismatch);
		animationTimeouts.mismatch = null;
	}
}

/**
* @description Flips current pair of revealed cards back
* @param {array} cardIndexes of cards to flip
*/
function flipCardsBack(cardIndexes) {
	cardIndexes.forEach(function(cardIndex) {
		const cardId = cards[cardIndex].id;
		document.getElementById(cardId).classList.toggle('flip');
	});
}

/* Game won */

/**
* @description Checks if game is won and shows popup if game is won
*/
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

/**
* @description Shows winning popup
*/
function showWinningPopup() {
	const wrapper = document.createElement('div');
	wrapper.id = 'popup-wrapper';

	const popup = document.createElement('div');
	popup.id = 'popup';

	const title = document.createElement('div');
	title.id = 'popup-title';
	title.innerText = 'You won!!!';
	
	popup.appendChild(title);

	const message = document.createElement('div');
	message.id = 'popup-message';
	message.innerText = 'Congratulations, you won the game in '; 

	if (ellapsedTime.minutes > 0) {
		const minutesText = (ellapsedTime.minutes > 1) ? 'minutes' : 'minute' +
			ellapsedTime.minutes + ' ' + minutesText + ' and ';
	}

	message.innerText += ellapsedTime.seconds + ' seconds with ' + starRating + ' star rating.' +
		'\r\nWould you like to play again?'

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

/**
* @description Removes popup and resets the game
*/
function popupYesClick() {
	removePopup();
	resetGame();
}

/**
* @description Removes winning popup
*/
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

/**
* @description Starts the timer
*/
function startTimer() {
	const dateNow = new Date();
	startTime = dateNow.getTime();
	timerTick();
}

/**
* @description Checks difference between start time and time now, displays the difference and prepares to run again if game not won
*/
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

/**
* @description Returns number of minutes and seconds from milliseconds
* @param {number} mills
* @returns {object} time
*/

/**
 * @typedef {Object} time
 * @property {number} seconds The number of seconds
 * @property {number} minutes The number of minutes
 */
function getTimeFromMilliseconds(mills) {
	const secondsMills = (mills % 60000);
	const seconds = (secondsMills / 1000).toFixed(0);
	const minutes = (mills - secondsMills) / 60000;
	const time = { seconds: seconds, minutes: minutes };

	return time;
}

/**
* @description Formats time integer to 2 digit format
* @param {number} time
* @returns {string} time in 2 digit format
*/
function formatTime(time) {
	if (time < 10) time = '0' + time;

	return time;
}

/**
* @description Resets the timer and the timer element
*/
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

/**
* @description Adds 1 to number of moves and updates moves indicator
*/
function updateMoves() {
	const moves = document.getElementById('moves');
	
	noMoves += 1;
	moves.innerHTML = noMoves;
}

/**
* @description Resets the moves indicator to 0
*/
function resetMoves() {
	const moves = document.getElementById('moves');
	moves.innerHTML = 0;
	noMoves = 0;
}

/* Star rating */

/**
* @description Updates star rating based on number of moves
*/
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

/**
* @description Displays star rating based on starRating current value
*/

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

/**
* @description Initialises star rating
*/
function setUpStarRating() {
	const starRatingContainer = document.getElementById('star-rating');
	let html = '';

	for (let starX = 0; starX < 3; starX++) {
		html += '<i id="star-' + (starX + 1) + '" class="mdi mdi-star star"></i>';
	}

	starRatingContainer.innerHTML = html;
	starRating = 3;
}