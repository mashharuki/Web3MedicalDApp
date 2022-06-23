/**
 * Medicalコントラクトをデプロイするためのスクリプトファイル
 */

// コントラクトの読み取り
const MedicalData  = artifacts.require("MedicalData");

module.exports = function (deployer, accounts) {
  // 初期登録用の医師のアドレス
  var _doctorAddrs = [
    accounts[0],
    accounts[1]
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
