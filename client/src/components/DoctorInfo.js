import detectEthereumProvider from '@metamask/detect-provider';
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import MedicalDataContract from "./../contracts/MedicalData.json";
import './App.css';
import ActionButton2 from './common/ActionButton2';
import LoadingIndicator from './common/LoadingIndicator/LoadingIndicator';
// mui関連のコンポーネントのインポート
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

/**
 * 表の最上位ヘッダー部の配列
 */
const columns = [
    { id: 'no', label: 'No.', minWidth: 20, align: 'center' },
    { id: 'address', label: 'Address', minWidth: 200, align: 'center' },
    { id: 'name', label: 'Name', minWidth: 150, align: 'center'},
    { id: 'status', label: 'Status', minWidth: 150, align: 'center'},
    { id: 'cost', label: 'Cost', minWidth: 150, align: 'center'},
];

/** 
 * StyledPaperコンポーネント
 */
 const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    maxWidth: 1000,
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
    // 医師のアドレスを格納するステート変数
    const [doctors, setDoctors] = useState([]);
    // 医師の名前を格納するステート変数
    const [doctorName, setDoctorName] = useState(null);
    // 医師の情報を格納するためのステート変数
    const [doctorInfo, setDoctorInfo] = useState([]);
    // トランザクションが正常に処理された場合のフラグ
    const [successFlg, setSuccessFlg] = useState(false);
    // トランザクションが異常終了した場合のフラグ
    const [failFlg, setFailFlg] = useState(false);
    // ポップアップの表示を管理するフラグ
    const [showToast, setShowToast] = useState(false);
    // ページ番号用のステート変数
    const [page, setPage] = useState(0);
    // 1ページに表示する上限数
    const [rowsPerPage, setRowsPerPage] = useState(10);
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
            
            // 接続中のアドレスが権限情報を取得する。
            const hasDoctorRole = await instance.methods.doctorRoleMap(web3Accounts[0]).call();
            // フラグの情報を更新する。
            if(hasDoctorRole) {
                setIsDoctor(true);
                // 医師の名前を取得してステート変数を更新する。
                const doctorNm = await instance.methods.doctorMap(web3Accounts[0]).call();
                setDoctorName(doctorNm);
            } else {
                // 医師に関する情報を取得する。
                const result = await instance.methods.getDoctorInfo().call({
                    from: web3Accounts[0]
                });
                // ステート変数を更新する。
                setDoctorInfo(result);
                console.log("result:", result)
            }
            
            // コントラクトとWeb3オブジェクト、アカウントの情報をステート変数に格納する。
            setContract(instance);
            setAccount(web3Accounts[0]);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
     };

    /**
     * 「Approve」ボタンを押した時の処理
     * @param doctorAddr 承認を付与する医師のアドレス
     */
    const approveAction = async (doctorAddr) => {
        try {
            setIsLoading(true);
            // registDoctorメソッドを呼び出して医師を新しく登録する。
            await contract.methods.approve(doctorAddr).send({
                from: account,
                gas: 500000
            });
            setIsLoading(false);
            // popUpメソッドの呼び出し
            popUp(true);
        } catch (error) {
            setIsLoading(false);
            console.error("approve err:", error);
            // popUpメソッドの呼び出し
            popUp(false);
        }
    };

    /**
     * 「Deprive」ボタンを押した時の処理
     * @param doctorAddr 承認を付与する医師のアドレス
     */
    const depriveAction = async (doctorAddr) => {
        try {
            setIsLoading(true);
            // registDoctorメソッドを呼び出して医師を新しく登録する。
            await contract.methods.changeStatus(doctorAddr).send({
                from: account,
                gas: 500000
            });
            setIsLoading(false);
            // popUpメソッドの呼び出し
            popUp(true);
        } catch (error) {
            setIsLoading(false);
            console.error("deprive err:", error);
            // popUpメソッドの呼び出し
            popUp(false);
        }
    };

    /**
     * 「0.01ETH Pay」ボタンを押した時の処理 
     */
    const payAction = async (doctorAddr) => {
        try {
            // 治療費を用意する。
            const value = Web3.utils.toWei('0.01');
            setIsLoading(true);
            // payメソッドを呼び出して支払い処理を実行する。
            await contract.methods.pay(doctorAddr, value).send({
                from: account,
                value: value
            });
            setIsLoading(false);
            // popUpメソッドの呼び出し
            popUp(true);
        } catch (error) {
            console.error("pay err:", error);
            setIsLoading(false);
            // popUpメソッドの呼び出し
            popUp(false);
        }
    };

    /**
     * 「Withdraw」ボタンを押した時に処理するボタン
     */
    const withdrawAction = async () => {
        try {
            setIsLoading(true);
            // withdrawメソッドを呼び出して医師を新しく登録する。
            await contract.methods.withdraw().send({
                from: account,
                gas: 210000
            });
            setIsLoading(false);
            // popUpメソッドの呼び出し
            popUp(true);
        } catch (error) {
            setIsLoading(false);
            console.error("withdraw err:", error);
            // popUpメソッドの呼び出し
            popUp(false);
        }
    };

    /**
     * ポップアップ時の処理を担当するメソッド
     * @param flg true：成功 false：失敗
     */
    const popUp = (flg) => {
        // 成功時と失敗時で処理を分岐する。
        if(flg === true) {
            // ステート変数を更新する。
            setSuccessFlg(true);
            setShowToast(true);
            // 5秒後に非表示にする。
            setTimeout(() => {
                setSuccessFlg(false);
                setShowToast(false);
            }, 5000);
        } else {
            // ステート変数を更新する。
            setFailFlg(true);
            setShowToast(true);
            // 5秒後に非表示にする。
            setTimeout(() => {
                setFailFlg(false);
                setShowToast(false); 
            }, 5000);
        }
    };

    /**
     * Statusコンポーネント
     * @param value 要求されているかのフラグ情報
     * @param doctorAddr 医師のアドレス
     */
    const renderStatus = (value, doctorAddr) => {
        // 医者から承認が要求されている場合には、メッセージを表示させる。
        if(value) {
            return (
                <>
                    <ActionButton2 buttonName="Approve" color="success" clickAction={(e) => approveAction(doctorAddr)} />
                    You are required.
                </>
            );
        } else {
            return <ActionButton2 buttonName="Approve" color="success" clickAction={(e) => approveAction(doctorAddr)} />
        }
    } 

    /**
     * ページングするための関数
     * @param e イベント内容
     * @param newPage 新しいページ
     */
     const handleChangePage = (e, newPage) => {
        setPage(newPage);
    };
    
    /**
     * 1ページに表示する取引履歴の上限を引き上げる関数
     * @param e イベント内容
     */
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(e.target.value);
        setPage(0);
    };

    // 副作用フック
    useEffect(() => {
        setIsLoading(true);
        init();
        setIsLoading(false);
    }, [account]);

    // 副作用フック2
    useEffect(() => {
        setIsLoading(true);
        init();
        setIsLoading(false);
    }, []);

    return(
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3, mt: 10, height: '80vh'}}>
                <StyledPaper sx={{my: 1, mx: "auto", p: 0, borderRadius: 4, marginTop: 4}}>
                    {/* 処理実行時には、ローディングバーを表示させる。 */}
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
                                    <p><strong>{isDoctor ? "Your Info" : "Doctor's Info" }</strong></p>
                                </Grid>
                            </Grid>
                            {/* 医者の場合と患者の場合で表示を切り替える。 */}
                            {isDoctor ? (
                                <Grid 
                                    container
                                    justifyContent="center" 
                                    direction="row"
                                >
                                    <Grid 
                                        container
                                        justifyContent="center" 
                                        direction="row"
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{ 
                                                p: '2px 4px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                backgroundColor: '#fde9e8',
                                                width: 600, 
                                                marginTop: 1,
                                                marginBottom: 1
                                            }}
                                        >  
                                            address：　{account}
                                        </Paper>
                                    </Grid>
                                    <Grid 
                                        container
                                        justifyContent="center" 
                                        direction="row"
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{ 
                                                p: '2px 4px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                backgroundColor: '#fde9e8',
                                                width:600, 
                                                marginTop: 1,
                                                marginBottom: 4
                                            }}
                                        >  
                                            name：　{doctorName}
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
                                        <ActionButton2 buttonName="Withdraw" color="error" clickAction={withdrawAction} />
                                    </Grid> 
                                </Grid>
                            ) : (
                                <>
                                    {/* 以下、医者の情報を表示する一覧表部分 */}
                                    <TableContainer sx={{ maxHeight: 600 }}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    {columns.map((column) => (
                                                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                { doctorInfo
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((row, i) => {
                                                        return (
                                                            <TableRow hover role="checkbox" tabIndex={-1}>
                                                                {columns.map((column) => {
                                                                    // セルに格納する値用の変数
                                                                    let value = row; 
                                                                    // カラムの値により、セットする値を変更する。
                                                                    if(column.label === "No.") {
                                                                        return (
                                                                            <TableCell key={column.id} align={column.align}>
                                                                                {i + 1}
                                                                            </TableCell>
                                                                        );
                                                                    }
                                                                    if(column.label === "Address") {
                                                                        return (
                                                                            <TableCell key={column.id} align={column.align}>
                                                                                {value.doctorAddr}
                                                                            </TableCell>
                                                                        );
                                                                    }
                                                                    /* NameとStatusについては個別に条件が異なってくるので別関数で条件を整理して描画する。 */
                                                                    if(column.label === "Name") {
                                                                        return (
                                                                            <TableCell key={column.id} align={column.align}>
                                                                                {value.doctorName}
                                                                            </TableCell>
                                                                        )
                                                                    } 
                                                                    /* 医者の場合は表示しない */
                                                                    if(!isDoctor) {
                                                                        if(column.label === "Status") {
                                                                            return (
                                                                                <TableCell key={column.id} align={column.align}>
                                                                                    {/* 承認状態によって表示するボタンを変更する。 */}
                                                                                    {value.isApprove ? 
                                                                                        <ActionButton2 buttonName="Deprive" color="secondary" clickAction={(e) => {depriveAction(value.doctorAddr); init();}} />
                                                                                    :
                                                                                        renderStatus(value.isRequire, value.doctorAddr)
                                                                                    }
                                                                                </TableCell>
                                                                            )
                                                                        }
                                                                    } else {
                                                                        if(column.label === "Status") {
                                                                            return <></>;
                                                                        }
                                                                    }   
                                                                    /* 治療費支払い用のボタン出力する。 */
                                                                    if(column.label === "Cost") {
                                                                        return (
                                                                            <TableCell key={column.id} align={column.align}>
                                                                                <ActionButton2 buttonName="0.01ETH Pay" color="primary" clickAction={(e) => {payAction(value.doctorAddr); init();}} />
                                                                            </TableCell>
                                                                        )
                                                                    }        
                                                                })}
                                                            </TableRow>
                                                        );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={doctors.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </>
                            )}
                        </>
                    )} 
                </StyledPaper>
            </Box>
            {successFlg && (
                /* 成功時のポップアップ */
                <div id="toast" className={showToast ? "zero-show" : ""}>
                    <div id="secdesc">Trasaction Successful!!</div>
                </div>
            )}
            {failFlg && (
                /* 失敗時のポップアップ */
                <div id="toast" className={showToast ? "zero-show" : ""}>
                    <div id="desc">Trasaction failfull....</div>
                </div>
            )}
        </Grid>
    );
};

export default DoctorInfo;