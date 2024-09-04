import { useEffect, useState } from "react";
import "./HeaderToken.css";
import { fetchTokenData } from "./SwapData";
import baseLogo from "./../../assets/base-logo.svg";

const HeaderToken = ({ tk }) => {
  const [tokenData, setTokenData] = useState({
    name: "",
    ticker: "",
    image: "",
    supply: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Converte o token para minúsculas
    const token = tk.toLowerCase();

    const formatSupply = (supply) => {
      const supplyNumber = Number(supply);
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      }).format(supplyNumber);
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchTokenData(token);
        if (data && data.tokenLauncheds.length > 0) {
          setTokenData({
            name: data.tokenLauncheds[0].name,
            ticker: data.tokenLauncheds[0].ticker,
            image: data.tokenLauncheds[0].image,
            supply: formatSupply(data.tokenLauncheds[0].supply)
          });
        } else {
          console.log("Nenhum dado encontrado para o token:", token);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do token:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tk]); // React ao mudar tk

  return (
    <div className="header-token">
      <div className="header-links">
        <span className="header-link">
          <img src={baseLogo} alt="Base" className="token-image" />
          Base
        </span>
        <span>›</span>
        <span className="header-link">Meme Forge</span>
      </div>
      <div className="header-icon">
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <>
            {tokenData.image && (
              <img
                src={tokenData.image}
                alt={tokenData.name}
                className="token-image"
              />
            )}
            <div className="token-info">
              <span>
                {tokenData.name} [{tokenData.ticker}]
              </span>
              <span>Supply: {tokenData.supply}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderToken;
