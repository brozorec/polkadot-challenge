import { Abi, ContractPromise } from "@polkadot/api-contract";
import contractMetadata from "./config/erc20-metadata.json";

const abi = new Abi(contractMetadata);
const addr = '5GqqW8HhsZSFuxXFYHTkANf29Ln1rZbxXk3MvtrRbhmYi7Po';


export default function ContractERC20(api) {
  return new ContractPromise(api, abi, addr);
}
