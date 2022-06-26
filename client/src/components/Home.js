import './App.css';
import React, { useState, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import MedicalDataContract from "./../contracts/MedicalData.json";
import Web3 from "web3";
// mui関連のコンポーネントのインポート
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { TextField } from '@mui/material';
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
    // コントラクト用のステート変数
    const [contract, setContract] = useState(null); 
    // アカウント用のステート変数
    const [account, setAccount] = useState(null);
    // 医者の権限を管理するフラグ
    const [isDoctor, setIsDoctor] = useState(false);
    // 編集モードへの切り替えを管理するフラグ
    const [isEditer, setEditer] = useState(false);
    // 承認されているかのフラグ
    const [isApproved, setIsApproved] = useState(true);
    // データ未登録フラグ
    const [hasData, setHasData] = useState(false);
    // 患者のアドレス
    const [patientAddr, setPatientAddr] = useState(null);
    // 患者の名前
    const [patientName, setPatientName] = useState(null);
    // 患者の血液型
    const [bloodType, setBloodType] = useState(null);
    // 医者の名前
    const [doctorName, setDoctorName] = useState(null);
    // 最終更新日時
    const [lastUpDate, setLastUpDate] = useState(null);
    // トランザクションが正常に処理された場合のフラグ
    const [successFlg, setSuccessFlg] = useState(false);
    // トランザクションが異常終了した場合のフラグ
    const [failFlg, setFailFlg] = useState(false);
    // ポップアップの表示を管理するフラグ
    const [showToast, setShowToast] = useState(false);
    // ポップアップ時に表示する文言を格納する変数
    const [popUpDocs, setPopUpDocs] = useState("");

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
            
            // 接続中のアドレスが権限情報を取得する。
            const hasDoctorRole = await instance.methods.doctorRoleMap(web3Accounts[0]).call();
            // フラグの情報を更新する。
            if(hasDoctorRole) {
                setIsDoctor(true);
            } else {
                // 患者のアドレスをステート変数に格納する。
                setAccount(web3Accounts[0]);
                // 患者であればこの時点で医療データを取得し、ステート変数に詰める。
                var result = await instance.methods.selectMedicalData().call();
                // 最終更新日時を取得する。
                var lastUpdate = result.lastUpdate;
                console.log("result:", result)
                console.log("lastUpDate:", lastUpdate)
                // 最終更新日時が空であればデータ未登録フラグをONにする。
                if(lastUpdate === '') {
                    setHasData(true);
                } else {
                    // 各データをステート変数に格納する。
                    setPatientName(result.patientName);
                    setBloodType(result.bloodType);
                    setDoctorName(result.medicalInsData.doctorName);
                    setLastUpDate(lastUpdate);
                }
            }
            // コントラクトとアカウントの情報をステート変数に格納する。
            setContract(instance);
            setAccount(web3Accounts[0]);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    };

    /**
     * 「View」ボタンを押した時の処理
     */
    const viewAction = async () => {
        // 閲覧権限を患者から承認されているか確認する。
        var approved = await contract.methods.approveMap(patientAddr, account).call();
        // 承認されていれば医療データを取得し、そうでなければ未承認フラグをfalseにする。
        if (approved) {
            // getMedicalDataメソッドを呼び出す。
            getMedicalData();
        } else {
            setIsApproved(false);
        }
        // 編集モードをONにする。
        setEditer(true);
        // getMedicalDataメソッドの呼び出し
        getMedicalData();
    };

    /**
     * 「Require」ボタンを押した時の処理
     */
    const requireAction = async () => {
        try {
            // claimApproveメソッドの呼び出し
            await contract.methods.claimApprove(patientAddr).send({
                from: account,
                gas: 500000
            });
            // popUpメソッドを呼び出す。
            popUp(true, "Trasaction Successful!!");
        } catch (error) {
            console.error("require approvement fail:", error);
            // popUpメソッドの呼び出し
            popUp(false, "Require approvement failed....");
        }
    };
    
    /**
     * 「Create」ボタンを押した時の処理
     */
    const createAction = async () => {
        try {
            // 現在の時刻を取得する。
            var lastUpDate = getDate();
            // createMedicalDataメソッドを呼び出す。
            await contract.methods.createMedicalData(
                patientAddr,
                patientName,
                bloodType,
                lastUpDate,
                doctorName
                ).send({
                    from: account,
                    gas: 500000
                });
            // popUpメソッドを呼び出す。
            popUp(true, "Trasaction Successful!!");
        } catch (error) {
            console.error("Create medical datas fail:", error);
            // popUpメソッドの呼び出し
            popUp(false, "Create medical datas failed....");
        }
    };

    /**
     * 「Update」ボタンを押した時の処理
     */
    const updateAction = async () => {
        try {
            // 現在の時刻を取得する。
            var lastUpDate = getDate();
            // editMedicalDataメソッドを呼び出す。
            await contract.methods.editMedicalData(
                patientAddr,
                patientName,
                bloodType,
                lastUpDate,
                doctorName
                ).send({
                    from: account,
                    gas: 500000
                });
            // popUpメソッドを呼び出す。
            popUp(true, "Trasaction Successful!!");
        } catch (error) {
            console.error("Update medical datas fail:", error);
            // popUpメソッドの呼び出し
            popUp(false, "Update medical datas failed....");
        }
    };

    /**
     * 「Delete」ボタンを押した時の処理
     */
    const deleteAction = async () => {
        try {
            // deleteMedicalDataメソッドを呼び出す。
            await contract.methods.deleteMedicalData(patientAddr).send({
                from: account,
                gas: 500000
            });
            // popUpメソッドを呼び出す。
            popUp(true, "Trasaction Successful!!");
        } catch (error) {
            console.error("delete medical datas fail:", error);
            // popUpメソッドの呼び出し
            popUp(false, "Delete medical datas failed....");
        }
    };

    /**
     * 患者の医療データを取得するメソッド
     */
    const getMedicalData = async () => {
        try {
            // 取得した結果を格納するための変数
            var result;
            // 接続中のアドレスが医者の場合
            if(isDoctor) {
                // 患者の医療データを取得する。
                result = await contract.methods.selectPatientMedicalData(patientAddr).call();
            }
            // 医療データを各ステート変数に格納する。
            setPatientName(result.patientName);
            setBloodType(result.bloodType);
            setDoctorName(result.medicalInsData.doctorName);
            setLastUpDate(result.lastUpdate);
            // popUpメソッドを呼び出す。
            popUp(true, "Trasaction Successful!!");
        } catch (error) {
            console.error("get medical datas fail:", error);
            // popUpメソッドの呼び出し
            popUp(false, "Get medical datas failed....");
        }
    };

    /**
     * 現在の時刻をyyyy/mm/ddフォーマットで取得するメソッド
     */
    function getDate() {
        // 現在の時刻を取得する。
        var date = new Date();
        // フォーマットの指定
        var format = "yyyy/MM/dd";
        // フォーマットに合わせて変換する。
        format = format.replace(/yyyy/g, date.getFullYear());
        format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
        format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
        format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
        format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
        format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
        // 返却
        return format;
    };

    /**
     * ポップアップ時の処理を担当するメソッド
     * @param flg true：成功 false：失敗
     * @param docs ポップアップに出力する文言
     */
    const popUp = (flg, docs) => {
        // 成功時と失敗時で処理を分岐する。
        if(flg === true) {
            // ステート変数を更新する。
            setSuccessFlg(true);
            setShowToast(true);
            setPopUpDocs(docs);
            // 5秒後に非表示にする。
            setTimeout(() => {
                setSuccessFlg(false);
                setShowToast(false);
                setPopUpDocs("");
            }, 5000);
        } else {
            // ステート変数を更新する。
            setFailFlg(true);
            setShowToast(true);
            setPopUpDocs(docs);
            // 5秒後に非表示にする。
            setTimeout(() => {
                setFailFlg(false);
                setShowToast(false);
                setPopUpDocs("");
            }, 5000);
        }
    };

    /**
     *  医者の場合に表示するコンポーネント
     */
    const doctorRender = () => { 
        return (
            <>医者</>
        );
    }

    /**
     * 患者の場合に表示するコンポーネント
     */
    const patientRender = () => { 
        return (
            <>患者</>
        );
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
            <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3, mt: 10}}>
                <StyledPaper sx={{my: 1, mx: "auto", p: 0, borderRadius: 4, marginTop: 4}}>
                    {isDoctor ? (
                        /* 医師の場合初期で描画する内容 */
                        doctorRender()
                    ) : (
                        /* 患者の場合は、正常系はデータを表示するだけ */
                        patientRender() 
                    )}
                    {/* 医師の場合で編集モードで描画する内容 */}
                    {/* 承認されている場合とそうでない場合で描画内容を変更する。 */}
                    {/* 内容が取得できなければ登録されていないという旨のメッセージを表示する。 */}
                </StyledPaper>
            </Box>
            {successFlg && (
                /* 成功時のポップアップ */
                <div id="toast" className={showToast ? "zero-show" : ""}>
                    <div id="secdesc">{popUpDocs}</div>
                </div>
            )}
            {failFlg && (
                /* 失敗時のポップアップ */
                <div id="toast" className={showToast ? "zero-show" : ""}>
                    <div id="desc">{popUpDocs}</div>
                </div>
            )}
        </Grid>
    );
}

export default Home;