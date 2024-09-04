import { gql, request } from "graphql-request";
import { formatUnits } from "viem"; 

const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOIN_SQD;
const chainsafeEndpoint = import.meta.env.VITE_CHAINSAFE_ENDPOINT;

const query = gql`
  query TokenDataquery($token: String!) {
    ethSwappedForTokens(
      where: { token_eq: $token }
      orderBy: id_DESC
      limit: 1
    ) {
      newVolume24H
      newLiquidity
      newPrice
    }
    tokenLauncheds(where: { token_eq: $token }) {
      name
      ticker
      image
      creator
      supply
      twitter
      youtube
      telegram
      website
    }
  }
`;

const formatLiquidity = (liquidity) => {
  return parseFloat(formatUnits(liquidity, 18)).toFixed(2);
};

const formatSupply = (supply) => {
  return parseFloat(formatUnits(supply, 18)).toFixed(1);
};

export const fetchTokenData = async (token) => {
  try {
    const data = await request(endpoint, query, { token });

    return {
      ethSwappedForTokens: data.ethSwappedForTokens.map((tokenData) => ({
        newVolume24H: formatLiquidity(tokenData.newVolume24H),
        newLiquidity: formatLiquidity(tokenData.newLiquidity),
        newPrice: tokenData.newPrice // Não formatar aqui
      })),
      tokenLauncheds: data.tokenLauncheds.map((tokenData) => {
        const imageUrl = `${chainsafeEndpoint}/${tokenData.image}`;

        return {
          name: tokenData.name,
          ticker: tokenData.ticker,
          image: imageUrl,
          creator: tokenData.creator,
          supply: formatSupply(tokenData.supply),
          twitter: tokenData.twitter,
          youtube: tokenData.youtube,
          telegram: tokenData.telegram,
          website: tokenData.website
        };
      })
    };
  } catch (error) {
    console.error("Error fetching token data:", error);
    return null;
  }
};
