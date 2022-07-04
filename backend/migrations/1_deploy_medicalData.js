/**
 * Medicalコントラクトをデプロイするためのスクリプトファイル
 */

// コントラクトの読み取り
const MedicalData  = artifacts.require("MedicalData");

module.exports = function (deployer, accounts) {
  // 初期登録用の医師のアドレス
  var _doctorAddrs = [
    "0x1431ea8af860C3862A919968C71f901aEdE1910E",
    "0xaD8F73F43869401591cac0e6f06F68cE7442EfF4"
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
