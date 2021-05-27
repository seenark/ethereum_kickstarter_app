import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Grid, GridColumn, Table } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import RequestRow from "../../../../components/RequestRow";
import CreateCampaignInstace from "../../../../Ethereum/campaign";

function Requests(props) {
  const router = useRouter();
  const campaignAddress = router.query.campaignAddress;

  const renderRequestRow = () => {
    const { address, approversCount, requestList, requestCount } = props;

    return requestList.map((request, index) => {
      return <RequestRow key={index} id={index} request={request} approversCount={approversCount} address={address} />;
    });
  };

  return (
    <Layout>
      <Grid>
        <Grid.Row>
          <Grid.Column width="12">
            <h1>RequestList</h1>
          </Grid.Column>
          <GridColumn width="4">
            <Link href={`/campaign/${campaignAddress}/requests/new`}>
              <Button floated="right" primary>
                Create Request
              </Button>
            </Link>
          </GridColumn>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Table celled unstackable selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Amount</Table.HeaderCell>
                  <Table.HeaderCell>Recipient</Table.HeaderCell>
                  <Table.HeaderCell>Approval Count</Table.HeaderCell>
                  <Table.HeaderCell>Approve</Table.HeaderCell>
                  <Table.HeaderCell>Finalize</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{renderRequestRow()}</Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

Requests.getInitialProps = async (context) => {
  const address = context.query.campaignAddress;
  const campaignInstance = CreateCampaignInstace(address);
  const approversCount = await campaignInstance.methods.approversCount().call();
  const requestCount = await campaignInstance.methods.getRequestCount().call();
  const requestList = await Promise.all(
    Array(Number.parseInt(requestCount))
      .fill()
      .map((e, index) => {
        return campaignInstance.methods.requestList(index).call();
      })
  );
  return {
    address,
    approversCount,
    requestList,
    requestCount,
  };
};

export default Requests;
