import { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";

import factory from "../../Ethereum/factory";
import web3 from "../../Ethereum/web3";

function NewCampaign() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const minimumContribution = event.target.minimumContribution.value;
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });
    } catch (error) {
      switch (error.code) {
        case 4001:
          setErrorMessage("User rejected transaction");
          break;
        case "INVALID_ARGUMENT":
          setErrorMessage("Invalid minimum Contribution value, minimum value is 100 wei");
          break;
        default:
          console.error(error);
      }
    }
    router.push("/");
    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create New Campaign</h3>

      <Form error={!!errorMessage} onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum contribution</label>
          <Input id="minimumContribution" label="wei" labelPosition="right"></Input>
        </Form.Field>
        <Message error header="OOPS!" content={errorMessage} />
        <Button loading={loading} inverted color="green">
          Create!
        </Button>
      </Form>
    </Layout>
  );
}

export default NewCampaign;
