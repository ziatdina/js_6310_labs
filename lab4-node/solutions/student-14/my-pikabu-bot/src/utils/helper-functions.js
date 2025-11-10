import { newsSources } from "./news-sources.js"

export const displaySettings = (user) => {
  const category = user.category || "не выбрана"
  const frequency = user.frequency || "не выбрана"
  const sources = user.sources ? user.sources.map(sourceId => {
    const categorySources = newsSources[user.category] || []
    const source = categorySources.find(s => s.id === sourceId)
    return source ? source.name : sourceId
  }).join(', ') : "не выбраны"

  return `Ваши текущие настройки:\nКатегория - ${category}\nЧастота рассылки - ${frequency}\nИсточники - ${sources}`
}

export const displayNewsItem = (newsItem) => {
  const date = newsItem.pubDate.toLocaleDateString('ru-RU')
  return `📌 ${newsItem.title}\n\n` +
           `${date} | ${newsItem.source}\n` +
           `${newsItem.content.substring(0, 200)}${newsItem.content.length > 200 ? '...' : ''}\n\n` +
           `🔗 [Читать полностью](${newsItem.link})\n\n`
}

export const applyFilters = (news, filterType) => {
  let filteredNews = [...news]
    
  switch (filterType) {
  case 'filter_newest': {
    filteredNews.sort((a, b) => b.pubDate - a.pubDate)
    break
  }
  case 'filter_relevant': {
    filteredNews.sort((a, b) => {
      const aScore = (a.title.length + a.content.length) * (a.pubDate - new Date(0))
      const bScore = (b.title.length + b.content.length) * (b.pubDate - new Date(0))
      return bScore - aScore
    })
    break
  }
  case 'filter_24h': {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    filteredNews = filteredNews.filter(item => item.pubDate > yesterday)
    break
  }
  case 'filter_week': {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    filteredNews = filteredNews.filter(item => item.pubDate > weekAgo)
    break
  }
  case 'filter_none':
  default:
    break
  }

  return filteredNews;
}

export const saveToHistory = (userNewsHistory, chatId, newsItem) => {
  if (!userNewsHistory.has(chatId)) {
    userNewsHistory.set(chatId, [])
  }
    
  const history = userNewsHistory.get(chatId);
    
  const exists = history.find(item => 
    item.title === newsItem.title && item.link === newsItem.link
  )
    
  if (!exists) {
    history.unshift({...newsItem, viewedAt: new Date()});
        
    if (history.length > 50) {
      history.splice(50)
    }

    console.log(`Новость "${newsItem.title}" добавлена в историю пользователя ${chatId}`)
  }
}