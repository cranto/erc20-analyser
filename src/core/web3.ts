/**
 * Get the balance of an address at a given block.
 * @param address {string}
 * @param web3 {object}
 * @returns {Promise}
 */
async function getETHBalance(address: string, web3: any): Promise<any> {
  const resp = await web3.eth.getBalance(address);
  return resp;
}

/**
 * Converts any wei value into a ether value.
 * “wei” are the smallest ethere unit, and you should always make calculations in wei and convert only for display reasons.
 */
async function getFromWei(value: string, web3: any): Promise<any> {
  const resp = await web3.utils.fromWei(value);
  return resp;
}

/**
 * Function to get current balance of ETH by address
 * @param address {string}
 * @param web3 {any}
 * @returns {Promise}
 */
export async function GetCurrentETHBalance(address: string, web3: any): Promise<any> {
  const eth = await getETHBalance(address, web3);
  const fromwei = await getFromWei(eth, web3);
  return fromwei;
}
