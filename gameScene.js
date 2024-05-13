import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import cowBullsGame from './game.js';

const REGEX = {
	3: /^(?!.*(.).*\1)\d{3}$/,
	4: /^(?!.*(.).*\1)\d{4}$/,
	5: /^(?!.*(.).*\1)\d{5}$/,
	6: /^(?!.*(.).*\1)\d{6}$/,
};

const gameScene = new Scenes.BaseScene('game');

gameScene.enter(async ctx => {
	cowBullsGame.startGame(ctx.from.id, ctx.session.gameMode);
	return ctx.reply(`Я загадал ${ctx.session.gameMode}-значное число. Попытайтесь угадать.`);
});

gameScene.command('exit', async ctx => {
	cowBullsGame.leaveGame(ctx.from.id);
	await ctx.deleteMessage();
	await ctx.reply('Вы вышли из игры.');
	return ctx.scene.leave();
});

gameScene.on(message('text'), async ctx => {
	if (REGEX[ctx.session.gameMode].test(ctx.message.text)) {
		const userTry = ctx.message.text;
		const gameResult = cowBullsGame.guessSecret(ctx.from.id, userTry);
		await ctx.deleteMessage();
		if (gameResult) {
			await ctx.reply(`(${userTry}) | Верно!\nУгадано за ${gameResult} попыток.`);
			return ctx.scene.leave();
		} else {
			const hints = cowBullsGame.calculateBullsCows(ctx.from.id, userTry);
			return ctx.reply(`(${userTry}) | Быки: ${hints.bulls} | Коровы: ${hints.cows}.`);
		}
	}
	return ctx.reply(`Введено неверное число.\nЯ загадал ${ctx.session.gameMode}-значное число.\nЦифры не могут повторяться.`);
});

gameScene.on(message(), async ctx => {
	return ctx.reply(`Введено неверное число.\nЯ загадал ${ctx.session.gameMode}-значное число.\nЦифры не могут повторяться.`);
});

export default gameScene;
