import './App.css';
import React, { useState, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
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
 * DoctorInfoコンポーネント
 */
function DoctorInfo() {
    // コントラクト用のステート変数
    const [contract, setContract] = useState(null); 
    // アカウント用のステート変数
    const [account, setAccount] = useState(null);
    // 医者の権限を管理するフラグのステート変数
    const [isDoctor, setIsDoctor] = useState(false);
    // 編集モードへの切り替えを管理するフラグのステート変数
    const [isEditer, setEditer] = useState(false);

    /**
     * コンポーネントが描画されたタイミングで実行する初期化関数
     */
     const init = async() => {};

    /**
     * 「Approve」ボタンを押した時の処理
     */
    const approveAction = async () => {};

    /**
     * 「Deprive」ボタンを押した時の処理
     */
    const depriveAction = async () => {};

    // 副作用フック
    useEffect(() => {
        init();
    }, []);

    return(
        <p>テスト</p>
    );
};

export default DoctorInfo;