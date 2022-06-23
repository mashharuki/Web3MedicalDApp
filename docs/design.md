# 概要設計書

本アプリケーションの概要設計書です。  
画面設計は<a href="./page.md">こちら</a>

## ポンチ絵(イメージ図)
<img src="./assets/アプリイメージ.png">

## 想定フロー図

 ```
 sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
 ```

## 機能一覧表

|機能名|説明|
|----|----|
|Connect Wallet機能|患者と医療従事者の両方が、自分のウォレットをアプリケーションに接続できる|
|医療データ閲覧機能|患者は、アプリケーションのダッシュボードで、自分の秘密鍵を使って、自分の医療データを閲覧することができる|
|医療データ新規登録機能|患者のデータを医者が新規に追加する|
|アクセス許可提供機能|医療提供者に自分の医療データへのアクセスを提供する機能|
|編集権限承認要求機能|患者の医療データを編集する際、患者に承認を求める機能|
|医療データ編集機能|医療従事者はその患者の医療データを編集する機能|
|閲覧権限変更機能|医療データへのアクセス権限を一度承認した医療提供者から再度制限できる機能|
|医師情報登録機能|医者の情報を新たに登録できる機能|

## 変数一覧

|変数名|タイプ|内容|
|---|---|---|
|owner|address|コントラクトの管理者|
|patientName|String|患者の名前|
|bloodYype|String|血液型|
|lastUpdate|String|最終更新日時(yyyy/mm/dd HH:mm:ss形式)|
|MedicalInsDatas|Struct|最終更新日時、最終更新医療機関|
|medicalData|Struct|患者の医療データ用のStruct型の変数|
|medicalMap|(address ⇨ medicalData)|患者のアドレスと医療データを紐付けるMap|
|doctorMap|(address → String)|医者のアドレスと名前を紐づけるMap|
|doctorRoleMap|(address → bool)|アドレスが医者であることを紐づけるMap|
|doctors|[address]|医療機関に所属する医者のアドレスを格納する|
|approveMap|(address ⇨ (address ⇨ boolean))|患者のデータに対して医者側が閲覧権限を所有しているか保持するためのMap|
|requireMap|(address ⇨ (address ⇨ boolean))|患者のデータに対して医者側が閲覧権限を要求している状態を保持するためのMap|

## メソッド一覧

|メソッド名|内容|
|---|---|
|approve|医者側に閲覧・編集権限を付与するメソッド|
|changeStatus|閲覧・編集権限を停止するメソッド|
|createMedicalData|医療データを新規で登録するメソッド|
|editMedicalData|医療データを編集するメソッド|
|deleteMedicalData|医療データを削除するメソッド|
|selectMedicalData|自分の医療データを取得するメソッド|
|selectPatientMedicalData|患者の医療データを取得するメソッド|
|registDoctor|医師のデータを新たに登録するメソッド|
|claimApprove|患者に対して医師が閲覧権限を要求できるメソッド|