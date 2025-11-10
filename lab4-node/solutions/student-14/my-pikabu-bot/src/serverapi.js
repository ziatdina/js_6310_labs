import express from 'express';

export const ApiServer = (userData) => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // проверка, что сервер жив и работает
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'MyPikabu news Bot',
      timestamp: new Date().toISOString()
    });
  });

  // корневая страница 
  app.get('/', (req, res) => {
    res.send(`
            <h2>MyPikabu News Bot API 🚀</h2>
            <p>Добро пожаловать! Это сервер для Telegram-бота MyPikabu News.</p>
            <p>Проверить состояние можно по адресу: <a href="/health">/health</a></p>
            <p>Проверить колиичество активных пользователей можно по адресу: <a href="/users">/users</a></p>
        `);
  });

  app.get('/users', (req, res) => {
    res.json({
      totalUsers: userData.size,
      status: 'ok'
    });
  });
  
  // запуск сервера
  const server = app.listen(PORT, () => {
    console.log(`✅ MyPikabu Bot API server запущен на http://localhost:${PORT}`);
  });

  return app;
};