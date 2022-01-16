const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5080393390:AAHB1vPRcdAgj_ER2XXFPcpq05ldehkvSxo'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Men 0 dan 9 gacha raqam o'ylayman, sen topishga urinib ko'r)`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Qanaqa son o`yladm?', gameOptions);
}

const start = () => {
bot.setMyCommands([
  {command: '/start', description: 'Salom'},
  {command: '/info', description: 'Ma`lumot'},
  {command: '/game', description: 'Raqamni top'},
  ])

bot.on('message', async msg => {
  const text = msg.text;
  const chatId = msg.chat.id;
  
  if (text === '/start'){
      await bot.sendMessage(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp');
      return bot.sendMessage(chatId, `Salom men Telegram bot! Bu Axrorning birinchi dasturi!!!`);
  }
  if (text === '/info'){
      return bot.sendMessage(chatId, `Sening isming ${msg.from.first_name} ${msg.from.last_name}`);
  }
  if (text === '/game'){
    return startGame(chatId)
  }
  
  return bot.sendMessage(chatId, 'Nma deb yozganingni tushuna olmadm, yana bir bor urinib kor!)');
})

bot.on('callback_query', async msg => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  if (data === '/again') {
    return startGame(chatId)
  }
  if (data == chats[chatId]) {
    return bot.sendMessage(chatId, `Kallangga qoilm)) topib qo'yding!! ${chats[chatId]} to'g'ri topding`, againOptions)
  } else {
    return bot.sendMessage(chatId, `Topa olmading, men ${chats[chatId]} sonini o'ylagandim`, againOptions)
  }
  
})

}

start()
