import mongodb from "mongodb";

const MongoClient = mongodb.MongoClient;

const password = "";

let _db;

export const mongoConnect = () => {
  return MongoClient.connect(
    `mongodb+srv://picateclas:${password}@cluster0.rsjvy.mongodb.net/shop?retryWrites=true&w=majority`
  )
    .then((client) => {
      _db = client.db();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const getDb = () => {
  if (_db) {
    return _db;
  }

  throw new Error("No Database found!");
};

export const getObjectId = (id) => new mongodb.ObjectId(id);
