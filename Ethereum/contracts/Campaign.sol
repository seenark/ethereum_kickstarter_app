pragma solidity ^0.4.26;

contract CampaignFactory {
    address[] public deployedCampaignList;

    function createCampaign(uint256 minimumContribute) public {
        address newCamapign = new Campaign(minimumContribute, msg.sender);
        deployedCampaignList.push(newCamapign);
    }

    function getDeployedCampaignList() public view returns (address[]) {
        return deployedCampaignList;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvalList;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    Request[] public requestList;
    address public manager;
    uint256 public minimumContribute;
    mapping(address => bool) public approverList;
    uint256 public approversCount;

    constructor(uint256 minimum, address creator) public {
        minimumContribute = minimum;
        manager = creator;
    }

    function contribute() public payable {
        require(msg.value > minimumContribute);
        approverList[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public restricted {
        Request memory newRequest =
            Request({
                description: description,
                value: value,
                recipient: recipient,
                complete: false,
                approvalCount: 0
            });
        // alternative way to create new instance
        // Request newRequest2 = Request(description, value, recipient, false);

        requestList.push(newRequest);
    }

    function approvalRequest(uint256 index) public {
        Request storage request = requestList[index];

        require(approverList[msg.sender]);
        require(request.approvalList[msg.sender] == false);

        request.approvalList[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public {
        Request storage request = requestList[index];
        require(request.complete == false);
        require(request.approvalCount > (approversCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            this.balance,
            minimumContribute,
            requestList.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint256) {
        return requestList.length;
    }
}
