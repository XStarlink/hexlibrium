pragma solidity >=0.5.0 <0.9.0;

contract Adoption {

address[16] public adopters;
//i64[64]; public i2;

// Receiving the adopters
function getAdopters() public view returns(address[16] memory) {
  return adopters;
}

// Adopting a pet
function adopt(uint petId) public returns(uint) {
  require(petId >= 0 && petId <= 15);
  adopters[petId] = msg.sender;
  return petId;
}
}

  //+
  //-
  //*
  //%
  //i64[1] + i64[2] = i128[0];
  //i64[1] - i64[2] = i0[0];
  //i64[1] * i64[2] = i16.384[0];
  //i64[1] % i64[2] = i1[0];

  //1=a;

  