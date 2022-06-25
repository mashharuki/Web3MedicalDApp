import './App.css';
import React, { useState, useEffect } from "react";
import MedicalDataContract from "./../contracts/MedicalData.json";
import Web3 from "web3";
// mui関連のコンポーネントのインポート
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';


/** 
 * StyledPaperコンポーネント
 */
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    maxWidth: 600,
    backgroundColor: '#fde9e8'
}));


/**
 * Homeコンポーネント
 */
const Home = () => {
    // ステート変数
    // 必要なもの
    // コントラクト用
    // アカウント用
    // Web3オブジェクト用
    // 医者の権限を管理するフラグ
    // 編集モードへの切り替えを管理するフラグ
    // 患者の医療データ用の変数

    /**
     * コンポーネントが描画されたタイミングで実行する初期化関数
     */
    const init = async() => {};

    /**
     * 「View」ボタンを押した時の処理
     */
    const viewAction = async () => {};

    /**
     * 「Require」ボタンを押した時の処理
     */
    const requireAction = async () => {};

    /**
     * 「Update」ボタンを押した時の処理
     */
    const updateAction = async () => {};

    /**
     * 「Delete」ボタンを押した時の処理
     */
    const deleteAction = async () => {};

    // 副作用フック
    useEffect(() => {
        init();
    }, []);

    return(
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3, mt: 10}}>
                <StyledPaper sx={{my: 1, mx: "auto", p: 0, borderRadius: 4, marginTop: 4}}>
                    {/* 医師の場合初期で描画する内容 */}
                    {/* 医師の場合で編集モードで描画する内容 */}
                    {/* 権限を持っている場合とそうでない場合で描画内容を変更する。 */}
                    {/* 患者の場合 */}
                    {/* 内容が取得できなければ登録されていないという旨のメッセージを表示する。 */}
                    <p>
                        Connect Wallet成功!
                    </p>
                    <p>
                        Connect Wallet成功!
                    </p>
                    <p>
                        Connect Wallet成功!
                    </p>
                    <p>
                        Connect Wallet成功!
                    </p>
                    <p>
                        Connect Wallet成功!
                    </p>
                </StyledPaper>
            </Box>
        </Grid>
    );
}

export default Home;