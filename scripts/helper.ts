import * as fs from "fs";

export const readAddressList = function () {
  return JSON.parse(fs.readFileSync("address.json", "utf-8"));
};

export const storeAddressList = function (addressList: object) {
  fs.writeFileSync("address.json", JSON.stringify(addressList, null, "\t"));
};

export const getMyTokenAddress = function (network: string) {
  const addressList = readAddressList();
  return addressList[network].MyToken;
};

export const storeMyTokenAddress = function (network: string, address: string) {
  const addressList = readAddressList();
  addressList[network].MyToken = address;
  storeAddressList(addressList);
};
