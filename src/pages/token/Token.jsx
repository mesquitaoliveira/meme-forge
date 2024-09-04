import { Container, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom"; // Importa useParams
import Grafico from "./Grafico";
import Swap from "./Swap";
import HistoricoTransacoes from "./HistoricoTransacoes";
import HeaderToken from "./HeaderToken";

function Token() {
  const { tk } = useParams(); // Captura o parâmetro `tk` da URL

  return (
    <>
      <HeaderToken tk={tk} /> {/* Passa o `tk` como prop */}
      <Container className="my-3">
        <Row>
          <Col md={6}>
            <Grafico tk={tk} />
          </Col>
          <Col md={6} className="py-2">
            <Swap tk={tk} /> {/* Passa o `tk` como prop */}
          </Col>
        </Row>
        <Row className="py-2">
          <Col>
            <Card className="border-primary">
              <Card.Body>{/* <HistoricoTransacoes /> */}</Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Token;
