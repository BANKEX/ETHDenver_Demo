$(document).ready(function () {
	if (typeof web3 !== 'undefined') {
		window.localWeb3 = new Web3(web3.currentProvider);
		// window.web3 = new Web3(localWeb3.currentProvider);
	} else {
		console.log('No web3? You should consider trying MetaMask!')
		window.web3 = new Web3(new localWeb3.providers.HttpProvider("http://localhost:8545"));
	}

	window.tokenContractInstance = initTokenContract();
	window.zkContractInstance = initZKETHContract();

	// localWeb3.version.getNetwork((err, netId) => {
	// 	switch (netId) {
	// 	case "4":
	// 		console.log('This is the Rinkeby test network');
	// 		break;
	// 	default:
	// 		alert('Please select Rinkeby network in MetaMask')
	// 	}
	// });

	localWeb3.eth.getAccounts((err, accs) => {
		if (err != null) {
			return;
		}

		if (accs.length === 0) {
			return;
		}

		window.account = accs[0];

		if (window.onAccountChanged) {
			onAccountChanged(window.account);
		}
	});
	
	var accountInterval = setInterval(function() {
		localWeb3.eth.getAccounts((err, accs) => {
			console.log(accs);
			if (err != null) {
				return;
			}

			if (accs.length === 0) {
				return;
			}

			if (accs[0] !== window.account) {
				window.account = accs[0];

				if (window.onAccountChanged) {
					onAccountChanged(window.account);
				}
			}
		});
	}, 100);

	if (window.onDocumentReady) {
		onDocumentReady();
	}
});

function initZKETHContract() {
	var abi = [
		{
			"constant": true,
			"inputs": [],
			"name": "n",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"name": "deposits",
			"outputs": [
				{
					"name": "X",
					"type": "uint256"
				},
				{
					"name": "Y",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "m",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "token",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "peddersenBaseH",
			"outputs": [
				{
					"name": "X",
					"type": "uint256"
				},
				{
					"name": "Y",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "peddersenBaseG",
			"outputs": [
				{
					"name": "X",
					"type": "uint256"
				},
				{
					"name": "Y",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "verifier",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"name": "coords",
					"type": "uint256[4]"
				},
				{
					"name": "_verifier",
					"type": "address"
				},
				{
					"name": "_token",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "value",
					"type": "uint256"
				},
				{
					"name": "secret",
					"type": "uint256"
				}
			],
			"name": "withdraw",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "_address",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "_amount",
					"type": "uint256"
				}
			],
			"name": "DepositToMixer",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "_address",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "_X",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "_Y",
					"type": "uint256"
				}
			],
			"name": "TransferByMixer",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "_address",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "_amount",
					"type": "uint256"
				}
			],
			"name": "WithdrawFromMixer",
			"type": "event"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "deposit",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "addresses",
					"type": "address[2]"
				},
				{
					"name": "coords",
					"type": "uint256[20]"
				},
				{
					"name": "scalars",
					"type": "uint256[10]"
				},
				{
					"name": "ls_coords",
					"type": "uint256[8]"
				},
				{
					"name": "rs_coords",
					"type": "uint256[8]"
				}
			],
			"name": "transferWithProofs",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "address1",
					"type": "address"
				},
				{
					"name": "hiddenValue1_x",
					"type": "uint256"
				},
				{
					"name": "hiddenValue1_y",
					"type": "uint256"
				},
				{
					"name": "address2",
					"type": "address"
				},
				{
					"name": "hiddenValue2_x",
					"type": "uint256"
				},
				{
					"name": "hiddenValue2_y",
					"type": "uint256"
				}
			],
			"name": "transfer",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		}
	];

	var contractAaddress = "0x324f8c6d8c0801cdddd86d1936d8ce7b95f8a654";
	// var contract = localWeb3.eth.contract(abi);

	return new localWeb3.eth.Contract(abi, contractAaddress, { from: window.account });
	
	// return contract.at(contractAaddress);
}

function initTokenContract() {
	var abi = [
		{
			"constant": true,
			"inputs": [],
			"name": "upgraderSet",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "name",
			"outputs": [
				{
					"name": "",
					"type": "string"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_spender",
					"type": "address"
				},
				{
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "approve",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "totalSupply",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_upgraderAddress",
					"type": "address"
				}
			],
			"name": "setUpgrader",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_from",
					"type": "address"
				},
				{
					"name": "_to",
					"type": "address"
				},
				{
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "transferFrom",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_for",
					"type": "address"
				},
				{
					"name": "_amount",
					"type": "uint256"
				}
			],
			"name": "demint",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "decimals",
			"outputs": [
				{
					"name": "",
					"type": "uint8"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "crowdsaleManager",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_for",
					"type": "address"
				},
				{
					"name": "_amount",
					"type": "uint256"
				}
			],
			"name": "mint",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_newCrowdsale",
					"type": "address"
				}
			],
			"name": "setCrowdsale",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_newLockState",
					"type": "bool"
				}
			],
			"name": "setLock",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_spender",
					"type": "address"
				},
				{
					"name": "_subtractedValue",
					"type": "uint256"
				}
			],
			"name": "decreaseApproval",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "_owner",
					"type": "address"
				}
			],
			"name": "balanceOf",
			"outputs": [
				{
					"name": "balance",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [],
			"name": "disableMinting",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_for",
					"type": "address"
				},
				{
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "upgradeFor",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "symbol",
			"outputs": [
				{
					"name": "",
					"type": "string"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "mintingAllowed",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "crowdsaleContractAddress",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_to",
					"type": "address"
				},
				{
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "transfer",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "upgrader",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "string"
				},
				{
					"name": "_symbol",
					"type": "string"
				}
			],
			"name": "setNameAndTicker",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_newState",
					"type": "bool"
				}
			],
			"name": "allowUpgrading",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "locked",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_newManager",
					"type": "address"
				}
			],
			"name": "setManager",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [],
			"name": "upgrade",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_spender",
					"type": "address"
				},
				{
					"name": "_addedValue",
					"type": "uint256"
				}
			],
			"name": "increaseApproval",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "_owner",
					"type": "address"
				},
				{
					"name": "_spender",
					"type": "address"
				}
			],
			"name": "allowance",
			"outputs": [
				{
					"name": "remaining",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "transferOwnership",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "upgradable",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"name": "_name",
					"type": "string"
				},
				{
					"name": "_symbol",
					"type": "string"
				},
				{
					"name": "_decimals",
					"type": "uint8"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"payable": true,
			"stateMutability": "payable",
			"type": "fallback"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "previousOwner",
					"type": "address"
				},
				{
					"indexed": true,
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "OwnershipTransferred",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "_from",
					"type": "address"
				},
				{
					"indexed": true,
					"name": "_to",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "Transfer",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "_owner",
					"type": "address"
				},
				{
					"indexed": true,
					"name": "_spender",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "Approval",
			"type": "event"
		}
	];

	var contractAaddress = "0xc7b8f6dfc4ec585a12a3d5040f8f5b6a383d0049";
	// var contract = localWeb3.eth.contract(abi);

	return new localWeb3.eth.Contract(abi, contractAaddress, { from: window.account });
	
	// return contract.at(contractAaddress);
}