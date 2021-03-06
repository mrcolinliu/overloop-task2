const Router = require('koa-router');

const articleController = require('../controllers/articles');

const api = new Router();
api.prefix('/api');

api.param('articleId', articleController.asParameter);

api.get('/articles/', articleController.all);
api.post('/articles/', articleController.create);
api.get('/articles/:articleId/', articleController.one);
api.put('/articles/:articleId/', articleController.update);

// api.get('/articles/search/:searchWord', articleController.search);
api.post('/articles/search/', articleController.all);

module.exports = api;
