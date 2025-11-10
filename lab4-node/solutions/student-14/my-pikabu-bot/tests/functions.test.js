import { describe, test, expect } from '@jest/globals';
import { displaySettings, displayNewsItem, applyFilters, saveToHistory } from '../src/utils/helper-functions.js';

describe('Helper functions', () => {
  
  describe('displaySettings - отображает настройки пользователя', () => {
    
    test('отображает завершенные настройки для политики', () => {
      const user = {
        category: 'политика',
        frequency: 'ежедневная',
        sources: ['rambler', 'vedomosti'] 
      };

      const result = displaySettings(user);
      
      expect(result).toContain('Категория - политика');
      expect(result).toContain('Частота рассылки - ежедневная');
      expect(result).toContain('Источники - Рамблер, Ведомости');
    });

    test('отображает настройки для экономики с одним источником', () => {
      const user = {
        category: 'экономика',
        frequency: 'по понедельникам',
        sources: ['vedomosti'] 
      };

      const result = displaySettings(user);
      
      expect(result).toContain('Категория - экономика');
      expect(result).toContain('Частота рассылки - по понедельникам');
      expect(result).toContain('Источники - Ведомости');
      expect(result).not.toContain('Investing.com');
    });

    test('отображает настройки для технологий', () => {
      const user = {
        category: 'технологии',
        frequency: 'по выходным',
        sources: ['ixbt', 'habr'] 
      };

      const result = displaySettings(user);
      
      expect(result).toContain('Категория - технологии');
      expect(result).toContain('Частота рассылки - по выходным');
      expect(result).toContain('Источники - IXBT, HABR');
    });

    test('показывает ID источника когда он не найден', () => {
      const user = {
        category: 'политика',
        frequency: 'ежедневная',
        sources: ['ixbt'] 
      };

      const result = displaySettings(user);
      
      expect(result).toContain('ixbt');
    });

    // НОВЫЕ ТЕСТЫ
    test('обрабатывает пользователя без категории', () => {
      const user = {
        frequency: 'ежедневная',
        sources: ['rambler']
      };

      const result = displaySettings(user);
      expect(result).toContain('Категория - не выбрана');
    });

    test('обрабатывает пользователя без frequency', () => {
      const user = {
        category: 'политика',
        sources: ['rambler']
      };

      const result = displaySettings(user);
      expect(result).toContain('Частота рассылки - не выбрана');
    });

    test('обрабатывает пользователя без sources', () => {
      const user = {
        category: 'политика',
        frequency: 'ежедневная'
      };

      const result = displaySettings(user);
      expect(result).toContain('Источники - не выбраны');
    });

    test('обрабатывает пустого пользователя', () => {
      const user = {};
      const result = displaySettings(user);
      expect(result).toContain('не выбрана');
      expect(result).toContain('не выбраны');
    });
  });

  describe('displayNewsItem - форматирует новости', () => {
    
    test('форматирует новость с полными данными', () => {
      const newsItem = {
        title: 'Тестовая новость о котиках',
        pubDate: new Date('2025-11-08T10:30:00'),
        source: 'Тестовый Рамблер',
        content: 'Котики захватили город Казань!',
        link: 'https://test-news.com/article/123'
      };

      const result = displayNewsItem(newsItem);
      
      expect(result).toContain('📌 Тестовая новость о котиках');
      expect(result).toContain('08.11.2025');
      expect(result).toContain('Тестовый Рамблер');
      expect(result).toContain('Котики захватили город Казань!');
      expect(result).toContain('🔗 [Читать полностью](https://test-news.com/article/123)');
    });

    test('обрезает длинный контент и добавляет многоточие', () => {
      const longContent = 'Очень длинный текст новости'.repeat(20);
      const newsItem = {
        title: 'Новость с длинным содержанием',
        pubDate: new Date(),
        source: 'Тестовый источник',
        content: longContent,
        link: 'https://test.com/long-article'
      };

      const result = displayNewsItem(newsItem);
      expect(result).toContain('...');
    });

    // НОВЫЕ ТЕСТЫ
    test('не обрезает короткий контент', () => {
      const newsItem = {
        title: 'Короткая новость',
        pubDate: new Date(),
        source: 'Тест',
        content: 'Коротко',
        link: 'https://test.com'
      };

      const result = displayNewsItem(newsItem);
      expect(result).not.toContain('...');
      expect(result).toContain('Коротко');
    });

    test('обрабатывает новость с минимальными данными', () => {
      const newsItem = {
        title: 'Минимальная',
        pubDate: new Date(),
        source: 'Источник',
        content: '',
        link: '#'
      };

      const result = displayNewsItem(newsItem);
      expect(result).toContain('📌 Минимальная');
      expect(result).toContain('Источник');
    });
  });

  describe('applyFilters - фильтрует новости', () => {
    const testNews = [
      {
        title: 'Новая новость',
        content: 'Содержимое',
        pubDate: new Date('2025-11-08T14:30:00Z')
      },
      {
        title: 'Средняя новость',
        content: 'Содержимое',
        pubDate: new Date('2025-11-07T11:15:00Z')
      },
      {
        title: 'Старая новость',
        content: 'Содержимое',
        pubDate: new Date('2025-11-06T08:00:00Z')
      }
    ];

    test('фильтр newest сортирует новости от новых к старым', () => {
      const result = applyFilters(testNews, 'filter_newest');
      expect(result[0].title).toBe('Новая новость');
      expect(result[2].title).toBe('Старая новость');
    });

    test('фильтр relevant применяет алгоритм релевантности', () => {
      const result = applyFilters(testNews, 'filter_relevant');
      expect(result).toHaveLength(3);
    });

    test('фильтр 24h оставляет только новости за последние 24 часа', () => {
      const mixedNews = [
        {
          title: 'Свежая новость',
          content: 'Только что',
          pubDate: new Date() 
        },
        {
          title: 'Вчерашняя новость',
          content: 'Вчера',
          pubDate: new Date(Date.now() - 25 * 60 * 60 * 1000)
        }
      ];

      const result = applyFilters(mixedNews, 'filter_24h');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Свежая новость');
    });

    test('фильтр week оставляет новости за последнюю неделю', () => {
      const mixedNews = [
        {
          title: 'Недавняя новость',
          content: 'Недавно',
          pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Очень старая новость',
          content: 'Давно',
          pubDate: new Date('2025-10-01T00:00:00') 
        }
      ];

      const result = applyFilters(mixedNews, 'filter_week');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Недавняя новость');
    });

    test('фильтр none возвращает новости без изменений', () => {
      const result = applyFilters(testNews, 'filter_none');
      expect(result).toEqual(testNews);
    });

    // НОВЫЕ ТЕСТЫ
    test('обрабатывает пустой массив новостей', () => {
      const result = applyFilters([], 'filter_newest');
      expect(result).toEqual([]);
    });

    test('использует default case для неизвестного фильтра', () => {
      const result = applyFilters(testNews, 'unknown_filter');
      expect(result).toEqual(testNews);
    });

    test('фильтр 24h возвращает пустой массив когда нет свежих новостей', () => {
      const oldNews = [{
        title: 'Старая',
        content: 'Старое',
        pubDate: new Date('2020-01-01')
      }];

      const result = applyFilters(oldNews, 'filter_24h');
      expect(result).toHaveLength(0);
    });

    test('фильтр week возвращает пустой массив когда нет новостей за неделю', () => {
      const oldNews = [{
        title: 'Старая',
        content: 'Старое',
        pubDate: new Date('2020-01-01')
      }];

      const result = applyFilters(oldNews, 'filter_week');
      expect(result).toHaveLength(0);
    });
  });

  describe('saveToHistory - сохраняет историю просмотров', () => {
    
    test('добавляет новую новость в историю пользователя', () => {
      const userNewsHistory = new Map();
      const chatId = 12345;
      const newsItem = {
        title: 'Тестовая новость для истории',
        link: 'https://test-history.com/news/1',
        source: 'Тестовый источник'
      };

      saveToHistory(userNewsHistory, chatId, newsItem);
      
      expect(userNewsHistory.has(chatId)).toBe(true);
      const history = userNewsHistory.get(chatId);
      expect(history).toHaveLength(1);
      expect(history[0].title).toBe('Тестовая новость для истории');
      expect(history[0].viewedAt).toBeInstanceOf(Date);
    });

    test('не добавляет дубликаты одинаковых новостей', () => {
      const userNewsHistory = new Map();
      const chatId = 12345;
      const newsItem = {
        title: 'Одинаковая новость',
        link: 'https://test.com/same-news',
        source: 'Тестовый источник'
      };

      saveToHistory(userNewsHistory, chatId, newsItem);
      saveToHistory(userNewsHistory, chatId, newsItem);
      
      expect(userNewsHistory.get(chatId)).toHaveLength(1);
    });

    test('ограничивает историю 50 последними новостями', () => {
      const userNewsHistory = new Map();
      const chatId = 67890;

      for (let i = 0; i < 60; i++) {
        saveToHistory(userNewsHistory, chatId, {
          title: `Новость ${i + 1}`,
          link: `https://test.com/news/${i + 1}`,
          source: 'Тестовый источник'
        });
      }
      
      const history = userNewsHistory.get(chatId);
      expect(history).toHaveLength(50);
      expect(history[0].title).toBe('Новость 60');
      expect(history[49].title).toBe('Новость 11');
    });

    test('создает отдельную историю для каждого пользователя', () => {
      const userNewsHistory = new Map();
      const firstUser = 11111;
      const secondUser = 22222;

      saveToHistory(userNewsHistory, firstUser, {
        title: 'Новость для первого',
        link: 'https://test.com/first',
        source: 'Тест'
      });

      saveToHistory(userNewsHistory, secondUser, {
        title: 'Новость для второго', 
        link: 'https://test.com/second',
        source: 'Тест'
      });

      expect(userNewsHistory.has(firstUser)).toBe(true);
      expect(userNewsHistory.has(secondUser)).toBe(true);
      expect(userNewsHistory.get(firstUser)[0].title).toBe('Новость для первого');
      expect(userNewsHistory.get(secondUser)[0].title).toBe('Новость для второго');
    });
  });
});