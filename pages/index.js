import factory from "../Ethereum/factory";
import { Button, Card, Grid } from "semantic-ui-react";
import Layout from "../components/Layout";
import Link from "next/link";

const buildCampaign = (items) => {
  console.log("items: ", items);
  return items.map((element) => {
    return (
      <Card
        key={element}
        fluid
        header={element}
        meta="...meta"
        description={
          <Link href={`/campaign/${element}`}>
            <a>View Campaign</a>
          </Link>
        }
      />
    );
  });
};

function App({ campaignList }) {
  return (
    <Layout>
      <Grid>
        <Grid.Row>
          {/* First column show list of campaigns */}
          <Grid.Column width="13">{buildCampaign(campaignList)}</Grid.Column>
          {/* second column show create button */}
          <Grid.Column width="3">
            <Link href="/campaign/new">
              <Button floated="right" inverted color="green" icon="add circle" content="Add" labelPosition="left" />
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

App.getInitialProps = async (context) => {
  const campaignList = await factory.methods.getDeployedCampaignList().call();
  console.log("campaign:", campaignList);
  return { campaignList: campaignList };
};

export default App;
