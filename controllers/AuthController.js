import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import userUtils from '../utils/user';

export default class AuthController {
  static async getConnect(req, res) {
    const Authorization = req.header('Authorization');

    const base64Credentials = Authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

    if (!credentials) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const [email, password] = credentials.split(':');

    if (!email || !password) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const hashedPassword = sha1(password);

    const user = await dbClient.usersCollection.findOne({ email, password: hashedPassword });

    if (!user) { return res.status(401).send({ error: 'Unauthorized' }); }

    const token = uuidv4();
    const key = `auth_${token}`;
    const expiration = 24;

    await redisClient.set(key, user._id.toString(), expiration * 3600);

    return res.status(200).send({ token });
  }

  static async getDisconnect(req, res) {
    const { userId, key } = await userUtils.getUserIdAndKey(req);

    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    await redisClient.del(key);

    return res.status(204).send();
  }
}
