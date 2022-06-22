// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract MedicalData {

  // 医療機関に関する構造体の定義
  struct MedicalInsData {
    // 最終更新日時
    uint256 lastUpdate;
    // 最終更新医療機関(の先生)
    string doctorName;
  }

  // 患者の医療データの構造体の定義
  struct MedicalData {
    // 患者名
    string patientName;
    // 血液型
    string bloodType;
    // 最終更新日時
    string lastUpdate;
    //  MedicalInsData型のデータ
    MedicalInsData medicalInsData;
  }

  // コントラクトの管理者のアドレスを保有する変数
  address public owner;
  // 患者のアドレスと医療データを紐付けるMap
  mapping (address => MedicalData) medicalMap;
  // 医者のアドレスと名前を紐づけるMap
  mapping (address => string) doctorMap;
  // アドレスが医者であることを紐づけるMap
  mapping (address => bool) doctorRoleMap;
  // 医療機関に所属する医者のアドレスを格納する配列
  address[] doctors;
  // 患者のデータに対して医者側が閲覧権限を所有しているか保持するためのMap
  mapping (address => mapping (address => bool)) approveMap;
  // 患者のデータに対して医者側が閲覧権限を要求している状態を保持するためのMap
  mapping (address => mapping (address => bool)) requireMap;

  /**
   * コンストラクター
   * _doctorAddrs 初期で登録される医者のアドレスの配列
   * _doctorNames 初期で登録される医者の名前の配列
   */
  constructor(address[] memory _doctorAddrs, string[] memory _doctorNames) public {
    // ownerのアドレスを登録する。
    owner = msg.sender;

    for(uint i = 0; i < _doctorAddrs.length; i++) {
      // アドレスを格納する。
      doctors[i] = _doctorAddrs[i];
      // 医者のアドレスと名前を登録
      doctorMap[_doctorAddrs[i]] = _doctorNames[i];
      // 医者のアドレスと権限を登録
      doctorRoleMap[_doctorAddrs[i]] = true;
    }
  }

  /**
   * 医者側に閲覧・編集権限を付与するメソッド
   */
  function approve() public {

  }

  /**
   * 閲覧・編集権限を停止するメソッド
   */
  function changeStatus() public {

  }

  /**
   * 医療データを新規で登録するメソッド
   */
  function createMedicalData() public {
    // 医者であることの確認する。
  }

  /**
   * 医療データを編集するメソッド
   */
  function editMedicalData() public {
    // 医者であることを確認と患者から承認されているかを確認する。
  }

  /**
   * 医療データを削除するメソッド
   */
  function deleteMedicalData() public {
    // 医者であることを確認と患者から承認されているかを確認する。
  }

  /**
   * 自分の医療データを取得するメソッド
   */
  function selectMedicalData() public {
    
  }

  /**
   * 患者の医療データを取得するメソッド
   */
  function selectPatientMedicalData() public {
    
  }

  /**
   * 医者のデータを新たに登録するメソッド
   * doctorAddress 医者のアドレス
   * doctorName 医者の名前
   */
  function registDoctor(address doctorAddress, string memory doctorName) public {
    // メソッドの呼び出し元がownerであることを確認する。
    require(owner == msg.sender, "msg.sender must be owner's address !!");
    // アドレスを格納する。
    doctors.push(doctorAddress);
    // 医者のアドレスと名前を登録
    doctorMap[doctorAddress] = doctorName;
    // 医者のアドレスと権限を登録
    doctorRoleMap[doctorAddress] = true;
  }
}
