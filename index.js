import { Telegraf, Markup, session, Scenes } from 'telegraf';
import dotenv from 'dotenv';
import gameScene from './gameScene.js';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([gameScene]);

bot.use(session());
bot.use(stage.middleware());

bot.telegram.setMyCommands([
	{ command: '/start', description: 'Перезапустить бота' },
	{ command: '/play', description: 'Начать игру' },
	{ command: '/exit', description: 'Выйти из игры' },
]);

bot.start(async (ctx) => {
	console.log('[Start] first name:', ctx.from.first_name);
	console.log('[Start] last name:', ctx.from.last_name);
	console.log('[Start] username:', ctx.from.username);
	await ctx.deleteMessage();
	return ctx.reply('Команда /play - начать игру.');
});

bot.command('play', async (ctx) => {
	await ctx.deleteMessage();
	return ctx.reply(
		'Выберите режим игры - сколько символов хотите отгадывать?',
		Markup.inlineKeyboard([
			[
				Markup.button.callback('3', 'play3'),
				Markup.button.callback('4', 'play4'),
				Markup.button.callback('5', 'play5'),
				Markup.button.callback('6', 'play6'),
			],
		])
	);
});

bot.command('exit', async (ctx) => {
	await ctx.deleteMessage();
	return ctx.reply('Игра еще не начата.\nКоманда /play - начать игру.');
});

bot.action('play3', (ctx) => {
	return playAction(ctx, 3);
});

bot.action('play4', (ctx) => {
	return playAction(ctx, 4);
});

bot.action('play5', (ctx) => {
	return playAction(ctx, 5);
});

bot.action('play6', (ctx) => {
	return playAction(ctx, 6);
});

async function playAction(ctx, gameMode) {
	ctx.session.gameMode = gameMode;
	await ctx.deleteMessage();
	await ctx.scene.enter('game');
	return ctx.answerCbQuery(gameMode);
}

if (process.env.ENV === 'local') {
	bot.launch(() => console.log('CowBulls bot is running locally.'));
} else {
	bot.launch(
		{
			webhook: {
				domain: process.env.WEBHOOK_DOMAIN,
				port: process.env.WEBHOOK_PORT || 443,
			},
		},
		() => console.log('CowBulls bot is running on webhook.')
	);
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
