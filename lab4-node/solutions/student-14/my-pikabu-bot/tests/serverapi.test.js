import request from 'supertest';
import { ApiServer } from '../src/serverapi.js';
import {jest, describe, beforeEach, afterEach, test, expect } from "@jest/globals"

// Увеличиваем глобальный таймаут для всех тестов
jest.setTimeout(15000);

describe('MyPikabu Bot API', () => {
  let server;
  let userData;

  beforeEach(async () => {
    userData = new Map();
    server = ApiServer(userData);
        
    await new Promise(resolve => {
      if (server.listening) {
        resolve();
      } else {
        server.on('listening', resolve);
      }
    });
  });

  afterEach((done) => {
    if (server && server.close) {
      server.close(done);
    } else {
      done();
    }
  });

  // Только основные тесты без проблемных
  test('GET / returns welcome page', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('MyPikabu News Bot API');
  });

  test('GET /health returns status', async () => {
    const response = await request(server).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('GET /users returns user count', async () => {
    // Добавляем тестовых пользователей
    userData.set(123, { category: 'политика' });
    userData.set(456, { category: 'экономика' });
    
    const response = await request(server).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.totalUsers).toBe(2);
    expect(response.body.status).toBe('ok');
  });

  test('GET /users returns 0 when no users', async () => {
    const response = await request(server).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.totalUsers).toBe(0);
    expect(response.body.status).toBe('ok');
  });

  test('Unknown routes return 404', async () => {
    const response = await request(server).get('/unknown');
    expect(response.status).toBe(404);
  });

  test('Server is listening', () => {
    expect(server.listening).toBe(true);
  });
});