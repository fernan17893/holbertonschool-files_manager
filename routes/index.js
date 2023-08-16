import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UserController';

export default function controllerRoute(app) {
  const router = express.Router();

  app.use('/', router);

  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  router.get('/users', (req, res) => {
    UsersController.getAllUsers(req, res);
  });
}
