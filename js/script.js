
let cards = [];
let images = [ 'apple.jpg', 'apricot.png', 'banana.jpg', 'grapes.jpg', 'kiwi.jpg', 'orange.svg', 'plum.jpg', 'watermelon.jpg' ];

document.addEventListener('DOMContentLoaded', createGrid);

function createGrid() {
	let html = '';
	images = images.concat(images);

	const container = document.getElementById('cards-container');

	for (let image of images) {
		let card = {
			image: image
		}

		cards.push(card);
	}

	for (let card of cards) {
		html += `<div class="card">
					<img src="images/${card.image}">
				</div>`;
	}

	container.innerHTML = html;
}