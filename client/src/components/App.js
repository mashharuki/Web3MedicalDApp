import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Web3Menu from "./common/Web3Menu";
import Home from './Home';
// material-ui関連をインポートする。
import AppBar  from '@mui/material/AppBar';
import Toolbar  from '@mui/material/Toolbar';
import Typography  from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';


/**
 * Appコンポーネント
 */
function App() {
  
  
  /**
   * ウォレットの接続状態を確認するメソッド
   */

  /**
   * ウォレット接続ボタンを押した時の処理
   */

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
                <Web3Menu/>
              </Typography>
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/" exact element={ <Home/> } />
            <Route path="/home" exact element={ <Home/> } />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
