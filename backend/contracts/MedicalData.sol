// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract MedicalData {
    // 医療機関に関する構造体の定義
    struct MedicalInsData {
        // 最終更新日時
        string lastUpdate;
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

    // 医者と患者に関するデータの構造体の定義
    struct DoctorInfo {
        // 医者のアドレス
        address doctorAddr;
        // 医者の名前
        string doctorName;
        // 要求状況
        bool isRequire;
        // 承認状況
        bool isApprove;
    }

    // コントラクトの管理者のアドレスを保有する変数
    address public owner;
    // 医療機関に所属する医者のアドレスを格納する配列
    address[] public doctors;
    // 治療費 (このアプリでは0.01ETHで固定とする。)
    uint256 public constant PRICE = 0.01 ether;
    // 患者のアドレスと医療データを紐付けるMap
    mapping(address => PatientMedicalData) public medicalMap;
    // 医者のアドレスと名前を紐づけるMap
    mapping(address => string) public doctorMap;
    // アドレスが医者であることを紐づけるMap
    mapping(address => bool) public doctorRoleMap;
    // 患者のデータに対して医者側が閲覧権限を所有しているか保持するためのMap
    mapping(address => mapping(address => bool)) public approveMap;
    // 患者のデータに対して医者側が閲覧権限を要求している状態を保持するためのMap
    mapping(address => mapping(address => bool)) public requireMap;

    // 呼び出し元が医者ではないことを確認する修飾子。
    modifier onlyPatient() {
        require(
            doctorRoleMap[msg.sender] == false,
            "msg.sendder must have patient role!!"
        );
        _;
    }

    // 呼び出し元が医者であることを確認する修飾子
    modifier onlyDoctor() {
        require(
            doctorRoleMap[msg.sender] == true,
            "msg.sendder must have doctor role!!"
        );
        _;
    }

    // 呼び出し元がownerであることを確認する修飾子
    modifier onlyOwner() {
        require(owner == msg.sender, "msg.sender must be owner's address !!");
        _;
    }

    // 患者からの承認を得ているかを確認する修飾子
    modifier isApproved(address patient) {
        require(
            approveMap[patient][msg.sender] == true,
            "you must be approved by patient!!"
        );
        _;
    }

    // 呼び出し元のウォレットアドレスの残高が0ではないことをチェックする修飾子
    modifier zeroAmount() {
        uint256 balance = address(msg.sender).balance;
        require(balance > PRICE, "No ether left to withdraw");
        _;
    }

    // 各種メソッドが呼び出された時に発するイベントの定義
    event Approved(address patient, address doctor);
    event ChangedStatus(address patient, address doctor);
    event RegistedDoctor(address doctorAddress, string doctorName);
    event ClaimedApprove(address doctor, address patient);
    event CreateMedicalData(
        address patientAddr,
        string patientName,
        string bloodType,
        string lastUpDate,
        string doctorName
    );
    event EditMedicalData(
        address patientAddr,
        string patientName,
        string bloodType,
        string lastUpDate,
        string doctorName
    );
    event DeleteMedicalData(address patientAddr);
    event Pay(address patientAddr, address doctorAddr);

    /**
     * コンストラクター
     * @param _doctorAddrs 初期で登録される医者のアドレスの配列
     * @param _doctorNames 初期で登録される医者の名前の配列
     */
    constructor(address[] memory _doctorAddrs, string[] memory _doctorNames) {
        // ownerのアドレスを登録する。
        owner = msg.sender;

        for (uint256 i = 0; i < _doctorAddrs.length; i++) {
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
     * @param patientAddr 患者のアドレス
     * @param patientName 患者の名前
     * @param bloodType 血液型
     * @param lastUpDate 最終更新日時
     * @param doctorName 医者(医療機関)の名前
     */
    function createMedicalData(
        address patientAddr,
        string memory patientName,
        string memory bloodType,
        string memory lastUpDate,
        string memory doctorName
    ) public onlyDoctor isApproved(patientAddr) {
        // 医療機関に関するStruct変数を生成
        MedicalInsData memory medicalInsData = MedicalInsData(
            lastUpDate,
            doctorName
        );
        // 患者の医療データに関するStruct変数を生成する。
        PatientMedicalData memory patientMedicalData = PatientMedicalData(
            patientName,
            bloodType,
            lastUpDate,
            medicalInsData
        );
        // 患者の医療データとアドレスを紐付けて登録する。
        medicalMap[patientAddr] = patientMedicalData;

        emit CreateMedicalData(
            patientAddr,
            patientName,
            bloodType,
            lastUpDate,
            doctorName
        );
    }

    /**
     * 医療データを編集するメソッド
     * @param patientAddr 患者のアドレス
     * @param patientName 患者の名前
     * @param bloodType 血液型
     * @param lastUpDate 最終更新日時
     * @param doctorName 医者(医療機関)の名前
     */
    function editMedicalData(
        address patientAddr,
        string memory patientName,
        string memory bloodType,
        string memory lastUpDate,
        string memory doctorName
    ) public onlyDoctor isApproved(patientAddr) {
        // 医療機関に関するStruct変数を生成
        MedicalInsData memory newMedicalInsData = MedicalInsData(
            lastUpDate,
            doctorName
        );
        // 患者の医療データに関するStruct変数を生成する。
        PatientMedicalData memory newPatientMedicalData = PatientMedicalData(
            patientName,
            bloodType,
            lastUpDate,
            newMedicalInsData
        );
        // 患者の医療データとアドレスを紐付けて新しい医療データとして登録する。(更新)
        medicalMap[patientAddr] = newPatientMedicalData;

        emit EditMedicalData(
            patientAddr,
            patientName,
            bloodType,
            lastUpDate,
            doctorName
        );
    }

    /**
     * 医療データを削除するメソッド
     * @param patient 患者のアドレス
     */
    function deleteMedicalData(address patient)
        public
        onlyDoctor
        isApproved(patient)
    {
        // 医療データを削除する。
        delete medicalMap[patient];
        // 全ての医師から承認権限を剥奪する。
        for (uint256 i = 0; i < doctors.length; i++) {
            approveMap[patient][doctors[i]] = false;
        }

        emit DeleteMedicalData(patient);
    }

    /**
     * 自分の医療データを取得するメソッド
     */
    function selectMedicalData()
        public
        view
        onlyPatient
        returns (PatientMedicalData memory)
    {
        // 呼び出し元のアドレスに紐づく医療データを返却する。
        return medicalMap[msg.sender];
    }

    /**
     * 患者の医療データを取得するメソッド
     * @param patient 患者のアドレス
     */
    function selectPatientMedicalData(address patient)
        public
        view
        onlyDoctor
        isApproved(patient)
        returns (PatientMedicalData memory)
    {
        // 患者のアドレスに紐づく医療データを取得する。
        return medicalMap[patient];
    }

    /**
     * 医者のデータを新たに登録するメソッド
     * @param doctorAddress 医者のアドレス
     * @param doctorName 医者の名前
     */
    function registDoctor(address doctorAddress, string memory doctorName)
        public
        onlyOwner
    {
        // アドレスを格納する。
        doctors.push(doctorAddress);
        // 医者のアドレスと名前を登録
        doctorMap[doctorAddress] = doctorName;
        // 医者のアドレスと権限を登録
        doctorRoleMap[doctorAddress] = true;

        emit RegistedDoctor(doctorAddress, doctorName);
    }

    /**
     * 現在登録中の医師のアドレス一覧を取得するためのメソッド
     */
    function getDoctors() public view returns (address[] memory) {
        return doctors;
    }

    /**
     * 患者に紐づく全て医師の情報を取得するメソッド
     */
    function getDoctorInfo() public view returns (DoctorInfo[] memory result) {
        // 配列の大きさを定義する。
        uint256 size = doctors.length;
        // 改めて配列を定義する。
        result = new DoctorInfo[](size);
        // 全ての医者に関する情報をDoctorInfo型の変数にして詰めていく。
        for (uint256 i = 0; i < size; i++) {
            // 医者の名前を取得する。
            string memory doctorName = doctorMap[doctors[i]];
            // 要求状況を取得する。
            bool isRequired = requireMap[doctors[i]][msg.sender];
            // 承認権限付与状況を確認する。
            bool approved = approveMap[msg.sender][doctors[i]];
            // DoctorInfo型の変数を生成して配列に詰める。
            DoctorInfo memory res = DoctorInfo(
                doctors[i],
                doctorName,
                isRequired,
                approved
            );
            result[i] = res;
        }

        return result;
    }

    /**
     * 治療費を支払うためのメソッド
     * @param doctorAddress 医者のアドレス
     */
    function pay(address doctorAddress) public payable onlyPatient zeroAmount {
        // send 0.01 ETH to doctorAddress
        (bool success, ) = payable(doctorAddress).call{value: PRICE}("");
        require(success, "Payment failed.");
        // イベントの発行
        emit Pay(msg.sender, doctorAddress);
    }
}
