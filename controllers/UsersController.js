import sha1 from 'sha1';
import dbClient from '../utils/db';

const userQ = require('../utils/redis');

export default class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    }

    const emailExists = await dbClient.usersCollection.findOne({ email });

    if (emailExists) {
      return res.status(400).send({ error: 'Already exist' });
    }

    const secPass = sha1(password);

    const insertStat = await dbClient.usersCollection.insertOne({
      email,
      password: secPass,
    });

    const createdUser = {
      id: insertStat.insertedId,
      email,
    };

    await userQ.add({
      userId: insertStat.insertedId.toString(),
    });

    return res.status(201).send(createdUser);
  }
}
