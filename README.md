# Web3MedicalDApp
ブロックチェーンを活用したWeb３アプリケーション用のリポジトリです。

## 挑戦するSTAR試験
 <a href="https://unchain-shiftbase.notion.site/2-Distributed-medical-database-Japanese-18540901b8114aa787e7ec3aa30d5602">概要はこちら</a>

### 設計書
 1. <a href="./docs/design.md">概要設計書</a>
 2. <a href="./docs/page.md">画面設計書</a>

### テスト結果

スマートコントラクトのテスト結果は、<a href="./docs/testResult.md">こちら</a>

### マイグレーションの結果

ローカルでマイグレーションした時の結果

```cmd
Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'development'
> Network id:      5778
> Block gas limit: 6721975 (0x6691b7)


1_deploy_medicalData.js
=======================

   Deploying 'MedicalData'
   -----------------------
   > transaction hash:    0xa2840106c5efab01e8ffedfd5f68239d59753f40d4be75a9c0ebd769d5209efb
   > Blocks: 0            Seconds: 0
   > contract address:    0x2cBd11686a3877c634910d8eEaB539d52c1daB38
   > block number:        814
   > block timestamp:     1655965417
   > account:             0x69273f3CF93e244Cd58449Df5aa8a1eC7b52A019
   > balance:             83.78739006
   > gas used:            2590937 (0x2788d9)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.05181874 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:          0.05181874 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.05181874 ETH
```

### クリアすべき課題

1. Ethereum,Polygon,Solanaのいずれかのネットワークにデプロイすること。
2. 患者と医療従事者の両方が、自分のウォレットをアプリケーションに接続できる
3. 患者は、アプリケーションのダッシュボードで、自分の秘密鍵を使って、自分の医療データを閲覧することができる
4. 患者は自分の医療データを編集することはできない
5. 患者は、医療提供者に自分の医療データへのアクセスを提供することができる
6. 医療従事者は患者の医療データを編集する際、患者に承認を求める必要がある
7. 患者が承認すると、医療従事者はその患者の医療データを編集することができる
8. 医療データのフォーマットは以下の通り:
    - 患者名
    - 患者様の血液型
    - 最終更新日時
    - 最終更新日時、最終更新医療機関
9. 患者は自身の医療データへのアクセス権限を一度承認した医療提供者から再度制限できる(患者の医療提供者が変更になった場合等に備えて)

### 開発用のアドレス

```cmd
Accounts:
(0) 0x70987afd66e39048c418d80bbe35be76658f466f
(1) 0xf3b1722f0a83d4c9c32fd8c786aaedf0169c6b4f
(2) 0x40f9dd1894f353cd6a5cc48b4d848c90657e7f1a
(3) 0x9a9122c7f57fca0a5ad82a931b742dca4751b2b6
(4) 0x81f32e72d72e1c754d5ce8157241989f4a7b595b
(5) 0xaee844d6e496c1f17ed265b5311be2f116fcabd3
(6) 0xbf1f0a1a4159c632149d09e19f83d4f8b9260c3c
(7) 0x6cb527d3c940f0189b0635d4eaff6547fccb9ba0
(8) 0x32ce44da56ade22d062a2c73e67abbddc9bb4326
(9) 0x88508c0ebf47c5d35e86be7b8eebded98d97833d
```