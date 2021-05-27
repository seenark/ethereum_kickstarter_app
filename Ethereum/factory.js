import web3 from "./web3";
import compiledFactory from "./build/CampaignFactory.json";
const factoryInterface = compiledFactory.interface;
const factoryDeployedOnRinkebyAddress = "0x71d89d62286C428322Da2BB4abD41D3c020d0b90";
const factoryInstance = new web3.eth.Contract(JSON.parse(factoryInterface), factoryDeployedOnRinkebyAddress);

export default factoryInstance;
