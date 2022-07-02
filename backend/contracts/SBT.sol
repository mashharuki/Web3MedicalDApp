// SPDX-License-Identifier: CC0-1.0
pragma solidity >=0.8.0;

import "./interface/IERC4973.sol";
import "./ERC721Metadata.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/**
 * SBTコントラクト
 * IERC4973を継承する。
 */
contract SBT is IERC4973, ERC165, ERC721Metadata {
    // uint256型にSafeMathを適用する。
    using SafeMath for uint256;
    // カウンター用の型
    using Counters for Counters.Counter;
    // トークンID用の変数
    Counters.Counter _tokenId;
    // トークンIDと所有者の紐付けマップ
    mapping(uint256 => address) private _tokenOwner;
    // 所有者と保有しているSBTの数を保有するマップ
    mapping(address => Counters.Counter) private _OwnedTokensCount;

    // Mintしたときに発するイベント
    event Mint(address to, uint256 tokenId);

    /**
     * コンストラクター
     * @param _name トークン名
     * @param _symbol シンボル名
     */
    constructor(string memory _name, string memory _symbol)
        ERC721Metadata(_name, _symbol)
    {
        // インターフェースのフィンガープリントを登録する。
        supportsInterface(
            bytes4(
                keccak256("balanceOf(bytea4)") ^
                    keccak256("townerOf(bytes4)") ^
                    keccak256("burn(bytes4)")
            )
        );
    }

    /**
     * Mintメソッド
     * @param to 発行するアドレス
     */
    function mint(address to) external virtual {
        // トークンIDを取得する
        uint256 tokenId = _tokenId.current();
        // 発行する。
        _tokenOwner[tokenId] = to;
        // カウンターをそれぞれ増やす
        _OwnedTokensCount[to].increment();
        _tokenId.increment();
        // イベントの発行
        emit Attest(to, tokenId);
    }

    /**
     * totalSupplyメソッド
     */
    function totalSupply() external view returns (uint256) {
        return _tokenId.current();
    }

    /**
     * SBTの個数を取得するメソッド
     * @param owner ウォレットアドレス
     */
    function balanceOf(address owner) external view override returns (uint256) {
        // チェック
        require(owner != address(0), "owner query for non-exitst token");
        // 保有数を返却する。
        return _OwnedTokensCount[owner].current();
    }

    /**
     * トークンIDに紐づくアドレスを取得するメソッド
     * @param tokenId トークンID
     */
    function ownerOf(uint256 tokenId) external view override returns (address) {
        // IDに対応するowner addressを取得する。
        address owner = _tokenOwner[tokenId];
        require(owner != address(0), "owner query for non-exitst token");
        return owner;
    }

    /**
     * 指定したIDのトークンを償却するメソッド
     * @param tokenId トークンID
     */
    function burn(uint256 tokenId) external override {
        // トークンIDに紐づくアドレスを取得する
        address owner = _tokenOwner[tokenId];
        // 保有する数を減らす。
        _OwnedTokensCount[owner].decrement();
        // 対応するIDに紐づく情報を削除する。
        delete _tokenOwner[tokenId];

        // イベントの発行
        emit Revoke(msg.sender, tokenId);
    }
}
