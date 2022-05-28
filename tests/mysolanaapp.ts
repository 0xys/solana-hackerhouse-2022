import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Mysolanaapp } from "../target/types/mysolanaapp";

const { SystemProgram } = anchor.web3;
const assert = require("assert");

describe("mysolanaapp", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Mysolanaapp as Program<Mysolanaapp>;
  let _stadium: anchor.web3.Keypair;

  it("Initialize Game)", async () => {
    /* Call the create function via RPC */
    const stadium = anchor.web3.Keypair.generate();
    await program.rpc.initGame({
      accounts: {
        stadium: stadium.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [stadium],
    });

    /* Fetch the account and check the value of count */
    const account = await program.account.stadium.fetch(stadium.publicKey)
    assert.ok(account.bases.toString() == '0');
    assert.ok(account.outs.toString() == '0');
    assert.ok(account.score.toString() == '0');
    assert.ok(account.epoch.toString() == '0');
    assert.ok(account.authority.toBase58() == provider.wallet.publicKey.toBase58());
    _stadium = stadium;

  });

  it("Reset Game)", async () => {
    await program.rpc.reset({
      accounts: {
        stadium: _stadium.publicKey,
        authority: provider.wallet.publicKey,
      }
    });

    /* Fetch the account and check the value of count */
    const account = await program.account.stadium.fetch(_stadium.publicKey);
    assert.ok(account.bases.toString() == '0');
    assert.ok(account.outs.toString() == '0');
    assert.ok(account.score.toString() == '0');
    assert.ok(account.epoch.toString() == '1');
    assert.ok(account.authority.toBase58() == provider.wallet.publicKey.toBase58());
  });

  // it("Play the game", async () => {
  //   const baseAccount = _stadium;

  //   await program.rpc.increment({
  //     accounts: {
  //       baseAccount: baseAccount.publicKey,
  //     },
  //   });

  //   const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  //   console.log('Count 1: ', account.count.toString())
  //   assert.ok(account.count.toString() == '1');
  // });
});
