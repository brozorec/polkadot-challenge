# Hello World! by Polkadot - Read an account's pending payouts

## Local Kusama node

![Run Sidecar](https://github.com/brozorec/polkadot-challenge/blob/master/10.%20Read%20an%20account's%20pending%20payouts/kusama-local.png)

## Sidecar

- added in `./config/types.json`:
```
{
  "CUSTOM_TYPES": {
    "Address": "AccountId",
    "LookupSource": "AccountId"
  }
}
```

- run
![Run Sidecar](https://github.com/brozorec/polkadot-challenge/blob/master/10.%20Read%20an%20account's%20pending%20payouts/sidecar.png)

## Script

```
yarn install
node index --account ACCOUNT --depth [DEPTH]
```
