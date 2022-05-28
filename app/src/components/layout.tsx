import Head from 'next/head';
import { ReactNode } from 'react';
import { Center } from '@chakra-ui/react';
import styles from '../styles/Layout.module.css';

type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Baseball</title>
        <meta
          name='description'
          content='Play ball with your NFT'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header className={styles.header}>
        <Center>
          <div className={styles.heading}></div>
        </Center>
      </header>

      <div className={styles.main}>{children}</div>

      <footer className={styles.footer}>
        <a
          href='https://github.com/0xys'
          target='_blank'
          rel='noopener noreferrer'
        >
          Created by 0xys
        </a>
      </footer>
    </div>
  );
};

export default Layout;