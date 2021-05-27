const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../Ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../Ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  const factoryContract = await new web3.eth.Contract(JSON.parse(compiledFactory.interface));

  factory = await factoryContract
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  const campaignAddressList = await factory.methods.getDeployedCampaignList().call();
  campaignAddress = campaignAddressList[0];
  // create new Campaign Contract instance from existing address
  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe("Campaigns", () => {
  it("deploy Contract Factory and Campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("mark caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(accounts[0], manager);
  });

  it("allow people to contribute money and mark them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });
    const isContributor = await campaign.methods.approverList(accounts[1]);
    assert(isContributor);
  });

  it("require the minimum contribute", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "5",
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allow manager to make a payment request", async () => {
    await campaign.methods.createRequest("Buy plastic cases", "100", accounts[1]).send({
      from: accounts[0],
      gas: "1000000",
    });
    const request = await campaign.methods.requestList(0).call();
    assert("Buy plastic cases", request.description);
  });

  it("allow manager to make a finalize request", async () => {
    let account1_balance_before = await web3.eth.getBalance(accounts[1]);
    account1_balance_before = web3.utils.fromWei(account1_balance_before, "ether");
    account1_balance_before = Number.parseFloat(account1_balance_before);

    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });
    await campaign.methods.createRequest("Buy plastic cases", web3.utils.toWei("5", "ether"), accounts[1]).send({
      from: accounts[0],
      gas: "1000000",
    });
    await campaign.methods.approvalRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let account1_balance_2 = await web3.eth.getBalance(accounts[1]);
    account1_balance_2 = web3.utils.fromWei(account1_balance_2, "ether");
    account1_balance_2 = Number.parseFloat(account1_balance_2);

    console.log("before", account1_balance_before);
    console.log("after", account1_balance_2);
    assert(account1_balance_2 > account1_balance_before);
  });
});
