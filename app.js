const express = require('express');
const sha256 = require("sha256");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('public/index.html');
});


app.get('/api/genblock', (req, res) => {
  class Block {
    constructor(index, timestamp, data, prevHash) {
      this.index = index;
      this.timestamp = timestamp;
      this.data = data;
      this.prevHash = prevHash;
      this.thisHash = sha256(
        this.index + this.timestamp + this.data + this.prevHash
      );
    }
  }
  const createGenesisBlock = () => new Block(0, Date.now(), "Genesis Block", "0");
  const nextBlock = (lastBlock, data) =>
    new Block(lastBlock.index + 1, Date.now(), data, lastBlock.thisHash);
  const createBlockchain = num => {
    const blockchain = [createGenesisBlock()];
    let previousBlock = blockchain[0];
    for (let i = 1; i < num; i += 1) {
      const blockToAdd = nextBlock(previousBlock, `This is block # ${i}`);
      blockchain.push(blockToAdd);
      previousBlock = blockToAdd;
    }
    res.json(blockchain);
  };
  const lengthToCreate = 20;
  createBlockchain(lengthToCreate);
});


app.listen(3000, () => console.log('server started'));
