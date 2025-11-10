import { newsSources } from "./news-sources.js"

export const categoryKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{text: "Политика", callback_data: "politics"}],
      [{text: "Экономика", callback_data: "economics"}],
      [{text: "Технологии", callback_data: "technologies"}],
    ]
  }
}

export const frequencyKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{text: "каждый день", callback_data: "everyDay"}],
      [{text: "по понедельникам", callback_data: "onMondays"}],
      [{text: "по выходным", callback_data: "onWeekends"}],
    ]
  }
}

export const newsCommandKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{text: "Показать новости", callback_data: "show_news"}],
      [{text: "Выбрать фильтры", callback_data: "choose_filters"}],
      [{text: "Изменить настройки", callback_data: "change_settings"}],
    ]
  }
}

export const newsFilters = {
  reply_markup: {
    inline_keyboard: [
      [{text: "Сначала новые", callback_data: "filter_newest"}],
      [{text: "По релевантности", callback_data: "filter_relevant"}],
      [{text: "За последние 24 часа", callback_data: "filter_24h"}],
      [{text: "Без фильтров", callback_data: "filter_none"}],
    ]
  }
}

export const sourceKeyboard = (category, selectedSources = []) => {
  const sources = newsSources[category] || []
  const keyboard = sources.map(source => [
    { text: `${selectedSources.includes(source.id) ? "✅ " : ""}${source.name}`, callback_data: `source_${source.id}`}
  ])
  keyboard.push([{text: "Завершить выбор источников", callback_data: "done"}])

  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  }
}

export const createnewsKeyboard = (currentIndex, totalNews) => {
  const buttoms = []
  const keyboard = buttoms

  if (currentIndex == 0) {
    keyboard.push([{text: "Следующая ➡", callback_data: "next_news"}])
  }
  else if (currentIndex == totalNews - 1) {
    keyboard.push([{text: "Предыдущая ⬅", callback_data: "previous_news"}])
  }
  else {
    keyboard.push([{text: "Предыдущая ⬅", callback_data: "previous_news"},{text: "Следующая ➡", callback_data: "next_news"}])
  }

  keyboard.push([{text: "Выбрать фильтры", callback_data: "choose_filters"}])
  keyboard.push([{text: "Изменить настройки", callback_data: "change_settings"}])

  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  }
}