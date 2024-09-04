import { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import { createChart } from "lightweight-charts";
import { fetchTokenData } from "./SwapData";

const Grafico = ({ tk }) => {
  const chartContainerRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = tk.toLowerCase();

    const formatLiquidity = (liquidity) => {
      return parseFloat(liquidity).toFixed(2);
    };

    const loadData = async () => {
      const tokenData = await fetchTokenData(token);
      if (tokenData && tokenData.ethSwappedForTokens) {
        const formattedData = tokenData.ethSwappedForTokens.map((item) => ({
          newVolume24H: formatLiquidity(item.newVolume24H),
          newLiquidity: formatLiquidity(item.newLiquidity),
          newPrice: item.newPrice // Não formatar aqui
        }));
        setData(formattedData);
      }
    };

    loadData();
  }, [tk]);

  useEffect(() => {
    if (chartContainerRef.current && data.length > 0) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: "#131722" },
          textColor: "#d1d4dc"
        },
        grid: {
          vertLines: {
            color: "#334155"
          },
          horzLines: {
            color: "#334155"
          }
        },
        priceScale: {
          borderColor: "#334155",
          autoScale: true
        },
        timeScale: {
          borderColor: "#334155",
          timeVisible: true,
          secondsVisible: false,
          rightBarStaysOnScroll: true,
          fixLeftEdge: true,
          fixRightEdge: true
        },

      localization: {
        priceFormatter: price => price.toFixed(9) // Ajuste para 9 casas decimais
      },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true
        }
      });

      const lineSeries = chart.addLineSeries({
        color: "#34D399",
        lineWidth: 2
      });

      const lineData = data.map((item, index) => ({
        time: index,
        value: parseFloat(item.newPrice) / 1e18
      }));

      lineSeries.setData(lineData);

      chart.timeScale().fitContent(); // Ajusta para mostrar todo o conteúdo

      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (chart) {
          chart.remove();
        }
      };
    }
  }, [data]);


  return (
    <Card
      style={{
        backgroundColor: "#1a1a1a",
        borderColor: "#2d2d2d",
        padding: "20px"
      }}
      className="mb-0"
    >
      <div ref={chartContainerRef} className="chart-container" />;
    </Card>
  ); 
};

export default Grafico;
