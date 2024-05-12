import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import cowBullsGame from './game.js'

export const gameScene = new Scenes.BaseScene('game4');
gameScene.enter(async ctx => {
	cowBullsGame.startGame(4);
	return ctx.reply('Я загадал 4-значное число.');
});
gameScene.hears(/^(?!.*(.).*\1)\d{4}$/, async ctx => {
	const userTry = ctx.message.text;
	const gameResult = cowBullsGame.guessSecret(userTry)
	if (gameResult) {
		await ctx.reply(`Верно! Я загадал ${userTry}.\nУгадано за ${gameResult} попыток.`);
		return ctx.scene.leave();
	} else {
		const hints = cowBullsGame.calculateBullsCows(userTry);
		return ctx.reply(`Быки: ${hints.bulls} | Коровы: ${hints.cows}.`)
	}
});
gameScene.on(message(), async ctx => {
	return ctx.reply('Введено неверное число, попробуй снова. (Например, 1234)');
});


