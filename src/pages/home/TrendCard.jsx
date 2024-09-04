import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const chainsafeEndpoint = import.meta.env.VITE_CHAINSAFE_ENDPOINT;

function TrendCard({ items }) {
  return (
    <Card
      className="mb-4"
      style={{ border: "none", backgroundColor: "transparent" }}
    >
      <Card.Body>
        <Card.Text>
          {items.map((item, index) => (
            <Link
              to={`token/${item.token}`}
              key={index}
              className="text-decoration-none"
            >
              <Row
                className="mb-2 p-2 token-card"
                style={{
                  borderRadius: "5px",
                  backgroundColor: "#1a1a1a",
                  color: "white",
                  fontSize: "0.6rem" // Diminuindo o tamanho da fonte
                }}
              >
                <Col>
                  <div className="d-flex align-items-center">
                    <img
                      src={`${chainsafeEndpoint}/${item.image}`}
                      alt={item.name}
                      className="me-2 rounded-circle"
                      style={{ width: "30px", height: "30px" }}
                    />
                    <div>
                      <div style={{ fontWeight: "bold" }}>{item.name}</div>
                      <div>{item.ticker}</div>
                    </div>
                  </div>
                </Col>
                <Col className="text-end">
                  <div>LIQ {item.liquidity}</div>
                  <div>Price {item.price}</div>
                </Col>
              </Row>
            </Link>
          ))}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default TrendCard;
