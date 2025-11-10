import { describe, test, expect } from '@jest/globals';
import { newsSources } from '../src/utils/news-sources.js';

describe('Источники новостей', () => {
  test('содержит все категории', () => {
    expect(newsSources).toHaveProperty('политика');
    expect(newsSources).toHaveProperty('экономика');
    expect(newsSources).toHaveProperty('технологии');
  });

  test('каждый источник имеет обязательные поля', () => {
    Object.values(newsSources).forEach(category => {
      category.forEach(source => {
        expect(source).toHaveProperty('name');
        expect(source).toHaveProperty('id');
        expect(source).toHaveProperty('rss');
        expect(typeof source.name).toBe('string');
        expect(typeof source.id).toBe('string');
        expect(typeof source.rss).toBe('string');
      });
    });
  });
});