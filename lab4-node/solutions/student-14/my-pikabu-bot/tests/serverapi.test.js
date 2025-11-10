import request from 'supertest';
import { ApiServer } from '../src/serverapi.js';
import { describe, beforeEach, afterEach, test, expect } from "@jest/globals"

describe('MyPikabu Bot API', () => {
  let server;
  let userData;

  beforeEach(() => {
    userData = new Map();
    server = ApiServer(userData);
  });

  afterEach((done) => {
    if (server && server.close) {
      server.close(done);
    } else {
      done();
    }
  });

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
    userData.set(123, { category: 'политика' });
    userData.set(456, { category: 'экономика' });
    
    const response = await request(server).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.totalUsers).toBe(2);
  });

  test('GET /users returns 0 when no users', async () => {
    const response = await request(server).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.totalUsers).toBe(0);
  });

  test('Unknown routes return 404', async () => {
    const response = await request(server).get('/unknown');
    expect(response.status).toBe(404);
  });
});