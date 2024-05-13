class CowBullsGame {
	constructor() {
		this.activeGames = {};
	}
	startGame(userId, secretLength) {
		this.activeGames[userId] = {
			secretWord: generateNewSecret(secretLength),
			tryCounter: 0,
		};
	}
	guessSecret(userId, guessWord) {
		if (guessWord === this.activeGames[userId].secretWord) {
			const tryCount = ++this.activeGames[userId].tryCounter;
			delete this.activeGames[userId];
			return tryCount;
		} else {
			if (!this.activeGames[userId].secretWord) {
				console.log('CowBullsGame error: secret word is missing.');
			}
			this.activeGames[userId].tryCounter++;
			return false;
		}
	}
	calculateBullsCows(userId, guessWord) {
		let bullsCount = 0,
			cowsCount = 0;
		for (let i = 0; i < this.activeGames[userId].secretWord.length; i++) {
			if (this.activeGames[userId].secretWord.indexOf(guessWord[i]) !== -1) {
				this.activeGames[userId].secretWord[i] === guessWord[i] ? bullsCount++ : cowsCount++;
			}
		}
		return { bulls: bullsCount, cows: cowsCount };
	}
	leaveGame(userId) {
		return delete this.activeGames[userId];
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
