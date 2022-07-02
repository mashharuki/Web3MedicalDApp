/**
 * =================================================
 * SBTコントラクト用のテストスクリプトファイル
 * =================================================
 */

// モジュールのインポート
const truffleAssert = require("truffle-assertions");
// コントラクトの読み込み
const SBTContract = artifacts.require("SBT");

/**
 * テストシナリオ
 */
contract ("SBT Contract tests!!", accounts => {

      // コントラクト用の変数
      var SBT;
      // SBTのトークン名
      const SBTName = "Test";
      // SBTのシンボル名
      const SBTSymbol = "TST";
      // owner
      const owner = accounts[0];
      // owner2
      const owner2 = accounts[1];

      /**
       * テスト実行前の準備　
       */
      beforeEach (async () => {
            // Medicalコントラストのインスタンスを生成
            SBT = await SBTContract.new(SBTName, SBTSymbol, {
                  from: owner,
                  gas: 5000000
            });
      });

      /**
       * 初期化のためのテスト
       */
      describe ("initialization", () => {
            // トークンの名前を確認するテスト
            it ("confirm SBT Name", async () => {
                  // 名前を取得する。
                  const name = await SBT.name();
                  // チェック
                  assert.equal(SBTName, name, "SBT Name should match");
            });
            // トークンのシンボルを確認するテスト
            it ("confirm SBT Symbol", async () => {
                  // 名前を取得する。
                  const symbol = await SBT.symbol();
                  // チェック
                  assert.equal(SBTSymbol, symbol, "SBT Symbol should match");
            });
            // トークンの発行数を確認するテスト
            it ("check SBT TotalSupply", async () => {
                  // 発行総数を取得する。
                  const total = await SBT.totalSupply();
                  // チェック
                  assert.equal(0, total, "Totalsupply should match");
            });
      });

      /**
       * SBTを発行するためのテスト
       */
      describe ("Mint SBT !!", () => {
            // SBTを発行するテスト
            it ("mintSBT", async () => {
                  // mintメソッドを実行する。
                  await SBT.mint(owner);
                  // 保有数を取得する。
                  const balance = await SBT.balanceOf(owner);
                  // totalSupplyを取得する。
                  const total = await SBT.totalSupply();
                  // totalSupplyと保有数をチェックする。
                  assert.equal(1, total, "Totalsupply should match");
                  assert.equal(1, balance, "balance should match");
            });
            // SBTを10個発行するテスト
            it ("mintSBT * 10", async () => {
                  // SBTを10個発行する。
                  for(var i = 0; i < 10;i++) {
                        // mintメソッドを実行する。
                        await SBT.mint(owner);
                  }
                  // 保有数を取得する。
                  const balance = await SBT.balanceOf(owner);
                  // totalSupplyを取得する。
                  const total = await SBT.totalSupply();
                  // totalSupplyと保有数をチェックする。
                  assert.equal(10, total, "Totalsupply should match");
                  assert.equal(10, balance, "balance should match");
            });
            // SBTを20個発行するテスト
            it ("mintSBT * 10", async () => {
                  // SBTを10個発行する。
                  for(var i = 0; i < 10;i++) {
                        // mintメソッドを実行する。
                        await SBT.mint(owner);
                  }
                  // 2人目に10個発行する。
                  for(var i = 0; i < 10;i++) {
                        // mintメソッドを実行する。
                        await SBT.mint(owner2);
                  }
                  // 保有数を取得する。
                  const balance = await SBT.balanceOf(owner);
                  const balance2 = await SBT.balanceOf(owner2);
                  // totalSupplyを取得する。
                  const total = await SBT.totalSupply();
                  // totalSupplyと保有数をチェックする。
                  assert.equal(20, total, "Totalsupply should match");
                  assert.equal(10, balance, "balance should match");
                  assert.equal(10, balance2, "balance should match");
            });
      });

      /**
       * SBTを償却するためのテストシナリオ
       */
      describe ("burn SBT !!", () => {
            // SBTを償却するテスト
            it ("mintSBT", async () => {
                  // mintメソッドを実行する。
                  await SBT.mint(owner);
                  // 保有数を取得する。
                  const balance = await SBT.balanceOf(owner);
                  // totalSupplyを取得する。
                  const total = await SBT.totalSupply();
                  // totalSupplyと保有数をチェックする。
                  assert.equal(1, total, "Totalsupply should match");
                  assert.equal(1, balance, "balance should match");
                  // 償却する。
                  await SBT.burn(0);
                  // 保有数を取得する。
                  const burnedBalance = await SBT.balanceOf(owner);
                  // totalSupplyを取得する。
                  const burnedTotal = await SBT.totalSupply();
                  // totalSupplyと保有数をチェックする。
                  assert.equal(1, burnedTotal, "Totalsupply should match after SBT burned");
                  assert.equal(0, burnedBalance, "balance should match after SBT burned");
            });
      });
});