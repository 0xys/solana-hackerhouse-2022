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

## Frontend
```
yarn create next-app --typescript app
```
```
yarn add @project-serum/anchor @solana/web3.js
yarn add @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/wallet-adapter-base
```