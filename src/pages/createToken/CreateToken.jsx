import { useState } from "react";
import { Container, Card, Form, Row, Col, Alert } from "react-bootstrap";
import { useWalletClient } from "wagmi";
import { parseEther } from "viem";
import { ConnectKitButton } from "connectkit";
import ContractABI from "../../util/artifacts/ABI.json";
import UploadImage from "./UploadImage"; // Importando o componente de upload de imagem

const ContractABIJson = ContractABI.abi;
const launchFee = "0.005"; // 5000000000000000 wei representado como 0.005 ether

const CreateTokenYour = () => {
  const { data: walletClient } = useWalletClient();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [youtube, setYoutube] = useState("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [cid, setCid] = useState(null); // Armazenar o CID da imagem

  // Validar se todos os campos necessários estão preenchidos
  const isFormValid = name && symbol && totalSupply && cid;

  const launchToken = async () => {
    const contract_address = "0xb5295bc6db0d542ef2c582024e44d97a87ff7dca"; // O endereço do contrato
    const maxTx = 1; // maxTx é sempre 1

    // Verificar se a wallet está conectada
    if (!walletClient || !walletClient.account.address) {
      setError("Please connect your wallet.");
      return;
    }

    // Garantir que os URLs não preenchidos sejam strings vazias
    const urls = [twitter || "", telegram || "", youtube || "", website || ""];

    const args = [
      name, // _name
      symbol, // _ticker
      description, // desc
      cid, // img (CID da imagem)
      urls, // urls
      BigInt(totalSupply), // _supply
      maxTx // maxTx (valor constante)
    ];

    console.log("Creating token with the following arguments:", args);

    try {
      setError("");
      await walletClient.writeContract({
        abi: ContractABIJson,
        address: contract_address,
        functionName: "launch",
        args: args,
        value: parseEther(launchFee), // Inclui o valor do launchFee
        gas: 2_000_000n
      });

      console.log("Token launched successfully!");
    } catch (error) {
      console.error(error);
      setError(
        "An error occurred while launching the token. Check the console for more details."
      );
    }
  };

  const createToken = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);
    console.log("Creating token with:", { name, symbol, totalSupply, cid });

    // Chamar a função launch com os parâmetros corretos
    await launchToken();
  };

  return (
    <Container className="pb-3">
      <Col xs={12} className="mb-2 pb-2">
        <h3>Create Your Token in Seconds</h3>
      </Col>
      <Card className="bg-black border border-light text-white">
        <Card.Header>Create Token</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form noValidate validated={validated} onSubmit={createToken}>
            <Row className="mb-3">
              <Col md={12} className="text-center mb-3">
                <UploadImage onCidChange={(cid) => setCid(cid)} />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Token Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Token Symbol *</Form.Label>
                  <Form.Control
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Supply *</Form.Label>
                  <Form.Control
                    type="text"
                    value={totalSupply}
                    onChange={(e) =>
                      setTotalSupply(e.target.value.replace(/[^\d]/g, ""))
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Token Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={620}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>YouTube</Form.Label>
                  <Form.Control
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telegram</Form.Label>
                  <Form.Control
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Twitter (X)</Form.Label>
                  <Form.Control
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            {walletClient ? (
              <button
                variant="primary"
                type="submit"
                disabled={!isFormValid}
                className="btn btn-primary"
              >
                Create Token
              </button>
            ) : (
              <ConnectKitButton />
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateTokenYour;
