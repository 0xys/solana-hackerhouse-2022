import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Program, AnchorProvider, web3, setProvider } from '@project-serum/anchor'
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
require('@solana/wallet-adapter-react-ui/styles.css')

import idl from '../../idl.json'

const { SystemProgram, Keypair } = web3;
/* create an account  */
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

const Home: NextPage = () => {
  const wallet = useWallet();
  const [value, setValue] = useState();

  const getProvider = () => {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network);
    const provider = new AnchorProvider(connection, 
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      wallet, 
      opts.preflightCommitment
    );
    return provider;
  }

  const handleCounterCreate = async () => {
    try {
      const provider = getProvider();
      /* Create the program interface combining the IDL, program ID, and provider */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const program = new Program(EXAMPLE1_IDL, programID, provider);

      /* Interact with the program via RPC */
      await program.rpc.create({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        },
        signers: [baseAccount]
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('[App handleCounterCreate] account => ', account);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      setValue(account.count.toString());
    } catch (error) {
      console.log('[App handleCounterCreate] error => ', error);
    }
  }

  const handleIncrement = async () => {
    try {
      const provider = getProvider();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const program = new Program(EXAMPLE1_IDL, programID, provider);

      await program.rpc.increment({
        accounts: {
          baseAccount: baseAccount.publicKey
        }
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('[App handleIncrement] account => ', account);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      setValue(account.count.toString());
    } catch (error) {
      console.log('[App handleIncrement] error => ', error);
    }
  }

  if (wallet.connected) {
    return (
      <>
        {value ? (
          <button onClick={handleIncrement}>
            Increment counter
          </button>
        ) : (
          <button onClick={handleCounterCreate}>
            Create counter
          </button>
        )}
        {value && value >= Number(0) ? (
          <h2>{value}</h2>
        ) : (
          <h3>Please create the counter.</h3>
        )}
      </>
    );
  } else {
    /* If the user's wallet is not connected, display connect wallet button */
    return (
      <WalletMultiButton />
    );
  }

}

export default Home
