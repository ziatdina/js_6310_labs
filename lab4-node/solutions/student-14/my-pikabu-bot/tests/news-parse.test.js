import { fetchNews } from '../src/utils/news-parse.js';
import { describe, it, expect } from "@jest/globals"

describe('fetchNews', () => {
  const user = {
    category: 'политика',
    sources: ['rambler', 'vedomosti']
  };

  it('должен загрузить новости из реальных источников', async () => {
    const news = await fetchNews(user);
    console.log(news);
    expect(Array.isArray(news)).toBe(true);
    expect(news.length).toBeGreaterThan(0);
    news.forEach(item => {
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('link');
      expect(item).toHaveProperty('pubDate');
    });
  }, 15000);
});