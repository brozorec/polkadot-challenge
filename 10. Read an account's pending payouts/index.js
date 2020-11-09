const axios = require("axios");

const NODE_URL = 'http://127.0.0.1:8080';

async function main(account, depth) {
  const { data } = await axios.get(`${NODE_URL}/accounts/${account}/staking-payouts?depth=${depth}&unclaimedOnly=true`);

  const total = data.erasPayouts.reduce((accAll, { payouts }) => {
    if (!payouts) {
      return 0;
    }

    return payouts.reduce((acc, payout) => (
      payout.claimed ? acc : acc + Number(payout.nominatorStakingPayout)
    ), 0);
  }, 0);

  console.log(`Pending payouts (KSM): ${total / Math.pow(10, 12)}`);
}

const args = process.argv.slice(2);

if ((args.length != 4 && args[0] != '--account' && args[2] != '--depth')) {
  console.error("ERROR!!! \nUsage: \nnode index --account ACCOUNT --depth [DEPTH]")
}
else {
  main(args[1], args[3]).catch(console.error);
}
