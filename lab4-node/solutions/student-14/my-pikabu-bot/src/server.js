import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { states } from '../src/utils/states.js';
import { newsSources } from '../src/utils/news-sources.js';
import { categoryKeyboard, frequencyKeyboard, newsCommandKeyboard, newsFilters, sourceKeyboard, createnewsKeyboard } from '../src/utils/keyboards.js';
import { displaySettings, displayNewsItem, applyFilters, saveToHistory } from '../src/utils/helper-functions.js';
import { fetchNews } from '../src/utils/news-parse.js';
import { ApiServer} from '../src/serverapi.js'

const runServer = () => {
  dotenv.config();
  const token = process.env.TELEGRAM_BOT_TOKEN;

  const bot = new TelegramBot(token, {polling: true});

  const userData = new Map();
  const userStates = new Map();
  const userNewsHistory = new Map();
  
  ApiServer(userData);

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id
    userStates.set(chatId, states.wait);
    bot.sendMessage(chatId, "👋 Привет! Я MyPicabu - бот-агрегатор новостей.\nНажми на /subscribes для настройки.")
  })

  bot.onText(/\/subscribes/, (msg) => {
    const chatId = msg.chat.id
    userStates.set(chatId, states.category);
    bot.sendMessage(chatId, "Отлично! Начнем настройку новостей\n\nШаг первый - выбор категории новостей. Используйте кнопки снизу, чтобы выбрать понравившуюся категорию:", categoryKeyboard)
  })

  bot.onText(/\/news/, (msg) => {
    const chatId = msg.chat.id
    const user = userData.get(chatId) || {}

    if (!user.category || !user.frequency || !user.sources) {
      bot.sendMessage(chatId, "❕ Вы не завершили настройку новостей. Для этого используйте команду /subscribes")
      return
    }
    else {
      const setting = displaySettings(user)
      bot.sendMessage(chatId, `${setting}\n\nВыберите действие, которое хотите совершить:`, newsCommandKeyboard)
    }
  })

  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id
    const callbackData = query.data
    const userState = userStates.get(chatId) || states.wait

    if (!userData.has(chatId)){
      userData.set(chatId, {}) 
    }
    const user = userData.get(chatId)

    if (userState == states.category) {
      if (callbackData == "politics") {
        user.category = "политика"
        user.sources = []
        bot.sendMessage(chatId, "Супер! Ваша категория - 🏦 политика.\nВторой шаг - выбор частоты рассылки.\n\nКак часто вы хотели бы смотреть новости?", frequencyKeyboard)
        userStates.set(chatId, states.frequency)
      }
      else if (callbackData == "economics") {
        user.category = "экономика"
        user.sources = []
        bot.sendMessage(chatId, "Супер! Ваша категория - 💵 экономика.\nВторой шаг - выбор частоты рассылки.\n\nКак часто вы хотели бы смотреть новости?", frequencyKeyboard)
        userStates.set(chatId, states.frequency)
      }
      else if (callbackData == "technologies") {
        user.category = "технологии"
        user.sources = []
        bot.sendMessage(chatId, "Супер! Ваша категория - 💻 технологии.\nВторой шаг - выбор частоты рассылки.\n\nКак часто вы хотели бы смотреть новости?", frequencyKeyboard)
        userStates.set(chatId, states.frequency)
      } 
      else {
        bot.sendMessage(chatId, "❕ Сначала выберите категорию новостей");
      }
    }

    else if (userState == states.frequency) {
      if (callbackData == "everyDay") {
        user.frequency = "ежедневная"
        bot.sendMessage(chatId, "Отлично, ваша частота рассылки - 📅 ежедневная.\nТретий шаг - выбор источников новостей.\n\nНиже представлены доступные источники выбранной вами категории. Пожалуйста, выберите источник, новости которого вы хотели бы видеть:", sourceKeyboard(user.category, user.sources || []))
        userStates.set(chatId, states.sources)
      }
      else if (callbackData == "onMondays") {
        user.frequency = "по понедельникам"
        bot.sendMessage(chatId, "Отлично, ваша частота рассылки - 📅 по понедельникам.\nТретий шаг - выбор источников новостей.\n\nНиже представлены доступные источники выбранной вами категории. Пожалуйста, выберите источник, новости которого вы хотели бы видеть:", sourceKeyboard(user.category, user.sources || []))
        userStates.set(chatId, states.sources)
      }
      else if (callbackData == "onWeekends") {
        user.frequency = "по выходным"
        bot.sendMessage(chatId, "Отлично, ваша частота рассылки - 📅 по выходным.\nТретий шаг - выбор источников новостей.\n\nНиже представлены доступные источники выбранной вами категории. Пожалуйста, выберите источник, новости которого вы хотели бы видеть:", sourceKeyboard(user.category, user.sources || []))
        userStates.set(chatId, states.sources)
      }
      else {
        bot.sendMessage(chatId, "❕ Сначала выберите частоту рассылки новостей")
      }
    }
    
    else if (userState == states.sources) {
      if (callbackData.startsWith("source_")) {
        const sourceId = callbackData.replace("source_", "")
        const categorySources = newsSources[user.category] || []
        const source = categorySources.find(s => s.id == sourceId)

        if (source) {
          if (!user.sources) user.sources = []
          if (user.sources.includes(sourceId)) {
            user.sources = user.sources.filter(id => id !== sourceId)
          } 
          else {user.sources.push(sourceId)}
        }

        const keyboard = sourceKeyboard(user.category, user.sources)
        await bot.editMessageReplyMarkup(keyboard.reply_markup, 
          {
            chat_id: chatId,
            message_id: query.message.message_id
          });
  
      }
      else if (callbackData == "done") {
        if (!user.sources || user.sources.length == 0) {
          bot.sendMessage(chatId, "Вы не завершили настройку. Пожалуйста выберите хотя бы один из источников")
          return
        }
        const setting = displaySettings(user)
        bot.sendMessage(chatId, `Ура!🥳 Вы завершили настройку новостей.\n${setting}\n\nТеперь их можно смотреть по команде /news`)
        userStates.set(chatId, states.completed) 
      }
      else {
        bot.sendMessage(chatId, "❕ Сначала выберите источники новостей")
      }
    }
    
    else {
      if (callbackData == "show_news") {
        await bot.sendMessage(chatId, "⏳ Загружаю новости...")

        const news = await fetchNews(user)

        if (news.length == 0) {
          await bot.sendMessage(chatId, "Не удалось загрузить новости..😔")
          return
        }

        user.currentNews = news
        user.currentFilter = 'filter_none'
        user.currentNewsIndex = 0

        const firstNews = user.currentNews[user.currentNewsIndex]
        const newsText = displayNewsItem(firstNews)
        const keyboard = createnewsKeyboard(user.currentNewsIndex, user.currentNews.length)

        saveToHistory(userNewsHistory, chatId, firstNews) 

        bot.sendMessage(chatId, newsText, keyboard)
      }

      else if (callbackData == "next_news") {
        if (user.currentNewsIndex + 1 < user.currentNews.length) {
          user.currentNewsIndex = user.currentNewsIndex + 1;
          const nextNews = user.currentNews[user.currentNewsIndex];

          saveToHistory(userNewsHistory, chatId, nextNews);

          const newsText = displayNewsItem(nextNews);
          const keyboard = createnewsKeyboard(user.currentNewsIndex, user.currentNews.length);
    
          bot.editMessageText(newsText, {
            chat_id: chatId,
            message_id: query.message.message_id,
            reply_markup: keyboard.reply_markup
          })
        }
        else {
          bot.answerCallbackQuery(query.id, { text: 'Это последняя новость' });
        }
      } 
      else if (callbackData == "previous_news") {
        if (user.currentNewsIndex - 1 >= 0) {
          user.currentNewsIndex = user.currentNewsIndex - 1;
    
          const previousNews = user.currentNews[user.currentNewsIndex];

          saveToHistory(userNewsHistory, chatId, previousNews);

          const newsText = displayNewsItem(previousNews);
          const keyboard = createnewsKeyboard(user.currentNewsIndex, user.currentNews.length);
    
          bot.editMessageText(newsText, {
            chat_id: chatId,
            message_id: query.message.message_id,
            reply_markup: keyboard.reply_markup
          })
        }
        else {
          bot.answerCallbackQuery(query.id, { text: 'Это первая новость' });
        }
      }

      else if (callbackData == "choose_filters") {
        bot.sendMessage(chatId, "Выберите фильтр для новостей:", newsFilters)
      }
      else if (callbackData.startsWith("filter_")) {
        if (!user.currentNews || user.currentNews.length === 0) {
          await bot.sendMessage(chatId, "❕ Сначала загрузите новости с помощью команды /news")
          return
        }
        
        user.currentFilter = callbackData;
        const filteredNews = applyFilters(user.currentNews, callbackData)
        user.currentNewsIndex = 0
        
        if (filteredNews.length === 0) {
          await bot.sendMessage(chatId, "По выбранным фильтрам новостей не найдено 😔")
          return;
        }
        
        const newsItem = filteredNews[0]

        saveToHistory(userNewsHistory, chatId, newsItem);
        
        await bot.sendMessage(chatId, `✅ Применен фильтр\n\n${displayNewsItem(newsItem)}`, createnewsKeyboard(0, filteredNews.length))
      }
      else if (callbackData === "change_settings") {
        userStates.set(chatId, states.category);
        await bot.sendMessage(chatId, "Давайте настроим параметры заново. Выберите категорию:", categoryKeyboard)
      }
    }
  }) 

  bot.on('message', (msg) => {
    const chatId = msg.chat.id
    const text = msg.text

    if (text.startsWith('/')) {
      if (text === '/start' || text === '/subscribes' || text === '/news') {
        return
      }
      else {
        bot.sendMessage(chatId, 
          `❌ Неизвестная команда: ${text}\n\n` +
          `📋 Доступные команды:\n` +
          `/start - начать работу с ботом\n` +
          `/subscribes - настройка новостей\n` +
          `/news - просмотр новостей`
        )
      } 
    }
    else {
      bot.sendMessage(chatId,
        `👋 Я бот-агрегатор новостей MyPicabu!\n\n` +
        `Я понимаю только команды. Вот что я умею:\n\n` +
        `📋 Доступные команды:\n` +
        `/start - начать работу\n` +
        `/subscribes - настроить новости\n` +
        `/news - посмотреть новости\n\n` +
        `Выберите нужную команду для продолжения.`
      )
    }
  })

  console.log("Бот запущен..")
}

export default runServer;