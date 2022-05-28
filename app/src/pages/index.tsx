import type { NextPage } from 'next'
import Head from 'next/head'

import { Image, Button, ButtonGroup, CircularProgress, Divider, Heading, HStack, Input, Link, VStack, Spinner, Box, Center, Badge, } from '@chakra-ui/react'
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
import { PlayerParamComponent } from '../components/player-param'

const { SystemProgram, Keypair } = web3;
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

type TransactionStatus = 'empty' | 'pending' | 'done'
type TransactionType = 'empty' | 'register' | 'play'

const Home: NextPage = () => {
  const wallet = useWallet();

  const [network, setNetwork] = useState<string>('http://127.0.0.1:8899')
  const [stadium, setStadium] = useState<Stadium>()
  const [playerRegistered, setPlayerRegistered] = useState<boolean>(false)
  const [playerPda, setPlayerPda] = useState<anchor.web3.PublicKey>()
  const [player, setPlayer] = useState<Player>()
  const [txStatus, setTxStatus] = useState<TransactionStatus>('empty')
  const [txType, setTxType] = useState<TransactionType>('empty')
  const [txid, setTxid] = useState<string>('')
  const [txError, setTxError] = useState<string>('')

  const getProvider = () => {
    const connection = new Connection(network)
    const provider = new AnchorProvider(connection, 
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      wallet, 
      opts.preflightCommitment
    )
    return provider
  }

  const getProgram = () => {
    const provider = getProvider()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const program = new Program<Mysolanaapp>(idl, programID, provider);
    return program
  }

  const getStadiumPubkey = () => {
    const pubkey: anchor.web3.PublicKey = anchor.web3.PublicKey.decode(Buffer.from(config.defaultStadiumId, 'hex'))
    return pubkey
  }

  useEffect(() => {
    if (!wallet.connected) {
      return
    }
    if (!wallet.publicKey) {
      return
    }
    const program = getProgram()

    const seeds = [wallet.publicKey.toBuffer()]
    const [playerPda, bumps] = PublicKey.findProgramAddressSync(seeds, program.programId)

    setPlayerPda(playerPda)
  }, [wallet])

  useEffect(() => {
    const program = getProgram()
    const stadiumPubkey = getStadiumPubkey()

    if (!program || !stadiumPubkey) {
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
      }catch(e){
        console.log(e)
        setStadium(undefined)
      }
    }
    setTxError('')
    getStadium()
  }, [player])

  const updatePlayer = async () => {
    const program = getProgram()
    const stadiumPubkey = getStadiumPubkey()
    if (!program || !stadiumPubkey || !playerPda) {
      return
    }
    try{
      const p = await program.account.playerAccount.fetch(playerPda)
      const [power, control, sprint] = getPlayerParam(playerPda)
      const player: Player = {
        score: p.score.toString(),
        lastPlay: p.lastPlay,
        lastScore: p.lastScore,
        power,
        control,
        sprint
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
    const program = getProgram()
    const stadiumPubkey = getStadiumPubkey()
    if (!program || !stadiumPubkey || !playerPda) {
      return
    }
    if (!wallet.connected) {
      return
    }

    const pubkey = wallet.publicKey
    if (!pubkey) {
      return
    }

    setTxType('register')
    setTxStatus('pending')

    const registerPlayer = async () => {
      try{
        const res = await program.rpc.registerPlayer({
          accounts: {
            player: playerPda,
            stadium: stadiumPubkey,
            playerOwner: pubkey,
            systemProgram: SystemProgram.programId,
          },
        });
        console.log(res)
        setTxid(res)
        setTxStatus('done')
      }catch(e){
        console.log(e)
        setTxid('')
        setTxError('register failed')
        setTxStatus('empty')
      }
    }

    registerPlayer()
  }

  const play = () => {
    const program = getProgram()
    const stadiumPubkey = getStadiumPubkey()

    if (!program || !stadiumPubkey || !playerPda) {
      return ''
    }
    if (!wallet.connected) {
      return
    }
    
    const pubkey = wallet.publicKey
    if (!pubkey) {
      return
    }

    setTxType('play')
    setTxStatus('pending')

    const playInner = async () => {
      try{
        const res = await program.rpc.play({
          accounts: {
            player: playerPda,
            stadium: stadiumPubkey,
            playerOwner: pubkey,
          },
        });
        console.log(res)
        setTxid(res)
        setTxStatus('done')
      } catch(e) {
        console.log(e)
        setTxid('')
        setTxError('play failed')
        setTxStatus('empty')
      }
    }

    playInner()
  }

  useEffect(() => {
    updatePlayer()
  }, [txStatus])

  return (
    <Center>
      <Box p={4} bg={'white'} shadow='md' rounded='md'>
        <VStack margin={16}>
          <Heading marginTop={12}>NFT Baseball</Heading>
          <StatGroup background={'#dddddd'}>
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
              <Image src={toBaseImgSrc(stadium?.bases ?? 0)} marginTop={2}/>
            </Stat>
          </StatGroup>
          {
            !wallet.connected ? <WalletMultiButton />: <div></div>
          }
          {wallet.connected ? (
            <Link href={`https://explorer.solana.com/address/${wallet.publicKey?.toBase58()}`} isExternal>
            {wallet.publicKey?.toBase58()} <ExternalLinkIcon mx='2px'/>
            </Link>
            ) : (<p>not connected</p>)
          }
          {!!player ? (
            <PlayerParamComponent power={player.power} control={player.control} sprint={player.sprint}/>
            ) : (<div></div>)
          }
          <Divider orientation='horizontal' />
          <VStack margin={10}>
            {
              playerRegistered ? (
              <Button onClick={() => play()} colorScheme='blue' variant='outline' disabled={!wallet.connected || txStatus == 'pending'}>
                Play
              </Button>):(
                <Button onClick={() => register()} colorScheme='blue' variant='outline' disabled={!wallet.connected || txStatus == 'pending'}>
                Register
              </Button>
              )
            }
          </VStack>
          <Divider orientation='horizontal' />
          {
            txStatus == 'empty' ? (<div></div>) :
            (
              <VStack>
                <HStack>
                  {txStatus == 'done' ? (<CheckCircleIcon w={8} h={8} color="green.300" />):(<Spinner size='md' />)}
                  {txStatus == 'done' ? (
                      <Link href={`https://explorer.solana.com/tx/${txid}`} isExternal >
                        {txid.slice(0, 16)}... <ExternalLinkIcon mx='2px'/>
                      </Link>
                    ):(
                      <p>awaiting confirmation...</p>
                    )
                  }
                </HStack> : <div></div>
                {!!txError ? (<p>{txError}</p>) : (<div></div>)}
                {txStatus == 'done' && player && playerPda && txType == 'play' ? (
                  <ResultComponent result={player.lastPlay} batter={playerPda.toBase58()} score={player.lastScore}/>
                ) : <div></div>}
              </VStack>
            )
          }
        </VStack>
      </Box>
    </Center>
    
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

const getPlayerParam = (key: PublicKey): [number, number, number] => {
  const buf = key.encode()
  const batting_param = buf[3] % 16
  const sprinter_param = buf[4] % 16
  return [batting_param, 16 - batting_param, sprinter_param]
}

export default Home
