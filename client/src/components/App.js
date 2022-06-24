import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Web3Menu from "./common/Web3Menu";
import LoadingIndicator from "./common/LoadingIndicator";
import Home from './Home';
// mui関連をインポートする。
import AppBar  from '@mui/material/AppBar';
import Toolbar  from '@mui/material/Toolbar';
import Typography  from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import IconButton from '@mui/material/IconButton';
import StartIcon from '@mui/icons-material/Start';


/**
 * Appコンポーネント
 */
function App() {
  // ステート変数
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 接続されているネットワークが想定されているものかチェックする。
   */
  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "5") {
        alert("Goreli Test Network に接続してください!");
      } else {
        console.log("Goreliに接続中。");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  /**
   * ウォレットの接続状態を確認するメソッド
   */
  const checkIfWalletIsConnected = async () => {
    // Metamaskのオブジェクトを取得する。
    const { ethereum } = window;

    try {
      // インストールされていない場合
      if (!ethereum) {
        alert("Please install MetaMask!");
        setIsLoading(false);
        return;
      } else {
        // インストールされている場合
        // MetaMaskのアカウント情報を取得する。
        const accounts = await ethereum.request({ method: "eth_accounts" });
        // アカウントの情報を主とする。
        if (accounts.length !== 0) {
          const account = accounts[0];
          // ステート変数を更新する。
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch(error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  /**
   * ウォレット接続ボタンを押した時の処理
   */
  const connectWalletAction = async () => {
    try {
      // Metamaskのオブジェクトを取得する。
      const { ethereum } = window;
      // インストールされていなかった場合
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      // ウォレットの接続状態をチェックする。
      checkIfWalletIsConnected();
      // ウォレットアドレスに対してアクセスをリクエストする。
      const accounts = await ethereum.request({method: "eth_requestAccounts",});
      // ステート変数にアカウント情報を格納する。
      setCurrentAccount(accounts[0]);
      // goreliネットワークに接続されていることをチェックする。
      // checkNetwork();
    } catch (error) {
      console.log(error);
    }
  };

  // 副作用フック(読み込み時)
  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  // 副作用フック2 (アカウント切り替え時)
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]);

  return (
    <>
      <GlobalStyles styles={{ body: { margin: 0, padding: 0 } }} />
      <Router>
        <div sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="transparent">
            <Toolbar>
              <Typography variant="h6" color="white" sx={{ flexGrow: 1 }}>
                <strong>Web3 Medical DApp</strong>
              </Typography>
              <Typography variant="h6" color="inherit">
                {currentAccount === null ? (
                  <IconButton 
                    aria-label="more"
                    id="connect-wallet"
                    aria-haspopup="true"
                    onClick={connectWalletAction}
                  >
                    <StartIcon />
                  </IconButton>
                ) :
                  <Web3Menu/>
                }
              </Typography>
            </Toolbar>
          </AppBar>
          { isLoading ?? <LoadingIndicator/>}
          { currentAccount === null ? (
            <header className="App-header">
              <p>Please Connect Your Wallet!!</p>
            </header>
          ) : (
            <Routes>
              <Route path="/" exact element={ <Home/> } />
              <Route path="/home" exact element={ <Home/> } />
            </Routes>
          )}
        </div>
      </Router>
    </>
  );
}

export default App;
