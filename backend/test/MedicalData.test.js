/**
 *  MedicalDataコントラクト用のテストスクリプトファイル
 */

// コントラクトの読み込み
const MedicalData = artifacts.require("MedicalData");

/**
 * テストシナリオ
 */
contract ("MedicalData Contract tests!!", accounts => {
    // 初期登録用の医師のアドレス
    var _doctorAddrs = [
        "0xeF4375AafE7CF7aB1B724137785Fe2B8d27E75B9",
        "0x3121f3f8c5af88A4cA8439E7eF3070653864B3a7"
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
            const doctorAddress1 = await medicalData.doctors(0);
            const doctorAddress2 = await medicalData.doctors(1);
            // チェック
            assert.equal(doctorAddress1, _doctorAddrs[0], "doctor address should match");
            assert.equal(doctorAddress2, _doctorAddrs[1], "doctor address should match");
        });
        // 登録した医者の名前が想定のものと同じになっているか確認するシナリオ
        it ("confirm doctor's name", async () => {
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
     * 医者を新規で追加する際のテストシナリオ
     */
     describe ("add a new doctor", () => {
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
     });
});