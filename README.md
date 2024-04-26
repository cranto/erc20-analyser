# ERC-20 Analyser

> Module to analyse ERC20-Token balance of address

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/shevchenkonik/erc20-analyser/blob/master/LICENSE) ![GitHub issues](https://img.shields.io/github/issues-raw/shevchenkonik/erc20-analyser.svg) ![npm](https://img.shields.io/npm/dy/erc20-analyser.svg) ![GitHub pull requests](https://img.shields.io/github/issues-pr/shevchenkonik/erc20-analyser.svg)

# What is ERC20-Analyser?

This is a library for calculating the profit or loss of ETH-addresses.

> This is a non-profit & opensource project for developers. If you want to use this project for commercial goals, you need to buy commercial API (for third party services).

## Getting started

### Install erc20-analyser

```javascript
npm i erc20-analyser
```

### Get API keys to third-party services

1. [Cryptocompare](https://www.cryptocompare.com/)
2. [Etherscan](https://etherscan.io/)

## Usage

### Initialization
```typescript
import { ERC20Analyser } from 'erc20-analyser';

const cryptocompareToken = 'your-cryptocompare-api-token';
const etherscanToken = 'your-etherscan-api-token';

const analyser = new ERC20Analyser(cryptocompareToken, etherscanToken);
```

### Get current portfolio of ERC20-Token transactions with current hold
```typescript
analyser.getERC20TokenBalanceWithHold('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B').then(data => {
  console.log(data);
});
```

### Get Ethereum balance by ETH address
```typescript
analyser.getCurrentEthBalance('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B').then(data => {
  console.log(data);
});
```

### Get all incoming ERC20-Token transactions
```typescript
analyser.getInTransactions('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B').then(data => {
  console.log(data);
});
```

### Get all outgoing ERC20-Token transactions
```typescript
analyser.getOutTransactions('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B').then(data => {
  console.log(data);
});
```

### Get ERC20-Token price by date (displayed on the ETH)
```typescript
analyser.getPriceToken({tokenSymbol: 'WAVES', timestamp: 1546300800, toConvert: 'ETH'}).then(data => {
  console.log(data);
});
```

### Get ERC20-Token price by current date
```typescript
analyser.getCurrentPriceToken('BNB', 'ETH').then(data => {
  console.log(data);
});
```


### Get current token balance by contract address
```typescript
analyser.getResultErc20Transactions('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', '0xe25b0bba01dc5630312b6a21927e578061a13f55').then(data => {
  console.log(data);
});
```
