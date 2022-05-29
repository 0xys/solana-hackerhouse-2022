# Solana App with Anchor
https://dev.to/edge-and-node/the-complete-guide-to-full-stack-solana-development-with-react-anchor-rust-and-phantom-3291

## Build
```
anchor build
```
Find out dynamically generated program id by running `solana address -k target/deploy/mysolanaapp-keypair.json`.
Set the address to:
```
// mysolanaapp/src/lib.rs

declare_id!("your-program-id");
```

```
# Anchor.toml
[programs.localnet]
mysolanaapp = "your-program-id"
```
```
# app/idl.json
...
"metadata": {
    "address": "your-program-id"
}
```
## Test
```
anchor test
```

## Deploy
Make sure your local network is initiated with the following command.
```
solana-test-validator
```
Then deploy,
```
anchor deploy
```
Run `solana logs` to track the transaction trace.

### Devnet
```
solana airdrop 2 --url devnet
anchor deploy --provider.cluster devnet
```

## Mint test token
```
solana airdrop 100 <YOUR_ADDRESS>
```

## Init Game
```
cd cli
export ANCHOR_WALLET=$HOME/.config/solana/id.json
yarn run start 
```
```
hash 4ssXDSGNiZqd3fGCR45j84Vada8kn5xwsQCiWqxh9scEdSANzNjJbyFrTBHskfXjthKmkCNtTo1u32UwCN2yRjRA
stadium address Hsx46xyY83A6gcFcrRrL2QhBgXyor3YLu2dRj39gh8qr
stadium address fac847cc714d52c8bd553c66506157e141b8ebba885e506f414ce995c115613d
```

## Frontend
```
yarn create next-app --typescript app
```
```
yarn add @project-serum/anchor @solana/web3.js
yarn add @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/wallet-adapter-base
```