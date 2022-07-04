/**
 * =================================================
 *  MedicalDataコントラクト用のテストスクリプトファイル
 * =================================================
 */

// モジュールのインポート
const truffleAssert = require("truffle-assertions");
const chai = require("chai");
const BN = require("bn.js");
chai.use(require("chai-bn")(BN));
// コントラクトの読み込み
const MedicalData = artifacts.require("MedicalData");

/**
 * テストシナリオ
 */
contract ("MedicalData Contract tests!!", accounts => {
    // 初期登録用の医師のアドレス
    var _doctorAddrs = [
        accounts[1],
        accounts[4]
    ];
    // 初期登録用の医師の名前
    var _doctorNames = [
        "mash",
        "mash2"
    ];
    // ownerアドレス
    const owner = accounts[0];
    // コントラクトを格納する変数
    var medicalData;

    // 共通の関数を定義する。
    function formatDate (date, format) {
        format = format.replace(/yyyy/g, date.getFullYear());
        format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
        format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
        format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
        format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
        format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
        return format;
    };

    /**
     * テスト実行前の準備　
     */
    beforeEach (async () => {
        // Medicalコントラストのインスタンスを生成
        medicalData = await MedicalData.new(_doctorAddrs, _doctorNames, {
            from: accounts[0],
            gas: 5000000
        });
    });

    /**
     * コントラクト初期化関連のテストシナリオ
     */
    describe ("initialization", () => {
        // ownerアドレスを取得し想定したものになっているか確認するシナリオ
        it ("confirm owner address", async () => {
            // ownerアドレスを取得する。
            const ownerAddress = await medicalData.owner();
            // チェック
            assert.equal(ownerAddress, owner, "owner address should match");
        });
        // 登録した医者のアドレスが想定のものと同じになっているか確認するシナリオ
        it ("confirm doctor's address", async () => {
            // 医者のアドレスを取得する。
            const doctorAddress1 = await medicalData.doctors(0);
            const doctorAddress2 = await medicalData.doctors(1);
            // チェック
            assert.equal(doctorAddress1, _doctorAddrs[0], "doctor address should match");
            assert.equal(doctorAddress2, _doctorAddrs[1], "doctor address should match");
        });
        // 登録した医者の名前が想定のものと同じになっているか確認するシナリオ
        it ("confirm doctor's name", async () => {
            // 医者の名前を取得する。
            const doctorAddress1 = await medicalData.doctors(0);
            const doctorName1 = await medicalData.doctorMap(doctorAddress1);
            const doctorAddress2 = await medicalData.doctors(1);
            const doctorName2 = await medicalData.doctorMap(doctorAddress2);
            // チェック
            assert.equal(doctorName1, _doctorNames[0], "doctor name should match");
            assert.equal(doctorName2, _doctorNames[1], "doctor name should match");
        });
    });

    /**
     * 医者の情報を取得する関数のテストシナリオ
     */
    describe ("get doctor info tests", () => {
        // 正常系
        it ("get doctor info", async () => {
            // getDoctorInfoメソッドを呼び出して情報を取得する。
            const result = await medicalData.getDoctorInfo();
            // 取得したデータが想定したものになっているかどうかチェックする。
            assert.equal(_doctorAddrs[0], result[0].doctorAddr, "doctor address should match");
            assert.equal(_doctorAddrs[1], result[1].doctorAddr, "doctor address should match");
            assert.equal(_doctorNames[0], result[0].doctorName, "doctor name should match");
            assert.equal(_doctorNames[1], result[1].doctorName, "doctor name should match");
            assert.equal(false, result[0].isRequire, "required status should match");
            assert.equal(false, result[1].isRequire, "required status should match");
            assert.equal(false, result[0].isApprove, "approved status should match");
            assert.equal(false, result[1].isApprove, "approved status should match");
        });
    });
    /**
     * 医者を新規で追加する際のテストシナリオ
     */
    describe ("add a new doctor", () => {
        // 正常系
        it ("confirm doctor's address and name", async () => {
            // 新しく追加する医者の情報
            const newDoctorAddress = "0x0b80dC45ea6E7cC8eAffd6564C8164dEE1494838";
            const newDoctorName = "mash3";
            // 医者の情報を新しくコントラクトに追加します。
            await medicalData.registDoctor(newDoctorAddress, newDoctorName);
            // 登録した医者のアドレスと名前を取得する。
            const doctorAddress3 = await medicalData.doctors(2);
            const doctorName3 = await medicalData.doctorMap(doctorAddress3);
            // チェック
            assert.equal(doctorAddress3, newDoctorAddress, "doctor address should match");
            assert.equal(doctorName3, newDoctorName, "doctor name should match");
        });
        // 異常系
        it ("Should revert when contract is called from invalid address", async () => {
            // 新しく追加する医者の情報
            const newDoctorAddress = "0x0b80dC45ea6E7cC8eAffd6564C8164dEE1494838";
            const newDoctorName = "mash3";
            // registDoctorメソッドをowner以外のアドレスから呼び出そうとした時に失敗することを確認する。
            await truffleAssert.reverts(
                medicalData.registDoctor(newDoctorAddress, newDoctorName, {from: accounts[1]})
            );
        });
    });

    /**
     * 権限付与及び剥奪メソッドの確認
     */
    describe ("approve method tests", () => {
        // 権限付与の正常系
        it ("approve", async () => {
            // 医者のアドレスを用意する。
            const doctor = _doctorAddrs[0];
            // approveメソッドを呼び出す。
            await medicalData.approve(doctor);
            // 権限状態を取得する。
            const isApproved = await medicalData.approveMap(accounts[0], doctor);
            // チェック
            assert.equal(isApproved, true, "role should match");
        });
        // 権限剥奪の正常系
        it ("chageStatus", async () => {
            // 医者のアドレスを用意する。
            const doctor = _doctorAddrs[0];
            // approveメソッドを呼び出す。
            await medicalData.changeStatus(doctor);
            // 権限状態を取得する。
            const isApproved = await medicalData.approveMap(accounts[0], doctor);
            // チェック
            assert.equal(isApproved, false, "role should match");
        });
        // 権限付与の異常系
        it ("should revert when contract is called from invalid role address", async () => {
            // 医者のアドレスを用意する。
            const doctor = _doctorAddrs[0];
            // 医者の権限を持つアドレスから呼び出した時に処理失敗することを確認する。
            await truffleAssert.reverts(
                medicalData.approve(doctor, {from: _doctorAddrs[1]})
            );
        });
        // 権限剥奪の異常系
        it ("should revert when contract is called from invalid role address", async () => {
            // 医者のアドレスを用意する。
            const doctor = _doctorAddrs[0];
            // 医者の権限を持つアドレスから呼び出した時に処理失敗することを確認する。
            await truffleAssert.reverts(
                medicalData.changeStatus(doctor, {from: _doctorAddrs[1]})
            );
        });
    });

    /**
     * 閲覧権限を要求するメソッドの確認
     */
    describe ("claim approve method tests", () => {
        // 閲覧要求の正常系
        it ("require approvement", async () => {
            // 患者のアドレスを用意する。
            const patient = accounts[1];
            // claimApproveメソッドを呼び出す。
            await medicalData.claimApprove(patient, {from: _doctorAddrs[0]});
            // 権限状態を取得する。
            const isRequiered = await medicalData.requireMap(_doctorAddrs[0], patient);
            // チェック
            assert.equal(isRequiered , true, "status should match");
        });
        // 閲覧要求の異常系
        it ("should revert when contract is called from invalid role address", async () => {
            // 患者のアドレスを用意する。
            const patient = accounts[1];
            // 医者の権限を持たないアドレスからの呼び出し時にエラーが発生することを確認する。
            await truffleAssert.reverts(
                medicalData.claimApprove(patient)
            );
        });
    });

    /**
     * 患者のデータを新規で登録するテスト
     */
    describe ("create a new medical data!!", () => {
        // 新規登録の正常系
        it("create", async() => {
            // 患者のアドレス、名前、血液型を用意する。
            const patientAddr = accounts[2];
            const patientName = "tester"; 
            const bloodType = "O";
            // 医者のアドレスと名前を用意する。
            const doctorAddr = _doctorAddrs[0];
            const doctorName = _doctorNames[0];
            // 現在の時刻を取得する。
            var date = new Date();
            // yyyy/mm/dd形式に変換する
            var lastUpDate = formatDate(date, "yyyy/MM/dd");
            // approveメソッドを呼び出す。
            await medicalData.approve(doctorAddr, {from: patientAddr});
            // createMedicalDataメソッドを呼び出す。
            await medicalData.createMedicalData(patientAddr, patientName, bloodType, lastUpDate, doctorName, {from: doctorAddr});
            // 登録したデータを取得する。
            const result = await medicalData.selectMedicalData({from: patientAddr});
            // 登録したデータが想定通りのものになっているかチェックする。
            assert.equal(result.patientName , patientName, "name should match");
            assert.equal(result.bloodType , bloodType, "bloodType should match");
            assert.equal(result.lastUpdate , lastUpDate, "lastupDate should match");
            assert.equal(result.medicalInsData.doctorName , doctorName, "doctorName should match");
            assert.equal(result.medicalInsData.lastUpdate , lastUpDate, "lastUpDate should match");
        });
        // 医療データ取得の異常系(患者から承認権限を得ていないのに取得しようとした場合)
        it("should revert when contract is called from invalid role address", async() => {
            // 患者のアドレス、名前、血液型、最終更新日時を用意する。
            const patientAddr = accounts[2];
            // 医者のアドレスと名前を用意する。
            const doctorAddr = _doctorAddrs[0];
            // 承認を得ていないのに呼び出し時にエラーが発生することを確認する。
            await truffleAssert.reverts(
                medicalData.selectPatientMedicalData(patientAddr, {from: doctorAddr})
            );
        });
        // 医療データ取得の正常系
        it("get patient's medical data", async() => {
            // 患者のアドレス、名前、血液型、最終更新日時を用意する。
            const patientAddr = accounts[2];
            const patientName = "tester"; 
            const bloodType = "O";
            // 医者のアドレスと名前を用意する。
            const doctorAddr = _doctorAddrs[0];
            const doctorName = _doctorNames[0];

            // 現在の時刻を取得する。
            var date = new Date();
            // yyyy/mm/dd形式に変換する
            var lastUpDate = formatDate(date, "yyyy/MM/dd");
            // 閲覧権限を要求する。
            await medicalData.claimApprove(patientAddr, {from: doctorAddr}); 
            // 医師に権限を付与する。
            await medicalData.approve(doctorAddr, {from: patientAddr});
            // createMedicalDataメソッドを呼び出す。
            await medicalData.createMedicalData(patientAddr, patientName, bloodType, lastUpDate, doctorName, {from: doctorAddr});
            // 登録したデータを取得する。
            const result = await medicalData.selectPatientMedicalData(patientAddr, {from: doctorAddr});
            // 登録したデータが想定通りのものになっているかチェックする。
            assert.equal(result.patientName , patientName, "name should match");
            assert.equal(result.bloodType , bloodType, "bloodType should match");
            assert.equal(result.lastUpdate , lastUpDate, "lastupDate should match");
            assert.equal(result.medicalInsData.doctorName , doctorName, "doctorName should match");
            assert.equal(result.medicalInsData.lastUpdate , lastUpDate, "lastUpDate should match");
        });
        // 新規登録の異常系(医師の権限を持たないアドレスから登録しようとした場合)
        it("should revert when contract is called from invalid role address", async() => {
            // 患者のアドレス、名前、血液型を用意する。
            const patientAddr = accounts[2];
            const patientName = "tester"; 
            const bloodType = "O";
            // 医者のアドレスと名前を用意する。
            const doctorAddr = _doctorAddrs[0];
            const doctorName = _doctorNames[0];
            // 現在の時刻を取得する。
            var date = new Date();
            // yyyy/mm/dd形式に変換する
            var lastUpDate = formatDate(date, "yyyy/MM/dd");
            // 閲覧権限を要求する。
            await medicalData.claimApprove(patientAddr, {from: doctorAddr}); 
            // 医師に権限を付与する。
            await medicalData.approve(doctorAddr, {from: patientAddr});
            // 医師の権限を持たないアドレスから登録しようとした場合にエラーが発生すること。
            await truffleAssert.reverts(
                medicalData.createMedicalData(patientAddr, patientName, bloodType, lastUpDate, doctorName)
            );
        });
        // 新規登録の異常系(患者から承認を得ていないのに登録しようとした場合)
        it("should revert when contract is called from invalid role address", async() => {
            // 患者のアドレス、名前、血液型を用意する。
            const patientAddr = accounts[2];
            const patientName = "tester"; 
            const bloodType = "O";
            // 医者のアドレスと名前を用意する。
            const doctorAddr = _doctorAddrs[0];
            const doctorName = _doctorNames[0];
            // 現在の時刻を取得する。
            var date = new Date();
            // yyyy/mm/dd形式に変換する
            var lastUpDate = formatDate(date, "yyyy/MM/dd");
            // 閲覧権限を要求する。
            await medicalData.claimApprove(patientAddr, {from: doctorAddr}); 
            // 承認を得ていないアドレスから登録しようとした場合にエラーが発生すること。
            await truffleAssert.reverts(
                medicalData.createMedicalData(patientAddr, patientName, bloodType, lastUpDate, doctorName, {from: doctorAddr})
            );
        });
    });

    /**
     * 患者のデータを更新するテスト
     */
    describe ("update a medical data!!", () => {
        // 更新処理の正常系
        it("edit", async() => {
            // まず医療データを登録する。
            // 患者のアドレス、名前、血液型、最終更新日時を用意する。
            const patientAddr = accounts[3];
            const patientName = "tester2"; 
            const bloodType = "O";
            // 医者のアドレスと名前を用意する。
            const doctorAddr = _doctorAddrs[1];
            const doctorName = _doctorNames[1];

            // 現在の時刻を取得する。
            var date = new Date();
            // yyyy/mm/dd形式に変換する
            var lastUpDate = formatDate(date, "yyyy/MM/dd");

            // 閲覧権限を要求する。
            await medicalData.claimApprove(patientAddr, {from: doctorAddr}); 
            // 医師に権限を付与する。
            await medicalData.approve(doctorAddr, {from: patientAddr});
            // createMedicalDataメソッドを呼び出す。
            await medicalData.createMedicalData(patientAddr, patientName, bloodType, lastUpDate, doctorName, {from: doctorAddr});

            // 更新後の患者の医療データを用意する。
            const patientName2 = "tester2"; 
            const bloodType2 = "A";
            // 更新後の医者の名前を用意する。
            const doctorName2 = "mash3";
            // 更新後の時刻を取得する。
            date = new Date();
            // yyyy/mm/dd形式に変換する。
            lastUpDate = formatDate(date, "yyyy/MM/dd");
            // editMedicalDataメソッドを呼び出す。
            await medicalData.editMedicalData(patientAddr, patientName2, bloodType2, lastUpDate, doctorName2, {from: doctorAddr});
            
            // 更新後のデータを取得する。
            const result = await medicalData.selectPatientMedicalData(patientAddr, {from: doctorAddr});
            // 更新後のデータが想定通りのものになっているかチェックする。
            assert.equal(result.patientName , patientName2, "name should match");
            assert.equal(result.bloodType , bloodType2, "bloodType should match");
            assert.equal(result.lastUpdate , lastUpDate, "lastupDate should match");
            assert.equal(result.medicalInsData.doctorName , doctorName2, "doctorName should match");
            assert.equal(result.medicalInsData.lastUpdate , lastUpDate, "lastUpDate should match");
        });
        // 更新処理の異常系(医師の権限を持たないアドレスから更新しようとした場合)
        it("should revert when contract is called from invalid role address", async() => {
            // まず医療データを登録する。
            // 患者のアドレス、名前、血液型、最終更新日時を用意する。
            const patientAddr = accounts[3];
            const patientName = "tester2"; 
            const bloodType = "O";
            // 医者のアドレスと名前を用意する。
            const doctorAddr = _doctorAddrs[1];
            const doctorName = _doctorNames[1];

            // 現在の時刻を取得する。
            var date = new Date();
            // yyyy/mm/dd形式に変換する
            var lastUpDate = formatDate(date, "yyyy/MM/dd");

            // 閲覧権限を要求する。
            await medicalData.claimApprove(patientAddr, {from: doctorAddr}); 
            // 医師に権限を付与する。
            await medicalData.approve(doctorAddr, {from: patientAddr});
            // createMedicalDataメソッドを呼び出す。
            await medicalData.createMedicalData(patientAddr, patientName, bloodType, lastUpDate, doctorName, {from: doctorAddr});

            // 更新後の患者の医療データを用意する。
            const patientName2 = "tester2"; 
            const bloodType2 = "A";
            // 更新後の医者の名前を用意する。
            const doctorName2 = "mash3";
            // 更新後の時刻を取得する。
            date = new Date();
            // yyyy/mm/dd形式に変換する。
            lastUpDate = formatDate(date, "yyyy/MM/dd");

            // editMedicalDataメソッドを呼び出してエラーになることを確認する。
            await truffleAssert.reverts(
                medicalData.editMedicalData(patientAddr, patientName2, bloodType2, lastUpDate, doctorName2)
            )
        });
        // 更新処理の異常系(患者から承認を得ていないアドレスから更新しようとした場合)
        // 没テストシナリオ
        /*
        it("should revert when contract is called from invalid role address", async() => {
            // まず医療データを登録する。
            // 患者のアドレス、名前、血液型、最終更新日時を用意する。
            const patientAddr = accounts[3];
            const patientName = "tester2"; 
            const bloodType = "O";
            // 医者のアドレスと名前を用意する。
            const doctorAddr = _doctorAddrs[1];
            const doctorName = _doctorNames[1];

            // 現在の時刻を取得する。
            var date = new Date();
            // yyyy/mm/dd形式に変換する
            var lastUpDate = formatDate(date, "yyyy/MM/dd");

            // createMedicalDataメソッドを呼び出す。
            await medicalData.createMedicalData(patientAddr, patientName, bloodType, lastUpDate, doctorName, {from: doctorAddr});
            
            // 更新後の患者の医療データを用意する。
            const patientName2 = "tester2"; 
            const bloodType2 = "A";
            // 更新後の医者の名前を用意する。
            const doctorName2 = "mash3";
            // 更新後の時刻を取得する。
            date = new Date();
            // yyyy/mm/dd形式に変換する。
            lastUpDate = formatDate(date, "yyyy/MM/dd");

            // editMedicalDataメソッドを呼び出してエラーになることを確認する。
            await truffleAssert.reverts(
                medicalData.editMedicalData(patientAddr, patientName2, bloodType2, lastUpDate, doctorName2)
            )
        });
        */
    });

    /**
     * 患者のデータを削除するテスト
     */
    describe ("delete a medical data!!", () => {
        // 削除処理の正常系
        it("delete", async() => {
            // まず医療データを登録する。
            // 患者のアドレス、名前、血液型、最終更新日時を用意する。
            const patientAddr = accounts[3];
            const patientName = "tester2"; 
            const bloodType = "O";
            // 医者のアドレスと名前を用意する。
            const doctorAddr = _doctorAddrs[1];
            const doctorName = _doctorNames[1];

            // 現在の時刻を取得する。
            var date = new Date();
            // yyyy/mm/dd形式に変換する
            var lastUpDate = formatDate(date, "yyyy/MM/dd");

            // 閲覧権限を要求する。
            await medicalData.claimApprove(patientAddr, {from: doctorAddr}); 
            // 医師に権限を付与する。
            await medicalData.approve(doctorAddr, {from: patientAddr});
            // createMedicalDataメソッドを呼び出す。
            await medicalData.createMedicalData(patientAddr, patientName, bloodType, lastUpDate, doctorName, {from: doctorAddr});
            // deleteMedicalDataメソッドを呼び出す。
            await medicalData.deleteMedicalData(patientAddr, {from: doctorAddr});
            // 削除後のデータを取得する。
            const result = await medicalData.selectMedicalData({from: patientAddr});

            // 削除後のデータが想定したものと一致しているかチェックする。
            assert.equal(result.patientName , "", "name should match");
            assert.equal(result.bloodType , "", "bloodType should match");
            assert.equal(result.lastUpdate , "", "lastupDate should match");
            assert.equal(result.medicalInsData.doctorName , "", "doctorName should match");
            assert.equal(result.medicalInsData.lastUpdate , "", "lastUpDate should match");
            
            // 削除処理後の閲覧権限を取得する。
            const isApproved = await medicalData.approveMap(patientAddr, _doctorAddrs[0]);
            const isApproved2 = await medicalData.approveMap(patientAddr, _doctorAddrs[1]);
            // 閲覧権限が全て削除されていることを確認する。
            assert.equal(isApproved , false, "approvement should match");
            assert.equal(isApproved2 , false, "approvement should match");
        });
        // 削除処理の異常系(患者から承認を得ていないアドレスから更新しようとした場合)
        // 没テストシナリオ
        /*
        it("should revert when contract is called from invalid role address", async() => {
            // まず医療データを登録する。
            // 患者のアドレス、名前、血液型、最終更新日時を用意する。
            const patientAddr = accounts[3];
            const patientName = "tester2"; 
            const bloodType = "O";
            // 医者のアドレスと名前を用意する。
            const doctorAddr = _doctorAddrs[1];
            const doctorName = _doctorNames[1];

            // 現在の時刻を取得する。
            var date = new Date();
            // yyyy/mm/dd形式に変換する
            var lastUpDate = formatDate(date, "yyyy/MM/dd");

            // createMedicalDataメソッドを呼び出す。
            await medicalData.createMedicalData(patientAddr, patientName, bloodType, lastUpDate, doctorName, {from: doctorAddr});

            // deleteMedicalDataメソッドを呼び出してエラーになることを確認する。
            await truffleAssert.reverts(
                medicalData.deleteMedicalData(patientAddr, {from: doctorAddr})
            )
        });
        */
        // 削除処理の異常系(医師の権限を持っていないアドレスから更新しようとした場合)
        it("should revert when contract is called from invalid role address", async() => {
            // まず医療データを登録する。
            // 患者のアドレス、名前、血液型、最終更新日時を用意する。
            const patientAddr = accounts[3];
            const patientName = "tester2"; 
            const bloodType = "O";
            // 医者のアドレスと名前を用意する。
            const doctorAddr = _doctorAddrs[1];
            const doctorName = _doctorNames[1];

            // 現在の時刻を取得する。
            var date = new Date();
            // yyyy/mm/dd形式に変換する
            var lastUpDate = formatDate(date, "yyyy/MM/dd");

            // 閲覧権限を要求する。
            await medicalData.claimApprove(patientAddr, {from: doctorAddr}); 
            // 医師に権限を付与する。
            await medicalData.approve(doctorAddr, {from: patientAddr});
            // createMedicalDataメソッドを呼び出す。
            await medicalData.createMedicalData(patientAddr, patientName, bloodType, lastUpDate, doctorName, {from: doctorAddr});
    
            // deleteMedicalDataメソッドを呼び出してエラーになることを確認する。
            await truffleAssert.reverts(
                medicalData.deleteMedicalData(patientAddr)
            )
        });
    });

    /**
     * 治療費の支払いに関するテストシナリオ
     */
    describe ("test for paying Treatment costs!!", () => {
        // 支払いテスト
        it("pay !!", async() => {
            // 患者のアドレスを用意する。
            const patientAddr = accounts[3];
            // 2人目の患者のアドレスを用意する。
            const patientAddr2 = accounts[5];
            // 医者のアドレスを用意する。
            const doctorAddr = _doctorAddrs[1];
            // 治療費を定義する。
            const value = web3.utils.toWei('0.01');
            console.log("value:", value);
            // payメソッドの呼び出す。
            await medicalData.pay(doctorAddr, value, {
                from: patientAddr,
                value: value
            });
            // 2人目の支払い
            await medicalData.pay(doctorAddr, value, {
                from: patientAddr2,
                value: value
            });
            // コントラクトの残高をチェックする。
            const contractBalance = await web3.eth.getBalance(medicalData.address);
            console.log("contractBalance:", contractBalance);    
            assert.equal(value * 2, contractBalance, "balance should match");
            // 治療費を引き出す。
            await medicalData.withdraw({from: doctorAddr});
            // 残高が無いのに引き出そうとした時にエラーになることを確認する。
            await truffleAssert.reverts(
                medicalData.withdraw({from: doctorAddr})
            );
        });
        // 異常系 医者のアドレスから支払いを実行しようとした場合
        it("should revert when contract is called from invalid role address", async() => {
            // 患者のアドレスを用意する。
            const patientAddr = accounts[4];
            // 医者のアドレスを用意する。
            const doctorAddr = _doctorAddrs[1];
            // 治療費を定義する。
            const value = web3.utils.toWei('0.01');
            console.log("value:", value);
            // payメソッドの呼び出す。
            await truffleAssert.reverts(
                medicalData.pay(doctorAddr, value, {
                    from: doctorAddr,
                    value: value
                })
            );
        });
        // 異常系 患者のアドレスから残高を引き出そうとした場合
        it("should revert when contract is called from invalid role address", async() => {
            // 患者のアドレスを用意する。
            const patientAddr = accounts[3];
            // 2人目の患者のアドレスを用意する。
            const patientAddr2 = accounts[5];
            // 医者のアドレスを用意する。
            const doctorAddr = _doctorAddrs[1];
            // 治療費を定義する。
            const value = web3.utils.toWei('0.01');
            console.log("value:", value);
            // payメソッドの呼び出す。
            await medicalData.pay(doctorAddr, value, {
                from: patientAddr,
                value: value
            });
            // 2人目の支払い
            await medicalData.pay(doctorAddr, value, {
                from: patientAddr2,
                value: value
            });
            // コントラクトの残高をチェックする。
            const contractBalance = await web3.eth.getBalance(medicalData.address);
            console.log("contractBalance:", contractBalance);    
            assert.equal(value * 2, contractBalance, "balance should match");

            // 治療費を引き出してエラーになることを確認する。
            await truffleAssert.reverts(
                medicalData.withdraw({from: patientAddr2})
            );
        });
    });
});