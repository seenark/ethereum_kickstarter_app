import { Button, Table } from "semantic-ui-react";
import { useRouter } from "next/router";
import web3 from "../Ethereum/web3";
import CreateCampaignInstance from "../Ethereum/campaign";
import { useState } from "react";

function RequestRow(props) {
  const { id, request, approversCount, address } = props;
  const { Row, Cell } = Table;
  const [approveLoading, setApproveLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const router = useRouter();

  const onApprove = async () => {
    setApproveLoading(true);
    try {
      const campaignInstance = CreateCampaignInstance(address);
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods.approvalRequest(id).send({ from: accounts[0] });
    } catch (error) {
      console.log(error);
    }
    router.replace(`/campaign/${address}/requests`);
    setApproveLoading(false);
  };

  const onFinalize = async () => {
    setFinalizeLoading(true);
    try {
      const campaignInstance = CreateCampaignInstance(address);
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods.finalizeRequest(id).send({ from: accounts[0] });
    } catch (error) {
      console.log(error);
    }
    router.replace(`/campaign/${address}/requests`);
    setFinalizeLoading(false);
  };

  const readyToFinalize = request.approvalCount > approversCount / 2;
  return (
    <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount} / {approversCount}
      </Cell>
      <Cell>
        <Button inverted color="green" loading={approveLoading} onClick={onApprove}>
          Approve
        </Button>
      </Cell>
      <Cell>
        <Button inverted color="orange" loading={finalizeLoading} onClick={onFinalize}>
          Finalize
        </Button>
      </Cell>
    </Row>
  );
}

export default RequestRow;
