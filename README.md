# Web3MedicalDApp

ブロックチェーンを活用した Web ３アプリケーション用のリポジトリです。

## 挑戦する STAR 試験

<a href="https://unchain-shiftbase.notion.site/2-Distributed-medical-database-Japanese-18540901b8114aa787e7ec3aa30d5602">概要はこちら</a>

## 設計書

1.  <a href="./docs/design.md">概要設計書</a>
2.  <a href="./docs/page.md">画面設計書</a>

## テスト結果

スマートコントラクトのテスト結果は、<a href="./docs/testResult.md">こちら</a>

## マイグレーションの結果

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

goreli ネットワークにデプロイした結果

```cmd
Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'goreli'
> Network id:      5
> Block gas limit: 29970705 (0x1c95111)


1_deploy_medicalData.js
=======================

   Deploying 'MedicalData'
   -----------------------
   > transaction hash:    0x90cf05a516c99d6aee1a9fa812cc065e3bdee7e703ce5108c7e5602c6138fe53
   > Blocks: 1            Seconds: 9
   > contract address:    0xD41E1A91876c237521522DbD5ef2985e6afE1AD9
   > block number:        7126434
   > block timestamp:     1656310962
   > account:             0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
   > balance:             73.8605369695272885
   > gas used:            3085531 (0x2f14db)
   > gas price:           1.299999998 gwei
   > value sent:          0 ETH
   > total cost:          0.004011190293828938 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 7126435)
   > confirmation number: 2 (block: 7126436)
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.004011190293828938 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.004011190293828938 ETH
```

それ以外のマイグレーションの記録は<a href="./docs/deploy.md">こちら</a>

## クリアすべき課題

1. Ethereum,Polygon,Solana のいずれかのネットワークにデプロイすること。
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

## 各画面のイメージ

### 1. Connect Wallet 画面

ウォレットで接続する前の画面  
右上のボタンから接続する。

<img src="./docs/assets/connectWallet.png">

### 2. Home 画面

この画面は接続したウォレットのアドレスによって描画される内容が変化します。

| No. | パターン                                                                                     | 描画される内容                                         |
| --- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | 患者で医療データが未登録の場合                                                               | メッセージが描画されるだけ                             |
| 2   | 患者で医療データが登録されている場合                                                         | 医療データが描画される                                 |
| 3   | 医者の場合                                                                                   | 初期状態では検索画面が描画される。                     |
| 4   | 医者の場合で検索したアドレスから承認権限が付与されていなかった場合                           | 承認権限を要求するボタンを描画する。                   |
| 5   | 医者の場合で検索したアドレスから承認権限が付与されて且つ医療データが登録されていなかった場合 | 医療データ入力フォームと新規登録ボタンを描画する。     |
| 6   | 医者の場合で検索したアドレスから承認権限が付与されて且つ医療データが登録されていた場合       | 医療データ入力フォームと更新・削除ボタンをを描画する。 |

#### Home 画面 パターン 1

<img src="./docs/assets/nodata.png">

#### Home 画面 パターン 2

<img src="./docs/assets/medicaldata.png">

#### Home 画面 パターン 3

<img src="./docs/assets/view2.png">

#### Home 画面 パターン 4

<img src="./docs/assets/notapproved.png">

#### Home 画面 パターン 5

<img src="./docs/assets/create.png">

#### Home 画面 パターン 6

<img src="./docs/assets/update.png">

### 3. Regist 画面

この画面は管理者権限専用の画面で新規に医者を登録することができる画面になります。  
管理者以外がアクセスすると入力フォーム等は描画されません。

#### Regist 画面 管理者の場合

<img src="./docs/assets/owner.png">

#### Regist 画面 管理者以外の場合

<img src="./docs/assets/noowner.png">

### 4. DoctorInfo 画面

この画面も患者と医者で画面表記が変化します。  
医者の場合は自分のアドレスと名前が表示されます。  
患者の場合は、このコントラクトに登録されている医者の情報と承認権限を付与するボタン・剥奪するボタンが描画されます。(医者から承認権限を要求されている場合にはその旨のメッセージも表示されます。)

#### DoctorInfo 画面 医者の場合

<img src="./docs/assets/doctorInfoforDoc.png">

#### DoctorInfo 画面 患者の場合

<img src="./docs/assets/doctorInfoRequire.png">
