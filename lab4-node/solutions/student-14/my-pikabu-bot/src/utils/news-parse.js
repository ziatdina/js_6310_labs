import Parser from 'rss-parser';
import { newsSources } from './news-sources.js';

const parser = new Parser();


export const fetchNews = async (user) => {
  const news = []
  const categorySources = newsSources[user.category] || []
  const selectedSources = categorySources.filter(source => 
    user.sources && user.sources.includes(source.id)
  )

  for (const source of selectedSources) {
    try {
      console.log(`⏳ Загружаем новости из: ${source.rss}`)
      const feed = await parser.parseURL(source.rss)
        
      const recentItems = feed.items.slice(0, 5)
        
      recentItems.forEach(item => {
        news.push({
          title: item.title || 'Без названия',
          link: item.link || '#',
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          content: item.contentSnippet || item.content || item.summary || '',
          source: source.name,
          category: user.category
        })
      })
            
      console.log(`Загружено ${recentItems.length} новостей из ${source.name}`);
    } 
    catch (error) {
      console.error(`Ошибка при парсинге RSS ${source.rss}:`, error)

      news.push({
        title: `Новость из ${source.name}`,
        link: "#",
        pubDate: new Date(),
        content: `Временно недоступны новости из ${source.name}. Попробуйте позже.`,
        source: source.name,
        category: user.category
      })
    }
  }

  return news;
}