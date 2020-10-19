const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main (blockNumber) {
  const provider = new WsProvider('wss://rpc.polkadot.io');

  const api = await ApiPromise.create({ provider });

  try {
    const blockHash = blockNumber ? (await api.rpc.chain.getBlockHash(blockNumber)) : undefined;
    const { block } = blockHash ?
      await api.rpc.chain.getBlock(blockHash) :
      await api.rpc.chain.getBlock();

    console.log(`${blockHash ? '' : 'Latest '}Block Number: ${block.header.number.toHuman()}`);
    console.log(`${blockHash ? '' : 'Latest '}Block Hash: ${block.header.hash.toHuman()}`);
    console.log(`${blockHash ? '' : 'Latest '}Block Parent Hash: ${block.header.parentHash.toHuman()}`);


    const { author }  = await api.derive.chain.getHeader(block.header.hash);

    console.log(`${blockHash ? '' : 'Latest '}Block Author: ${author.hash.toHuman()}`);
    console.log("=======\n");
  }
  catch(e) {
    console.error("Invalid Block Number!")
  }
}

const args = process.argv.slice(2);

if (args.length == 0) {
  main().finally(() => process.exit());
}
else if (args.length != 2 || args[0] != '--blockNumber') {
  console.error("ERROR!!! \nUsage: \nnode index --blockNumber [BLOCK_NUMBER]")
}
else {
  main(args[1]).finally(() => process.exit());
}
