import mongoose from "mongoose";

const uri = "mongodb://jevxo-doc-engine:PEDVns8XMtCZI7BI@ac-3ocihiu-shard-00-00.gh1jtid.mongodb.net:27017,ac-3ocihiu-shard-00-01.gh1jtid.mongodb.net:27017,ac-3ocihiu-shard-00-02.gh1jtid.mongodb.net:27017/jevxo-hr?ssl=true&replicaSet=atlas-3ocihiu-shard-0&authSource=admin&retryWrites=true&w=majority";

console.log("Testing direct URI...");

async function test() {
  try {
    // Attempt connecting. If replicaSet is wrong, it might complain. But often 'atlas-xxxxx-shard-0' is the default name, or we can just try without replicaSet.
    await mongoose.connect(uri);
    console.log("Connected to MongoDB directly!");
    process.exit(0);
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
}

test();
