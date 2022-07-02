/**
 * SBTコントラクトをデプロイするためのスクリプトファイル
 */

// コントラクトの読み取り
const SBT = artifacts.require("SBT");

module.exports = function (deployer, accounts) {
  // トークン名とシンボル名を指定する。
  var tokenName = "MedicalData";
  var tokenSymbol = "MDT";

  // デプロイ
  deployer.deploy(SBT, tokenName, tokenSymbol, {
    gas: 5000000
  });
};
