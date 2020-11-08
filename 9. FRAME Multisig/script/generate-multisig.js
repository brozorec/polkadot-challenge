const { createKeyMulti, encodeAddress } = require('@polkadot/util-crypto');
const { ApiPromise, Keyring, WsProvider } = require('@polkadot/api');

const SS58Prefix = 0;
// The number of accounts that must approve. Must be greater than 0 and less than
// or equal to the total number of addresses.
const threshold = 2;

async function main () {
  const provider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider });
  const keyring = new Keyring({ type: 'sr25519' });

  const alice = keyring.addFromUri('//Alice');
  const bob = keyring.addFromUri('//Bob');
  const charlie = keyring.addFromUri('//Charlie');

  // Input the addresses that will make up the multisig account.
  const addresses = [
    alice.address,
    bob.address,
    charlie.address
  ];

  // Address as a byte array.
  const multiAddress = createKeyMulti(addresses, threshold);

  // Convert byte array to SS58 encoding.
  const Ss58Address = encodeAddress(multiAddress, SS58Prefix);

  console.log(`\nMultisig Address: ${Ss58Address}`);

  process.exit();
}

main();
