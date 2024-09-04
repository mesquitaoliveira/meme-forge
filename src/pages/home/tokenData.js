import { gql, request } from "graphql-request";

const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOIN_SQD;

const query = gql`
  query GetTokens {
    tokenLauncheds {
      name
      ticker
      image
      liquidity
      price
      token
      volume24H
    }
  }
`;

export const fetchTokens = async () => {
  try {
    const data = await request(endpoint, query);
    return data.tokenLauncheds.map((token) => ({
      name: token.name,
      ticker: token.ticker,
      token: token.token,
      image: token.image,
      liquidity: formatLiquidity(token.liquidity),
      price: formatPrice(token.price),
      volume24H: token.volume24H
    }));
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return [];
  }
};

const formatLiquidity = (liquidity) => {
  // Formatação do valor de liquidez em ETH
  return `${(Number(liquidity) / 1e18).toFixed(4)} ETH`;
};

const formatPrice = (price) => {
  // Formatação do preço em ETH
  return `${(Number(price) / 1e18).toFixed(11)} ETH`;
};
