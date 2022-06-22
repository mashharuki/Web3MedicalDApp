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
  struct PatientMedicalData {
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
  // 医療機関に所属する医者のアドレスを格納する配列
  address[] public doctors;
  // 患者のアドレスと医療データを紐付けるMap
  mapping (address => PatientMedicalData) public medicalMap;
  // 医者のアドレスと名前を紐づけるMap
  mapping (address => string) public doctorMap;
  // アドレスが医者であることを紐づけるMap
  mapping (address => bool) public doctorRoleMap;
  // 患者のデータに対して医者側が閲覧権限を所有しているか保持するためのMap
  mapping (address => mapping (address => bool)) public approveMap;
  // 患者のデータに対して医者側が閲覧権限を要求している状態を保持するためのMap
  mapping (address => mapping (address => bool)) public requireMap;

  // 呼び出し元が医者ではないことを確認する修飾子。
  modifier onlyPatient() {
    require(doctorRoleMap[msg.sender] == false, "msg.sendder must have patient role!!");
    _;
  }

  // 呼び出し元が医者であることを確認する修飾子
  modifier onlyDoctor() {
    require(doctorRoleMap[msg.sender] == true, "msg.sendder must have doctor role!!");
    _;
  }

  // 各種メソッドが呼び出された時に発するイベントの定義
  event Approved(address patient, address doctor);
  event ChangedStatus(address patient, address doctor);
  event RegistedDoctor(address doctorAddress, string doctorName);
  event ClaimedApprove(address doctor, address patient);

  /**
   * コンストラクター
   * @param _doctorAddrs 初期で登録される医者のアドレスの配列
   * @param _doctorNames 初期で登録される医者の名前の配列
   */
  constructor(address[] memory _doctorAddrs, string[] memory _doctorNames) public {
    // ownerのアドレスを登録する。
    owner = msg.sender;

    for(uint i = 0; i < _doctorAddrs.length; i++) {
      // アドレスを格納する。
      doctors.push(_doctorAddrs[i]);
      // 医者のアドレスと名前を登録
      doctorMap[_doctorAddrs[i]] = _doctorNames[i];
      // 医者のアドレスと権限を登録
      doctorRoleMap[_doctorAddrs[i]] = true;
    }
  }

  /**
   * 医者側に閲覧・編集権限を付与するメソッド
   * @param doctor 権限を付与する医者のアドレス
   */
  function approve(address doctor) public onlyPatient {
    // 権限を付与する。
    approveMap[msg.sender][doctor] = true;
    // 権限付与を要求するマップをfalseにする。
    requireMap[doctor][msg.sender] = false;

    emit Approved(msg.sender, doctor);
  }

  /**
   * 閲覧・編集権限を停止するメソッド
   * @param doctor 権限を剥奪する医者のアドレス
   */
  function changeStatus(address doctor) public onlyPatient {
    // 権限を剥奪する。
    approveMap[msg.sender][doctor] = false;

    emit ChangedStatus(msg.sender, doctor);
  }

  /**
   * 患者に対して医師が閲覧権限を要求できるメソッド
   * @param patient 閲覧権限を要求する患者のアドレス
   */
  function claimApprove(address patient) public onlyDoctor {
    // 要求していることを登録する。
    requireMap[msg.sender][patient] = true;

    emit ClaimedApprove(msg.sender, patient);
  }

  /**
   * 医療データを新規で登録するメソッド
   */
  function createMedicalData() public onlyDoctor {

  }

  /**
   * 医療データを編集するメソッド
   */
  function editMedicalData() public onlyDoctor {
    // 患者から承認されているかを確認する。
  }

  /**
   * 医療データを削除するメソッド
   */
  function deleteMedicalData() public onlyDoctor {
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
   * @param doctorAddress 医者のアドレス
   * @param doctorName 医者の名前
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

    emit RegistedDoctor(doctorAddress, doctorName);
  }
}
