import { Telegraf, Markup, session, Scenes } from 'telegraf';
import dotenv from 'dotenv';
import server from './server.js';
import game3Scene from './scenes/game3.scene.js';
import game4Scene from './scenes/game4.scene.js';
import game5Scene from './scenes/game5.scene.js';
import game6Scene from './scenes/game6.scene.js';

dotenv.config();
server.start();

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([game3Scene, game4Scene, game5Scene, game6Scene]);

bot.use(session());
bot.use(stage.middleware());

bot.telegram.setMyCommands([
	{ command: '/start', description: 'Перезапустить бота' },
	{ command: '/play', description: 'Начать игру' },
]);

bot.start(async ctx => {
	await ctx.reply('Чтобы начать игру, используй команду /play');
});

bot.command('play', async ctx => {
	return ctx.reply('Выбери режим игры - сколько символов хочешь отгадывать?', Markup.inlineKeyboard([[Markup.button.callback('3', 'play3'), Markup.button.callback('4', 'play4'), Markup.button.callback('5', 'play5'), Markup.button.callback('6', 'play6')]]));
});

bot.action('play3', async ctx => {
	await ctx.deleteMessage();
	await ctx.scene.enter('game3');
	return ctx.answerCbQuery('3');
});
bot.action('play4', async ctx => {
	await ctx.deleteMessage();
	await ctx.scene.enter('game4');
	return ctx.answerCbQuery('4');
});
bot.action('play5', async ctx => {
	await ctx.deleteMessage();
	await ctx.scene.enter('game5');
	return ctx.answerCbQuery('5');
});
bot.action('play6', async ctx => {
	await ctx.deleteMessage();
	await ctx.scene.enter('game6');
	return ctx.answerCbQuery('6');
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
