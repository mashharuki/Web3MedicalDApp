import logo from './../assets/logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Web3Menu from "./common/Web3Menu";
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
