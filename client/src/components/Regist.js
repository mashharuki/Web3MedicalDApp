import './App.css';
import Web3 from 'web3';
import React, { useState, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import MedicalDataContract from "./../contracts/MedicalData.json";
import ActionButton from './common/ActionButton';
import LoadingIndicator from './common/LoadingIndicator/LoadingIndicator';
// muiコンポーネント
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { TextField } from '@mui/material';

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
    // コントラクト用のステート変数
    const [contract, setContract] = useState(null); 
    // アカウント用のステート変数
    const [account, setAccount] = useState(null);
    // ownerであるかのフラグ用のステート変数
    const [isOwner, setIsOwner] = useState(null);
    // 医者のアドレス用
    const [doctorAddr, setDoctorAddr] = useState(null);
    // 医者の名前用
    const [doctorName, setDoctorName] = useState(null);
    // トランザクションが正常に処理された場合のフラグ
    const [successFlg, setSuccessFlg] = useState(false);
    // トランザクションが異常終了した場合のフラグ
    const [failFlg, setFailFlg] = useState(false);
    // ポップアップの表示を管理するフラグ
    const [showToast, setShowToast] = useState(false);
    // ローディングを表示するためのフラグ
    const [isLoading, setIsLoading] = useState(false);

    /**
     * コンポーネントが描画されたタイミングで実行する初期化関数
     */
    const init = async() => {
        try {
            // プロバイダー情報を取得する。
            const provider = await detectEthereumProvider();
            // Web3オブジェクト作成
            const web3 = new Web3(provider);
            // アカウント情報を取得する。
            const web3Accounts = await web3.eth.getAccounts();
            // ネットワークIDを取得する。
            const networkId = await web3.eth.net.getId();
            // コントラクトのアドレスを取得する。
            const deployedNetwork = MedicalDataContract.networks[networkId];
            // コントラクト用のインスタンスを生成する。
            const instance = new web3.eth.Contract(MedicalDataContract.abi, deployedNetwork && deployedNetwork.address,);
            
            // Ownerのアドレスを取得する。
            const ownerAddr = await instance.methods.owner().call();
            // 接続中のアドレスとownerのアドレスが一致するかチェックする。
            if(ownerAddr == web3Accounts[0]) setIsOwner(true);
            // コントラクトとWeb3オブジェクト、アカウントの情報をステート変数に格納する。
            setContract(instance);
            setAccount(web3Accounts[0]);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    };

    /**
     * 「Regist」ボタンを押した時の処理
     */
    const registAction = async() => {
        try {
            setIsLoading(true);
            // registDoctorメソッドを呼び出して医師を新しく登録する。
            await contract.methods.registDoctor(doctorAddr, doctorName).send({
                from: account,
                gas: 500000
            });
            setIsLoading(false);
            // ステート変数を更新する。
            setSuccessFlg(true);
            setShowToast(true);
            // 5秒後に非表示にする。
            setTimeout(() => {
                setSuccessFlg(false);
                setShowToast(false);
            }, 5000);
        } catch (error) {
            console.error("regist err:", error);
            // ステート変数を更新する。
            setFailFlg(true);
            setShowToast(true);
            // 5秒後に非表示にする。
            setTimeout(() => {
                setFailFlg(false);
                setShowToast(false);
            }, 5000);
        }
    }

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
            { isOwner ? (
                <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3, mt: 10, height: '80vh'}}>
                    {/* ownerである場合に描画する内容 */}
                    <StyledPaper sx={{my: 1, mx: "auto", p: 0, borderRadius: 4, marginTop: 4}}>
                        {isLoading ? ( 
                            <Grid container justifyContent="center">
                                <header className="loading">
                                    <p><LoadingIndicator/></p>
                                    <h3>Please Wait・・・・</h3>
                                </header>
                            </Grid>
                        ) : (
                            <>
                                <Grid container justifyContent="center">
                                    <Grid 
                                        container
                                        justifyContent="center"
                                        sx={{ 
                                            alignItems: 'center', 
                                            m: 1,
                                        }}
                                    >
                                        <p><strong>Please etner a new doctor's address & name</strong></p>
                                    </Grid>
                                    <Paper
                                        elevation={0}
                                        sx={{ 
                                            p: '2px 4px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            backgroundColor: '#fde9e8',
                                            width: 450, 
                                            marginTop: 1
                                        }}
                                    >  
                                        <label>doctor Address：</label>
                                        <TextField 
                                            id="doctorAddress" 
                                            placeholder="doctor address" 
                                            margin="normal" 
                                            required
                                            onChange={ (e) => setDoctorAddr(e.target.value) } 
                                            variant="outlined" 
                                            inputProps={{ 'aria-label': 'doctorAddress' }} 
                                        />
                                    </Paper>
                                    <Paper
                                        elevation={0}
                                        sx={{ 
                                            p: '2px 4px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            backgroundColor: '#fde9e8',
                                            width: 450, 
                                            marginTop: 4
                                        }}
                                    >  
                                        <label>doctor Name：　</label>
                                        <TextField 
                                            id="doctorName" 
                                            placeholder="doctor name" 
                                            margin="normal" 
                                            required
                                            onChange={ (e) => setDoctorName(e.target.value) } 
                                            variant="outlined" 
                                            inputProps={{ 'aria-label': 'doctoName' }} 
                                        />
                                    </Paper>
                                </Grid>
                                <Grid 
                                    container 
                                    justifyContent="center"
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        m: 1,
                                        marginTop: 4
                                    }}
                                >
                                    <ActionButton buttonName="Regist" color="error" clickAction={registAction} />
                                </Grid>
                            </>
                        )} 
                    </StyledPaper>
                </Box>
            ) : (
                <div className="App-header">
                    {/* Owner以外には表示しない */}
                    <p>You don't have owner role....</p>
                </div>
            )}
            {successFlg && (
                /* 成功時のポップアップ */
                <div id="toast" className={showToast ? "zero-show" : ""}>
                    <div id="secdesc">Regist Trasaction Successful!!</div>
                </div>
            )}
            {failFlg && (
                /* 失敗時のポップアップ */
                <div id="toast" className={showToast ? "zero-show" : ""}>
                    <div id="desc">fail.. Please check address & name</div>
                </div>
            )}
        </Grid>
    );
};

export default Regist;