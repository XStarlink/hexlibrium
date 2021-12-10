pragma solidity >=0.5.0 <0.9.0;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import './ERC721Full.sol';


contract Color is ERC721 {

    constructor() ERC721("Color", "COLOR") public{


    }
}

