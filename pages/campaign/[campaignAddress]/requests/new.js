import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import CreateCampaignInstance from "../../../../Ethereum/campaign";
import web3 from "../../../../Ethereum/web3";

function CreateRequest() {
  const router = useRouter();
  const campaignAddress = router.query.campaignAddress;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const {
      description: { value: description },
      amountInEther: { value: amountInEther },
      recipient: { value: recipient },
    } = event.target;
    try {
      const campaignInstance = CreateCampaignInstance(campaignAddress);
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods
        .createRequest(description, web3.utils.toWei(amountInEther, "ether"), recipient)
        .send({
          from: accounts[0],
        });
    } catch (error) {
      setErrorMessage(error.message);
    }
    router.back();
    setLoading(false);
  };

  return (
    <Layout>
      <a href="#" onClick={router.back}>
        Back
      </a>
      <h3>Create Request</h3>

      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input id="description"></Input>
        </Form.Field>
        <Form.Field>
          <label>Amount in Ehter</label>
          <Input id="amountInEther"></Input>
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input id="recipient"></Input>
        </Form.Field>
        <Message error header="OOPS!" content={errorMessage}></Message>
        <Button primary type="submit" loading={loading}>
          Create
        </Button>
      </Form>
    </Layout>
  );
}

export default CreateRequest;
