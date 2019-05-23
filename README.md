# Module to analyse ERC-20 Tokens balance of address

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/shevchenkonik/erc20-analyser/blob/master/LICENSE)


# What is erc20-analyser?

This is a library for calculating the profit or loss of ETH-address.

This is a non-profit & opensource project for developers. If you want to use this project for commercial goals, you need to buy commercial API (for third party services).

## Getting started

### Install erc20-analyser

```
npm i erc20-analyser
```

### Get API keys to third-party services

1. [Cryptocompare](https://www.cryptocompare.com/)
2. [Etherscan](https://etherscan.io/)

## Usage

### Initialization
```
import * as ERC20Analyser from 'erc20-analyser';

const cryptocompareToken = 'your-cryptocompare-api-token';
const etherscanToken = 'your-etherscan-api-token';

const analyser = new ERC20Analyser(cryptocompareToken, etherscanToken);
```

### Get Ethereum balance by ETH address
```
analyser.getCurrentEthBalance('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B').then(data => {
  console.log(data);
});
```

### Get all incoming ERC20-Token transactions
```
analyser.getInTransactions('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B').then(data => {
  console.log(data);
})
```

### Get all outgoing ERC20-Token transactions
```
analyser.getOutTransactions('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B').then(data => {
  console.log(data);
})
```
