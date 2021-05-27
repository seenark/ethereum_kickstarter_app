import web3 from "./web3";
import campaignCompiled from "./build/Campaign.json";

function createCampaignInstance(address) {
  const campaignInterface = JSON.parse(campaignCompiled.interface);
  const newInstance = new web3.eth.Contract(campaignInterface, address);
  return newInstance;
}

export default createCampaignInstance;
