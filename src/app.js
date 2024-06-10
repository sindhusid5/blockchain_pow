// src/app.js
const express = require('express');
const Blockchain = require('./models/blockchain');
const Block = require('./models/block');

const app = express();
const myCoin = new Blockchain();

app.get('/mine', (req, res) => {
    const newBlock = new Block(myCoin.chain.length, Date.now().toString(), { amount: Math.floor(Math.random() * 100) });
    myCoin.addBlock(newBlock);
    res.send(`Block mined: ${newBlock.hash}`);
});

app.get('/chain', (req, res) => {
    res.json(myCoin.chain);
});

app.get('/validate', (req, res) => {
    const isValid = myCoin.isChainValid();
    res.send(`Blockchain is ${isValid ? 'valid' : 'invalid'}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
