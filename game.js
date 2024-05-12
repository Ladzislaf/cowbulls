class CowBullsGame {
	constructor() {
		this.secretWord = '';
		this.tryCounter = 0;
	}
	startGame(secretLength) {
		this.secretWord = generateNewSecret(secretLength);
	}
	guessSecret(guessWord) {
		if (guessWord === this.secretWord) {
			return this.tryCounter++;
		} else {
			if (!this.secretWord) {
				console.log('CowBullsGame error: secret word is missing.');
			}
			this.tryCounter++;
			return false;
		}
	}
	calculateBullsCows(guessWord) {
		let bullsCount = 0,
			cowsCount = 0;
		for (let i = 0; i < this.secretWord.length; i++) {
			if (this.secretWord.indexOf(guessWord[i]) !== -1) {
				this.secretWord[i] === guessWord[i] ? bullsCount++ : cowsCount++;
			}
		}
		return { bulls: bullsCount, cows: cowsCount };
	}
	getGameModeRegex() {
		return this.gameModes;
	}
}

function generateNewSecret(length) {
	let result = '';
	while (result.length < length) {
		const randomNumber = Math.floor(Math.random() * 10);
		if (result.indexOf(randomNumber) === -1) {
			result += randomNumber;
		}
	}
	return result;
}

export default new CowBullsGame();
