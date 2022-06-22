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
        medicalData = await MedicalData.new(_doctorAddrs, _doctorNames, {
            from: accounts[0],
            gas: 5000000
        });
    });

    /**
     * 呼び出し元の確認
     */
    describe ("initialization", () => {
        it ("confirm owner address", async () => {
            const ownerAddress = await medicalData.owner();
            console.log("owner address:", ownerAddress);
            assert.equal(ownerAddress, owner, "owner address should match");
        });
        it ("confirm doctor's address", async () => {
            const doctorAddress1 = await medicalData.doctors(0);
            const doctorAddress2 = await medicalData.doctors(1);
            assert.equal(doctorAddress1, _doctorAddrs[0], "doctor address should match");
            assert.equal(doctorAddress2, _doctorAddrs[1], "doctor address should match");
        });
    });
});