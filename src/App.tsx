import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as helpers from '@coach-chuck/solana-helpers';
import fetch from 'node-fetch';
import * as anchor from '@project-serum/anchor';
import { TOKEN_LIST_URL } from "@jup-ag/core";
import { JupiterProvider, useJupiter } from "@jup-ag/react-hook";
import { JupiterToken, SHDW_MINT, SHDW_TOKEN, SOL_MINT } from './models/tokens';
import { Wallet } from './controllers/wallet';
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import ShdwDrive from "@shadow-drive/sdk";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { JupiterApiProvider, useJupiterApiContext } from './controllers/jupiter';
import { Transaction } from '@solana/web3.js';

const NULL_HTML = (<></>);

function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  const { tokenMap, routeMap, loaded, api } = useJupiterApiContext();
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ shdw, setShdw ] = useState<ShdwDrive | undefined>();
  const [routes, setRoutes] = useState<
    Awaited<ReturnType<typeof api.v1QuoteGet>>["data"]
  >([]);

  // --------- JUPITER -------------------------
  const fetchRoute = React.useCallback(() => {
    setIsLoading(true);
    api
      .v1QuoteGet({
        amount: 10000000,
        inputMint: SOL_MINT,
        outputMint: SHDW_MINT,
        slippage: undefined,
      })
      .then(({ data }) => {
        if (data) {
          // console.log(data);
          setRoutes(data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api]);

  useEffect(() => {
    if(anchorWallet && !shdw){
      (new ShdwDrive(connection, anchorWallet).init()).then((drive)=>{
        setShdw(drive);
      }).catch((error)=>{
        console.log("Error " + error);
      })
    }
  }, [wallet]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  // --------- Functions -------------------------
  const getShdw = () => {
    fetchRoute();
    swapSdhw();
  }

  const driveStuff = () => {
  }

  const swapSdhw = async () => {
    if(routes && wallet.publicKey && wallet.signAllTransactions){

      // Wrap Sol
      // Create Associated SHDW account
      // Swap
      // Create Storage

      const {
        swapTransaction,
        setupTransaction,
        cleanupTransaction,
      } = await api.v1SwapPost({
        body: {
          route: routes[0],
          userPublicKey: wallet.publicKey.toBase58(),
        },
      });
      const transactions = (
        [
          setupTransaction,
          swapTransaction,
          cleanupTransaction,
        ].filter(Boolean) as string[]
      ).map((tx) => {
        return Transaction.from(Buffer.from(tx, "base64"));
      });
  
      await wallet.signAllTransactions(transactions);
      for (let transaction of transactions) {
        // get transaction object from serialized transaction
  
        // perform the swap
        const txid = await connection.sendRawTransaction(
          transaction.serialize()
        );
  
        await connection.confirmTransaction(txid);
        alert(`https://solscan.io/tx/${txid}`);

        const drive = await shdw?.createStorageAccount(txid.substring(0, 8), "1MB");
        alert(`https://solscan.io/tx/${drive?.transaction_signature}`);


        // console.log(`https://solscan.io/tx/${txid}`);
      }
    }
  }

  // --------- Renderers -------------------------

  const renderBestRoute = () => {
    if(!wallet.publicKey) return NULL_HTML;

    if(routes){
      const route = routes[0];
      if(route){
        return (
          <div>
            Best route info :{" "}
            {route.marketInfos?.map((info) => info.label)}
          </div>
        );
      }
    }

    return NULL_HTML
  }
  const renderSwapButton = () => {
    if(!wallet.publicKey) return NULL_HTML;

    return (
      <>
        <button onClick={getShdw}>Swap 4 SHDW</button>
      </>
    );
  }

  return (
    <>
        {renderSwapButton()}
        {renderBestRoute()}
        <WalletMultiButton />
    </ >
  );
}

function App() {

  // --------- App -------------------------
  return (
      <div className="App">
        <header className="App-header">
          <Wallet>
            <JupiterApiProvider>
              <Home />
            </JupiterApiProvider>
          </Wallet>
        </header>
      </div>
  );
}

export default App;
