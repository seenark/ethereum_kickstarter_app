const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const factoryCompiled = require("./build/CampaignFactory.json");

const mnenomicPhrase = "reject draw comfort exit large where pole expire meadow scissors mushroom soldier";
const infuraLink = "https://rinkeby.infura.io/v3/d2661f1d9ad14a30aea397d1393ff0d0";
const provider = new HDWalletProvider({
  mnemonic: mnenomicPhrase,
  providerOrUrl: infuraLink,
});

const web3 = new Web3(provider);
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account: ", accounts[0]);
  const ABI = JSON.parse(factoryCompiled.interface);
  const contract = new web3.eth.Contract(ABI);
  const result = await contract.deploy({ data: factoryCompiled.bytecode }).send({ from: accounts[0], gas: "1000000" });
  console.log("Contract deployed to: ", result.options.address);
};

deploy();
