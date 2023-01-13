const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://localhost:8080/',
      // target: 'http://[2801:b6:400:606::216]:8080/',
      secure: false,
      changeOrigin: true,
    }),
  );
};
