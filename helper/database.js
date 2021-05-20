import mongodb from "mongodb";

const MongoClient = mongodb.MongoClient;

const password = "YOUR_PASSWORD"

export const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://picateclas:${password}@cluster0.rsjvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
    .then((client) => {
      callback(client);
    })
    .catch((err) => console.log(err));
};
