# 概要設計書

本アプリケーションの概要設計書です。  
画面設計は<a href="./page.md">こちら</a>

## 想定フロー図

[![](https://mermaid.ink/img/pako:eNqlVV9L21Ac_Srlvs59gTwIQre3scFe83JJfmog_3Z7YxEp2Ny1W10HYzhH6eYsK1of5mwVBFvph7kkTZ_8Ct40dY1tWlOXp5Cc8zvnl3O42UGKpQKSUA7eOWAqkNXwBsGGbGbE9TpvAnm-uvrsFaiagvUspljKcPaBs--c_eFu87ZX9j7-9OqHg1p3WO1M0V4Sy6Rrti1lvGo32C3x4lnQv_H2jiI0d78Gx0W_7Ua0e_SMIIENLUezlkItwlmDuzecMc4q3tmvoFGNj1BHmIfSvvs7khYeBjV35L7H3b5Qj5ueq64QwBRijxZbsDHVwKQz609Jp1o8BzooNLV0DPiofH_f-3zJizXufuK7CT7GayRyG61B83qKG1s7CmGWKRJoVvz65b_toxHzkxsedILjE1GxwVVrWC_7rdNh7csUO9H8w_x0rBniBbG24AnRRao-K3lHbbGC8O8fnKcNEKeRXbK0SzTnTbTQ_xdokZ3UTVo0JKlSk-8yGdEJmUGnGyax_9evfOPF9_MakRinjbc5-xGqsgtB9Pd6IevREo1oy4aY1-imSnD-KYITbrIqWkEGEANrqji8d8JhMqKbYICMJHGrwjp2dCoj2SwIqGOr4gx7oWrCI5LWsZ6DFYQdar3dNhUkUeLAPWj8AxijCnen9flc)](https://mermaid.live/edit#pako:eNqlVV9L21Ac_Srlvs59gTwIQre3scFe83JJfmog_3Z7YxEp2Ny1W10HYzhH6eYsK1of5mwVBFvph7kkTZ_8Ct40dY1tWlOXp5Cc8zvnl3O42UGKpQKSUA7eOWAqkNXwBsGGbGbE9TpvAnm-uvrsFaiagvUspljKcPaBs--c_eFu87ZX9j7-9OqHg1p3WO1M0V4Sy6Rrti1lvGo32C3x4lnQv_H2jiI0d78Gx0W_7Ua0e_SMIIENLUezlkItwlmDuzecMc4q3tmvoFGNj1BHmIfSvvs7khYeBjV35L7H3b5Qj5ueq64QwBRijxZbsDHVwKQz609Jp1o8BzooNLV0DPiofH_f-3zJizXufuK7CT7GayRyG61B83qKG1s7CmGWKRJoVvz65b_toxHzkxsedILjE1GxwVVrWC_7rdNh7csUO9H8w_x0rBniBbG24AnRRao-K3lHbbGC8O8fnKcNEKeRXbK0SzTnTbTQ_xdokZ3UTVo0JKlSk-8yGdEJmUGnGyax_9evfOPF9_MakRinjbc5-xGqsgtB9Pd6IevREo1oy4aY1-imSnD-KYITbrIqWkEGEANrqji8d8JhMqKbYICMJHGrwjp2dCoj2SwIqGOr4gx7oWrCI5LWsZ6DFYQdar3dNhUkUeLAPWj8AxijCnen9flc)

```
sequenceDiagram
    Owner->>+MedicalData: デプロイ＆初回登録
    Owner->>+FrontApp: 医者の追加登録を要求
    FrontApp->>+MedicalData: registDoctorメソッド実行要求
    doctor->>+FrontApp: 患者の医療データを登録
    FrontApp->>+MedicalData: createMedicalDataメソッド実行要求
    patient->>+FrontApp: 医療データを要求
    FrontApp->>+MedicalData: selectMedicalDataメソッド実行要求
    MedicalData->>+FrontApp: 医療データを返却する。
    FrontApp->>+patient: 医療データを表示する。
    patient->>+doctor: 医療データの変更を要求する
    doctor->>+FrontApp: 閲覧＆編集権限を要求する。
    FrontApp->>+MedicalData: claimApproveメソッド実行要求
    patient->>+FrontApp: 権限情報の更新を要求
    FrontApp->>+MedicalData: approveメソッド実行要求
    doctor->>+FrontApp: 患者の医療データを要求
    FrontApp->>+MedicalData: selectPatientMedicalDataメソッド実行要求
    MedicalData->>+FrontApp: 患者の医療データを返却する。
    FrontApp->>+patient: 患者の医療データを表示する。
    doctor->>+patient: 治療費の支払いを要求する。
    patient->>+FrontApp: payボタンを押す。
    FrontApp->>+MedicalData: payメソッド実行要求
    doctor->>+FrontApp: withdrawボタンを押す。
    FrontApp->>+MedicalData: withdrawメソッド実行要求
```

## 機能一覧表

| 機能名                 | 説明                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| Connect Wallet 機能    | 患者と医療従事者の両方が、自分のウォレットをアプリケーションに接続できる                                 |
| 医療データ閲覧機能     | 患者は、アプリケーションのダッシュボードで、自分の秘密鍵を使って、自分の医療データを閲覧することができる |
| 医療データ新規登録機能 | 患者のデータを医者が新規に追加する                                                                       |
| アクセス許可提供機能   | 医療提供者に自分の医療データへのアクセスを提供する機能                                                   |
| 編集権限承認要求機能   | 患者の医療データを編集する際、患者に承認を求める機能                                                     |
| 医療データ編集機能     | 医療従事者はその患者の医療データを編集する機能                                                           |
| 閲覧権限変更機能       | 医療データへのアクセス権限を一度承認した医療提供者から再度制限できる機能                                 |
| 医師情報登録機能       | 医者の情報を新たに登録できる機能                                                                         |
| 医師情報確認機能       | 医者又は患者が医師の情報を確認できる機能                                                                 |
| 治療費支払い機能       | 患者が医者に治療費を支払う機能                                                                           |
| 治療費受け取り機能     | 医者が治療費を受け取る機能                                                                               |

## 変数一覧

| 変数名           | タイプ                          | 内容                                                                       |
| ---------------- | ------------------------------- | -------------------------------------------------------------------------- |
| owner            | address                         | コントラクトの管理者                                                       |
| patientName      | String                          | 患者の名前                                                                 |
| bloodYype        | String                          | 血液型                                                                     |
| lastUpdate       | String                          | 最終更新日時(yyyy/mm/dd HH:mm:ss 形式)                                     |
| MedicalInsDatas  | Struct                          | 最終更新日時、最終更新医療機関                                             |
| medicalData      | Struct                          | 患者の医療データ用の Struct 型の変数                                       |
| doctorInfo       | Struct                          | 患者が持つ医者についてのデータを保管する Struct 型の変数                   |
| medicalMap       | (address ⇨ medicalData)         | 患者のアドレスと医療データを紐付ける Map                                   |
| doctorMap        | (address → String)              | 医者のアドレスと名前を紐づける Map                                         |
| doctorRoleMap    | (address → bool)                | アドレスが医者であることを紐づける Map                                     |
| doctorBalanceMap | (address → uint256)             | 医者のアドレスと受け取る治療費を紐づける Map                               |
| doctors          | [address]                       | 医療機関に所属する医者のアドレスを格納する                                 |
| approveMap       | (address ⇨ (address ⇨ boolean)) | 患者のデータに対して医者側が閲覧権限を所有しているか保持するための Map     |
| requireMap       | (address ⇨ (address ⇨ boolean)) | 患者のデータに対して医者側が閲覧権限を要求している状態を保持するための Map |

## メソッド一覧

| メソッド名               | 内容                                               |
| ------------------------ | -------------------------------------------------- |
| approve                  | 医者側に閲覧・編集権限を付与するメソッド           |
| changeStatus             | 閲覧・編集権限を停止するメソッド                   |
| createMedicalData        | 医療データを新規で登録するメソッド                 |
| editMedicalData          | 医療データを編集するメソッド                       |
| deleteMedicalData        | 医療データを削除するメソッド                       |
| selectMedicalData        | 自分の医療データを取得するメソッド                 |
| selectPatientMedicalData | 患者の医療データを取得するメソッド                 |
| registDoctor             | 医師のデータを新たに登録するメソッド               |
| claimApprove             | 患者に対して医師が閲覧権限を要求できるメソッド     |
| getDoctors               | 現在登録中の全ての医師のアドレスを取得するメソッド |
| getDoctorInfo            | 患者に紐づく全て医師の情報を取得するメソッド       |
| pay                      | 患者が医者に治療費を支払うためのメソッド           |
| withdraw                 | 医者が治療費を受け取るためのメソッド               |
