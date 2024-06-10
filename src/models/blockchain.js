// src/models/Blockchain.js
const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;  // Start with a difficulty of 3
        this.blockTime = 30000;  // Average block time in milliseconds (e.g., 30 seconds)
        this.miningTimes = [];
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2021", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        
        const startTime = Date.now();
        newBlock.mineBlock(this.difficulty);
        const endTime = Date.now();
        
        const miningTime = endTime - startTime;
        this.miningTimes.push(miningTime);

        if (this.miningTimes.length > 10) {
            this.miningTimes.shift();  // Keep only the last 10 mining times
            const averageMiningTime = this.miningTimes.reduce((a, b) => a + b) / this.miningTimes.length;

            if (averageMiningTime < this.blockTime) {
                this.difficulty++;
            } else if (averageMiningTime > this.blockTime) {
                this.difficulty--;
            }
        }

        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Blockchain;
