import { useState } from "react";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import ContractABI from "../../util/artifacts/ABI.json";
import { useWalletClient } from "wagmi";
import { parseEther } from "viem";

const ContractABIJson = ContractABI.abi;

function Swap({ tk }) {
  // Recebe `tk` como prop
  const { data: walletClient } = useWalletClient();
  const [activeTab, setActiveTab] = useState("buy");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAmountChange = (e) => {
    let inputAmount = e.target.value;
    inputAmount = inputAmount.replace(",", ".");
    const validAmount = inputAmount.match(/^\d*\.?\d*$/);
    if (validAmount) {
      setAmount(inputAmount);
    }
  };

  const swapETHForTokens = async () => {
    const contract_address = "0xb5295Bc6db0d542Ef2C582024E44D97A87FF7DCa";
    const to = walletClient?.account.address;
    const referree = "0x60D0a8EEF16A21Ce5CAB2cda5Ab71B493f309EbA";

    const args = [tk, to, referree]; // Usa `tk` passado como prop

    try {
      setError("");
      await walletClient.writeContract({
        abi: ContractABIJson,
        address: contract_address,
        functionName: "swapETHForTokens",
        args: args,
        value: parseEther(amount),
        gas: 1_000_000n
      });

      await new Promise((resolve) => setTimeout(resolve, 15000));
    } catch (error) {
      console.error(error);
      setError(
        "Ocorreu um erro ao realizar swap. Verifique o console para mais detalhes."
      );
    }
  };

  return (
    <Card
      style={{
        backgroundColor: "#1a1a1a",
        borderColor: "#2d2d2d",
        padding: "20px"
      }}
    >
      <Card.Body>
        <div className="d-flex mb-3">
          <Button
            onClick={() => handleTabChange("buy")}
            style={{
              backgroundColor: activeTab === "buy" ? "#28a745" : "#333",
              color: activeTab === "buy" ? "#fff" : "#aaa",
              width: "48%",
              marginRight: "4%"
            }}
            className="border-0"
          >
            Buy
          </Button>
          <Button
            onClick={() => handleTabChange("sell")}
            style={{
              backgroundColor: "#e64e4e",
              color: "#aaa",
              width: "48%"
            }}
            className="border-0"
            disabled
          >
            Sell
          </Button>
        </div>

        <Form.Group className="my-3">
          <InputGroup>
            <Form.Control
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              aria-label="Amount"
              className="bg-dark text-light"
            />
            <InputGroup.Text className="bg-dark text-light">
              <div className="d-flex align-items-center">
                {activeTab === "buy" ? "ETH" : "USDT"}
                <img
                  src={
                    activeTab === "buy"
                      ? "https://cryptologos.cc/logos/ethereum-eth-logo.png"
                      : "https://cryptologos.cc/logos/tether-usdt-logo.png"
                  }
                  alt={activeTab === "buy" ? "ETH" : "USDT"}
                  style={{ width: "20px", height: "20px" }}
                  className="ms-2"
                />
              </div>
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <Button variant="success" className="w-100" onClick={swapETHForTokens}>
          Trade
        </Button>

        {error && <div className="text-danger mt-3">{error}</div>}
      </Card.Body>
    </Card>
  );
}

export default Swap;

