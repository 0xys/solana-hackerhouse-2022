import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { Button, ButtonGroup, CircularProgress, Divider, Heading, HStack, Input, Link, VStack, } from '@chakra-ui/react'
import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react'

import { useEffect, useMemo, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider, web3, setProvider } from '@project-serum/anchor'
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
require('@solana/wallet-adapter-react-ui/styles.css')

import idl from '../../idl.json'
import config from '../config.json'

import { ResultComponent } from '../components/result'
import { Mysolanaapp } from '../types/mysolanaapp'
import { Player, Stadium } from '../types/models'

const { SystemProgram, Keypair } = web3;
/* create an account  */
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);
const defaultStadiumId = ''

const Home: NextPage = () => {
  const wallet = useWallet();
  const [value, setValue] = useState();

  const [network, setNetwork] = useState<string>('http://127.0.0.1:8899')
  const [stadiumPubkey, setStadiumPubkey] = useState<anchor.web3.PublicKey>()
  const [stadium, setStadium] = useState<Stadium>()
  const [playerRegistered, setPlayerRegistered] = useState<boolean>(false)
  const [playerPda, setPlayerPda] = useState<anchor.web3.PublicKey>()
  const [player, setPlayer] = useState<Player>()
  const [provider, setProvider] = useState<anchor.AnchorProvider>()
  const [program, setProgram] = useState<anchor.Program<Mysolanaapp>>()
  const [transactionDone, setTransactionDone] = useState<boolean>(true)
  const [txid, setTxid] = useState<string>('')
  const [txError, setTxError] = useState<string>('')

  useEffect(() => {
    const connection = new Connection(network);
    const provider = new AnchorProvider(connection, 
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      wallet, 
      opts.preflightCommitment
    );
    setProvider(provider)
  }, [network])

  useEffect(() => {
    if (!provider) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const program: any = new Program(idl, programID, provider);
    setProgram(program)

    const pubkey = anchor.web3.PublicKey.decode(Buffer.from(config.defaultStadiumId, 'hex'))
    setStadiumPubkey(pubkey)

    const seeds = [provider.wallet.publicKey.toBuffer()]
    const [playerPda, bumps] = PublicKey.findProgramAddressSync(seeds, program.programId)

    setPlayerPda(playerPda)

  }, [provider])

  useEffect(() => {
    if (!provider|| !program || !stadiumPubkey || !playerPda) {
      return
    }

    const getStadium = async () => {
      try{
        const stadium = await program.account.stadium.fetch(stadiumPubkey);
        const s: Stadium =  {
          bases: stadium.bases,
          outs: stadium.outs,
          score: stadium.score.toString(),
        }
  
        setStadium(s)
      }catch{
        setStadium(undefined)
      }
    }
    getStadium()
  }, [stadiumPubkey])

  const updatePlayer = async () => {
    if (!provider|| !program || !stadiumPubkey || !playerPda) {
      return
    }
    try{
      const p = await program.account.playerAccount.fetch(playerPda);
      const player: Player = {
        score: p.score.toString(),
        lastPlay: p.lastPlay,
        lastScore: p.lastScore,
      }

      setPlayerRegistered(true)
      setPlayer(player)
    }catch{
      setPlayerRegistered(false)
      setPlayer(undefined)
    }
  }

  useEffect(() => {
    updatePlayer()
  }, [playerPda])
  
  const register = () => {
    if (!provider|| !program || !stadiumPubkey || !playerPda) {
      return ''
    }

    setTransactionDone(false)

    const registerPlayer = async () => {
      try{
        const res = await program.rpc.registerPlayer({
          accounts: {
            player: playerPda,
            stadium: stadiumPubkey,
            playerOwner: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
        });
        console.log(res)
        setTxid(res)
      }catch{
        setTxid('')
        setTxError('register failed')
      }
    }

    registerPlayer()
  }

  const play = () => {
    if (!provider|| !program || !stadiumPubkey || !playerPda) {
      return ''
    }

    setTransactionDone(false)

    const playInner = async () => {
      try{
        const res = await program.rpc.play({
          accounts: {
            player: playerPda,
            stadium: stadiumPubkey,
            playerOwner: provider.wallet.publicKey,
          },
        });
        console.log(res)
        setTxid(res)
        setTransactionDone(true)
      } catch {
        setTxid('')
        setTxError('play failed')
      }
    }

    playInner()
  }

  useEffect(() => {
    if (!transactionDone) {
      return
    }
    updatePlayer()
  }, [transactionDone])

  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Baseball</title>
        <meta name="description" content="Play baseball with your NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <VStack margin={32}>
        <Heading>NFT Baseball</Heading>
        <StatGroup background={'#eeeeee'}>
          <Stat margin={10}>
            <StatLabel>Score</StatLabel>
            <StatNumber>{stadium?.score ?? '-'}</StatNumber>
          </Stat>

          <Stat margin={10}>
            <StatLabel>Outs</StatLabel>
            <StatNumber>{stadium?.outs ?? '-'}</StatNumber>
          </Stat>

          <Stat margin={10}>
            <StatLabel>Runners</StatLabel>
            <Image src={toBaseImgSrc(stadium?.bases ?? 0)} />
          </Stat>
        </StatGroup>
        {
          !wallet.connected ? <WalletMultiButton />: <div></div>
        }
        {!wallet.connected ? (
          <Link href={`https://mumbai.polygonscan.com/address/${wallet.publicKey?.toBase58()}`} isExternal>
          {wallet.publicKey?.toBase58()} <ExternalLinkIcon mx='2px'/>
          </Link>
        ) : (<p>not connected</p>)}
        <Divider orientation='horizontal' />
        {/* <VStack>
          <Input placeholder='Batter NFT Address' width={'auto'} onChange={onBatterContractAddressChange} disabled={!address}/>
          <Input placeholder='Batter NFT TokenId' width={'32md'} onChange={onBatterTokenIdChange} disabled={!address}/>
        </VStack> */}
        {/* {batterNftLink != '' ? (<Link href={batterNftLink} isExternal>
          Open in Opensea <ExternalLinkIcon mx='2px'/>
          </Link>): (<div></div>)} */}
        <VStack margin={10}>
          {
            playerRegistered ? (
            <Button onClick={() => play()} colorScheme='blue' variant='outline' disabled={!wallet.connected}>
              Play
            </Button>):(
              <Button onClick={() => register()} colorScheme='blue' variant='outline' disabled={!wallet.connected}>
              Register
            </Button>
            )
          }
          {!!txid ? (
            <Link href={`https://explorer.solana.com/tx/${txid}`} isExternal>
              {wallet.publicKey?.toBase58()} <ExternalLinkIcon mx='2px'/>
            </Link>
          ): (
            <p>{txError}</p>
          )}
        </VStack>
        <Divider orientation='horizontal' />
        {!!txid ? 
          <VStack>
            <HStack>
              {transactionDone ? (<CheckCircleIcon w={8} h={8} color="green.300" />):(<CircularProgress w={4} h={4} isIndeterminate color='blue.300' />)}
              <Link href={`https://explorer.solana.com/tx/${txid}`} isExternal >
              {txid.slice(0, 16)}... <ExternalLinkIcon mx='2px'/>
              </Link>
            </HStack> : <div></div>
            {player && playerPda ? (
              <ResultComponent result={player.lastPlay} batter={playerPda.toBase58()} score={player.lastScore}/>
            ) : <div></div>}
          </VStack>
          : <div></div>
        }
        
        
        <div>

        </div>
      </VStack>
    </div>
  )
}


const toBaseImgSrc = (n: number): string => {
  let baseMarks = '0'
  switch (n & 0b0000_0111) {
    case 0b0000_0001:
      baseMarks = '1'
      break;
    case 0b0000_0010:
      baseMarks = '2'
      break;
    case 0b0000_0100:
      baseMarks = '3'
      break;
    case 0b0000_0100:
      baseMarks = '3'
      break;
    case 0b0000_0011:
      baseMarks = '12'
      break;
    case 0b0000_0101:
      baseMarks = '13'
      break;
    case 0b0000_0110:
      baseMarks = '23'
      break;
    case 0b0000_0111:
      baseMarks = '123'
      break;
    default:
      baseMarks = '0'
      break;
  }
  const src = `/bases/bases.${baseMarks}.svg`
  return src
}

export default Home
