import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";
import createCampaignInstance from "../Ethereum/campaign";
import web3 from "../Ethereum/web3";

function ContributeForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const amountOfContribute = event.target.amountOfContribute.value;
      const { address } = props;
      const campaignInstance = createCampaignInstance(address);
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amountOfContribute, "ether"),
      });
    } catch (error) {
      console.log("error", error);
      switch (error.code) {
        case 4001:
          setErrorMessage("You was rejected the transaction");
          break;

        default:
          setErrorMessage(error.message);
          break;
      }
    }
    setLoading(false);
    router.replace(`/campaign/${props.address}`);
  };

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input id="amountOfContribute" label="ether" labelPosition="right" />
      </Form.Field>
      <Message error header="OOPS!" content={errorMessage} />
      <Button loading={loading} primary>
        Contribute
      </Button>
    </Form>
  );
}

export default ContributeForm;
