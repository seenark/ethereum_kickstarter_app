import { Button, Card, Grid } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import CreateCampaignInstance from "../../../Ethereum/campaign";
import web3 from "../../../Ethereum/web3";
import ContributeForm from "../../../components/ContributeForm";
import Link from "next/link";

function ShowCampaign(props) {
  const renderCard = () => {
    const items = [
      {
        header: props.manager,
        meta: "Manager Address",
        description: "The manager created this campaign and can create requests to withdraw money.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: props.minimumContribution,
        meta: "Minimum Contribution (wei)",
        description: "You must contribute at least this much wei to become an approver.",
      },
      {
        header: props.requestCount,
        meta: "Numbers of Request",
        description: "A request try to withdraw money from the contract. Request must be approve by approvers.",
      },
      {
        header: props.approversCount,
        meta: "Numbers of Approvers",
        description: "Numbers of people who have already donated to this campaign.",
      },
      {
        header: web3.utils.fromWei(props.balance, "ether"),
        meta: "Contract balance (ether)",
        description: "The balance is how much money this campaign has left to spend.",
      },
    ];

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h2>Show Campaign</h2>
      <Grid>
        <Grid.Row>
          <Grid.Column width="10">{renderCard()}</Grid.Column>
          <Grid.Column width="6">
            <ContributeForm address={props.campaignAddress} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaign/${props.campaignAddress}/requests`}>
              <Button color="yellow">Request</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

ShowCampaign.getInitialProps = async (context) => {
  const queryParam = context.query;
  const campaignAddress = queryParam.campaignAddress;
  // create CampaignInstance by sending contract address
  const campaignInstance = CreateCampaignInstance(campaignAddress);
  const summary = await campaignInstance.methods.getSummary().call();

  return {
    campaignAddress: campaignAddress,
    balance: summary[0],
    minimumContribution: summary[1],
    requestCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
  };
};
export default ShowCampaign;
