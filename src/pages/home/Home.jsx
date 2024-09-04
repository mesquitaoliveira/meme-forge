import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TrendCard from "./TrendCard";
import TokenTable from "./TokenTable";
import { fetchTokens } from "./tokenData"; // Função para buscar os dados

function Home() {
  const [trendItems, setTrendItems] = useState([]);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const tokenData = await fetchTokens();
      setTrendItems(tokenData.slice(0, 3)); // Supondo que os três primeiros itens são para os cards
      setTokens(tokenData); // Todos os itens para a tabela
    };
    fetchData();
  }, []);

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h4>🔥 Trending</h4>
        </Col>
      </Row>
      <Row>
        {trendItems.length > 0 ? (
          trendItems.map((item, index) => (
            <Col key={index} md={4} className="mb-3">
              <TrendCard items={[item]} />
            </Col>
          ))
        ) : (
          <Col>
            <p>Loading trending tokens...</p>
          </Col>
        )}
      </Row>
      <Row className="mt-3">
        <Col>
          <h4>Market Cap</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          {tokens.length > 0 ? (
            <TokenTable tokens={tokens} />
          ) : (
            <p>Loading tokens...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
