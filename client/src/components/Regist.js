import './App.css';
import React, { useState, useEffect } from "react";
import MedicalDataContract from "./../contracts/MedicalData.json";
import Web3 from "web3";
// muiコンポーネント
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

/** 
 * StyledPaperコンポーネント
 */
 const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    maxWidth: 600,
    backgroundColor: '#fde9e8'
}));


/**
 * Registコンポーネント
 */
function Regist() {
    // ステート変数
    // 必要なもの
    // コントラクト用
    // アカウント用
    // Web3オブジェクト用
    // 医者の権限を管理するフラグ
    // 編集モードへの切り替えを管理するフラグ
    // 医者のアドレス用
    // 医者の名前用

    /**
     * コンポーネントが描画されたタイミングで実行する初期化関数
     */
    const init = async() => {};

    /**
     * 「Regist」ボタンを押した時の処理
     */
    const registAction = async() => {}

    // 副作用フック
    useEffect(() => {
        init();
    });

    return(
        <p>テスト</p>
    );
};

export default Regist;