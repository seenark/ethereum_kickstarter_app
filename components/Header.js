import { Button, Menu } from "semantic-ui-react";
import Link from "next/link";

function Header() {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link href="/">
        <Menu.Item>CrowdCoin</Menu.Item>
      </Link>

      <Menu.Menu position="right">
        <Link href="/">
          <Menu.Item>Campaigns</Menu.Item>
        </Link>
        <Link href="/campaign/new">
          <Menu.Item>
            <Button basic fluid icon="add circle" />
          </Menu.Item>
        </Link>
      </Menu.Menu>
    </Menu>
  );
}

export default Header;
