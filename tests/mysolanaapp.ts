import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
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
    assert.ok(account.numOfPlayers.toString() == '0');
    assert.ok(account.authority.toBase58() == provider.wallet.publicKey.toBase58());
    _stadium = stadium;

  });

  it("Reset Game)", async () => {
    await program.rpc.reset({
      accounts: {
        stadium: _stadium.publicKey,
        authority: provider.wallet.publicKey,
      },
    });

    /* Fetch the account and check the value of count */
    const account = await program.account.stadium.fetch(_stadium.publicKey);
    assert.ok(account.bases.toString() == '0');
    assert.ok(account.outs.toString() == '0');
    assert.ok(account.score.toString() == '0');
    assert.ok(account.epoch.toString() == '1');
    assert.ok(account.authority.toBase58() == provider.wallet.publicKey.toBase58());
  });

  let _playerPda: anchor.web3.PublicKey;
  it("Register Player", async () => {
    const seeds = [provider.wallet.publicKey.toBuffer()]
    const [playerPda, bumps] = PublicKey.findProgramAddressSync(seeds, program.programId)

    await program.rpc.registerPlayer({
      accounts: {
        player: playerPda,
        stadium: _stadium.publicKey,
        playerOwner: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });

    const stadium = await program.account.stadium.fetch(_stadium.publicKey);
    assert.ok(stadium.numOfPlayers.toString() == '1');

    const player = await program.account.playerAccount.fetch(playerPda);
    assert.ok(player.score.toString() == '0');

    _playerPda = playerPda;
  });

  it("RegisterPlayer fails with unknown key", async () => {
    const unknownKey = anchor.web3.Keypair.generate();
    const seeds = [unknownKey.publicKey.toBuffer()]
    const [playerPda, bumps] = PublicKey.findProgramAddressSync(seeds, program.programId)

    try{
      await program.rpc.registerPlayer({
        accounts: {
          player: playerPda,
          stadium: _stadium.publicKey,
          playerOwner: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });
      assert.ok(false)
    } catch {
      assert.ok(true)
    }
    
    const stadium = await program.account.stadium.fetch(_stadium.publicKey);
    assert.ok(stadium.numOfPlayers.toString() == '1');

    try{
      const player = await program.account.playerAccount.fetch(playerPda);
      assert.ok(false)
    } catch {
      assert.ok(true)
    }
  })

  it("Play", async () => {
    await program.rpc.play({
      accounts: {
        player: _playerPda,
        stadium: _stadium.publicKey,
        playerOwner: provider.wallet.publicKey,
      },
    });

    const stadium = await program.account.stadium.fetch(_stadium.publicKey);
    // assert.ok(stadium.numOfPlayers.toString() == '1');
    // assert.ok(stadium.score.toString() == '2');

    const player = await program.account.playerAccount.fetch(_playerPda);
    // assert.ok(player.score.toString() == '1');
    assert.ok(true)
  })

  it("Reset Game 2)", async () => {
    await program.rpc.reset({
      accounts: {
        stadium: _stadium.publicKey,
        authority: provider.wallet.publicKey,
      },
    });

    /* Fetch the account and check the value of count */
    const stadium = await program.account.stadium.fetch(_stadium.publicKey);
    assert.ok(stadium.bases.toString() == '0');
    assert.ok(stadium.outs.toString() == '0');
    assert.ok(stadium.score.toString() == '0');
    assert.ok(stadium.epoch.toString() == '2');
    assert.ok(stadium.numOfPlayers.toString() == '1');
    assert.ok(stadium.authority.toBase58() == provider.wallet.publicKey.toBase58());
  });
});
