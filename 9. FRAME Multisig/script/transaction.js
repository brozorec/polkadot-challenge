const { ApiPromise, Keyring, WsProvider } = require('@polkadot/api');

const MAX_WEIGHT = 100000000000;

async function main(txType, multisigAddr) {
  const provider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider });
  const keyring = new Keyring({ type: 'sr25519' });

  const alice = keyring.addFromUri('//Alice');
  const bob = keyring.addFromUri('//Bob');
  const charlie = keyring.addFromUri('//Charlie');
  const dave = keyring.addFromUri('//Dave');

  const tx = api.tx.balances.transfer(dave.address, 1000000000000000);

  let signer;
  let multiTx;

  if (txType == 'init') {
    console.log('init');
    signer = alice;
    multiTx = api.tx.multisig.approveAsMulti(
      2,
      [bob.address, charlie.address],
      null,
      tx.method.hash.toHex(),
      MAX_WEIGHT
    )
  }
  else {
    console.log('final');

    const timepoint = await api.query.multisig.multisigs(multisigAddr, tx.method.hash);

    signer = bob;
    multiTx = api.tx.multisig.asMulti(
      2,
      [charlie.address, alice.address],
      timepoint.unwrap().when,
      tx.method.toHex(),
      false,
      MAX_WEIGHT
    )
  }

  const res = await multiTx
    .signAndSend(signer, ({ status, events }) => {
      if (status.isInBlock) {
        console.log('Included at block hash', status.asInBlock.toHex());
        console.log('Events:');

        events.forEach(({ event: { data, method, section }, phase }) => {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
        });
      }
      else if (status.isFinalized) {
        console.log('Finalized block hash', status.asFinalized.toHex());

        process.exit(0);
      }
    })
    .catch(console.error);

  return res;
}

const args = process.argv.slice(2);

if (args.length == 0) {
  main().finally(() => process.exit());
}
else if ((args.length == 2 && args[0] != '--txType') || (args.length == 4 && args[2] != '--multisigAddr')) {
  console.error("ERROR!!! \nUsage: \nnode index --txType ['initial|final'] [--multisigAddr [ADDRESS]]")
}
else {
  main(args[1], args[3]);
}
