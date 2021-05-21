import mongodb from "mongodb";

const MongoClient = mongodb.MongoClient;

const password = "@root123";

let _db;

export const mongoConnect = () => {
  console.log("before mongoconnect");
  return MongoClient.connect(
    `mongodb+srv://picateclas:${password}@cluster0.rsjvy.mongodb.net/shop?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log("", client.db());
      _db = client.db();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const getDb = () => {
  console.log("getDB()");
  if (_db) {
    return _db;
  }

  throw new Error("No Database found!");
};
