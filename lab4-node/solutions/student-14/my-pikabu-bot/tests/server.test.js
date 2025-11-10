import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import runServer from '../src/server.js';

describe('Server Direct Coverage', () => {
  let originalToken;

  beforeAll(() => {
    // сохраняем оригинальный токен
    originalToken = process.env.TELEGRAM_BOT_TOKEN;
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  });

  afterAll(() => {
    // восстанавливаем оригинальный токен после завершения
    if (originalToken) {
      process.env.TELEGRAM_BOT_TOKEN = originalToken;
    } else {
      delete process.env.TELEGRAM_BOT_TOKEN;
    }
  });

  test('runServer function exists and can be called', () => {
    // просто проверяем что функция существует и может быть вызвана
    expect(typeof runServer).toBe('function');
    
    expect(() => {
      runServer();
    }).not.toThrow();
  });
});

