const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const {MongoClient} = require('mongodb');
const client = new MongoClient(`mongodb+srv://cloud:${process.env.PASS}@cloud.o8s0t.mongodb.net/cloud?retryWrites=true&w=majority`);

const bot = new TelegramApi(process.env.BOT_TOKEN, {polling: true})

const chats = {}
const Users = client.db().collection('tgbot')

const startGame = async (chatId) => {
	
    await bot.sendMessage(chatId, `Men 0 dan 9 gacha raqam o'ylayman, sen topishga urinib ko'r)`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Qanaqa son o`yladm?', gameOptions);
}

const start = async () => {

    try {
        await client.connect()
	
    } catch (e) {
        console.log('Baza daniyga ulanib bolmadi', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Salom'},
        {command: '/info', description: 'Ma`lumot'},
        {command: '/game', description: 'Raqamni top'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
		if (!await Users.findOne({name: `${msg.from.first_name}`})) {
			await Users.insertOne({name: `${msg.from.first_name}`, right: 0, wrong: 0})
		}
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
                return bot.sendMessage(chatId, `Salom men Telegram bot! Bu Axrorning birinchi dasturi!!!`);
            }
            if (text === '/info') {
		if (!await Users.findOne({name: `${msg.from.first_name}`})) {
			await Users.insertOne({name: `${msg.from.first_name}`, right: 0, wrong: 0})
		}
                const user = await Users.findOne({name: `${msg.from.first_name}`})
                return bot.sendMessage(chatId, `Sening isming ${msg.from.first_name}, togri topilgan javoblar ${user.right}, notogrisi ${user.wrong}`);
            }
            if (text === '/game') {
               if (!await Users.findOne({name: `${msg.from.first_name}`})) {
			await Users.insertOne({name: `${msg.from.first_name}`, right: 0, wrong: 0})
		}
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, 'Nma deb yozganingni tushuna olmadm, yana bir bor urinib kor!)');
        } catch (e) {
		console.log('Baza daniyga ulanib bolmadi', e)
            return bot.sendMessage(chatId, 'Qandaydir nosozlik programmistga habar bering!');
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        let user = await Users.findOne({name: `${msg.from.first_name}`})
        if (data == chats[chatId]) {
		++user.right
            await Users.updateOne({name: `${msg.from.first_name}`},{$set: {right:`${user.right}`}});
            await bot.sendMessage(chatId, `Kallangga qoilm)) topib qo'yding!! ${chats[chatId]} to'g'ri topding`, againOptions);
        } else {
		++user.wrong
            await Users.updateOne({name: `${msg.from.first_name}`},{$set: {wrong:`${user.wrong}`}});
            await bot.sendMessage(chatId, `Topa olmading, men ${chats[chatId]} sonini o'ylagandim`, againOptions);
        }
      
    })
}

start()
