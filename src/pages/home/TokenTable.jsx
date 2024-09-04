import { useState } from "react";
import { Table, Button, Card, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Table.css";
const chainsafeEndpoint = import.meta.env.VITE_CHAINSAFE_ENDPOINT;

function TokenTable({ tokens }) {
  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 10;

  // Calcula os índices dos tokens para a página atual
  const indexOfLastToken = currentPage * tokensPerPage;
  const indexOfFirstToken = indexOfLastToken - tokensPerPage;
  const currentTokens = tokens.slice(indexOfFirstToken, indexOfLastToken);

  // Calcula o número total de páginas
  const totalPages = Math.ceil(tokens.length / tokensPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Card
      className="mb-0 border-1 border border-light-subtle"
      style={{ backgroundColor: "#0000" }}
    >
      <Card.Header className="text-start text-light fw-bold fs-5 border-bottom">
        🚀 Top Tokens
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table variant="dark" className="table mb-0 table-dark">
            <thead className="text-center align-middle text-nowrap thead-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Volume 24H</th>
                <th>Buy</th>
              </tr>
            </thead>
            <tbody className="text-center textalign-center text-nowrap">
              {currentTokens.map((token, index) => (
                <tr key={token.token}>
                  <td>{indexOfFirstToken + index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={`${chainsafeEndpoint}/${token.image}`}
                        alt={token.name}
                        className="me-2 rounded-circle"
                        style={{ width: "30px", height: "30px" }}
                      />
                      <span>{token.name}</span>
                    </div>
                  </td>
                  <td>{token.price}</td>
                  <td>{token.volume24H}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/token/${token.token}`}
                      variant="success"
                      size="sm"
                    >
                      Buy
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
      <Card.Footer className="text-center mb-0">
        <Pagination className="justify-content-center pagination-dark">
          <Pagination.Prev
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lsaquo; Prev
          </Pagination.Prev>
          {[...Array(totalPages)].map((_, pageNumber) => (
            <Pagination.Item
              key={pageNumber + 1}
              active={pageNumber + 1 === currentPage}
              onClick={() => paginate(pageNumber + 1)}
            >
              {pageNumber + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &rsaquo;
          </Pagination.Next>
        </Pagination>
      </Card.Footer>
    </Card>
  );
}

export default TokenTable;
