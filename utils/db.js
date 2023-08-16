import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT || 27017;
    const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${DB_HOST}:${DB_PORT}`;
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        this.status = 'ERROR';
        this.db = false;
      }
    });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    const nbUsers = await this.db.collection('users').countDocuments();
    return nbUsers;
  }

  async nbFiles() {
    const nbFiles = await this.db.collection('files').countDocuments();
    return nbFiles;
  }
}

const dbClient = new DBClient();
export default dbClient;
