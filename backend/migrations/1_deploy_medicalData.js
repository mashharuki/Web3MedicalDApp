/**
 * Medicalコントラクトをデプロイするためのスクリプトファイル
 */

// コントラクトの読み取り
const MedicalData  = artifacts.require("MedicalData");

module.exports = function (deployer, accounts) {
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
  // デプロイ
  deployer.deploy(MedicalData, _doctorAddrs, _doctorNames, {
    gas: 5000000
  });
};
