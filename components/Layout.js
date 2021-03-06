import { Container } from "semantic-ui-react";
import Header from "./Header";

function Layout(props) {
  return (
    <Container>
      <Header />
      {props.children}
      <h1>Footer</h1>
    </Container>
  );
}

export default Layout;
