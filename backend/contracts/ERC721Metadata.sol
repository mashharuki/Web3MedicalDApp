// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/**
 * ERC721Metadataコントラクト
 */
contract ERC721Metadata is ERC165 {
    string private _name;
    string private _symbol;

    /**
     * コンストラクター
     */
    constructor(string memory named, string memory symbolified) {
        supportsInterface(
            bytes4(keccak256("name(bytes4)") ^ keccak256("symbol(bytes4)"))
        );

        _name = named;
        _symbol = symbolified;
    }

    /**
     * トークン名を取得するメソッド
     */
    function name() external view returns (string memory) {
        return _name;
    }

    /**
     * シンボル名を取得するメソッド
     */
    function symbol() external view returns (string memory) {
        return _symbol;
    }
}
