import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Mysolanaapp } from "../target/types/mysolanaapp";
const { SystemProgram } = anchor.web3;

// process.env['ANCHOR_PROVIDER_URL'] = 'http://127.0.0.1:8899'
const provider = anchor.AnchorProvider.env();

(async () => {
    const stadium = anchor.web3.Keypair.generate();
    const program = anchor.workspace.Mysolanaapp as Program<Mysolanaapp>
    const res = await program.rpc.initGame({
        accounts: {
          stadium: stadium.publicKey,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [stadium],
    });

    console.log('hash', res)
    console.log('stadium address', stadium.publicKey.toBase58())
    console.log('stadium address', stadium.publicKey.encode().toString('hex'))
})()