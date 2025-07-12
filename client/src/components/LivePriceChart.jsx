import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function LivePriceChart({ symbol }) {
  const [data, setData] = useState([]);
  const historyRef = useRef([]); // 🔁 Persistent, non-reactive

  useEffect(() => {
    const handlePriceUpdate = ({ prices }) => {
      if (!prices[symbol]) return;

      const newPoint = {
        time: new Date().toLocaleTimeString(),
        price: prices[symbol],
      };

      const current = historyRef.current;
      const updated = [...current.slice(-30), newPoint];
      historyRef.current = updated;
      setData([...updated]); // trigger re-render only with the latest array
    };

    socket.on("prices", handlePriceUpdate);

    return () => socket.off("prices", handlePriceUpdate);
  }, [symbol]);

  return (
    <div className="p-4 ">
      <h3 className="font-bold mb-2">{symbol} Live price feed</h3>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart width={1000} height={500} data={data}>
          {/* 🎨 Gradient Definition */}
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip
            content={({ payload }) =>
              payload?.length ? (
                <div className="bg-indigo-50 text-indigo-600 p-3 rounded shadow text-sm">
                  <p>Price: ${payload[0].value.toFixed(4)}</p>
                  <p>Time: {payload[0].payload.time}</p>
                </div>
              ) : null
            }
          />

          <Line
            type="natural"
            dataKey="price"
            stroke="#8884d8"
            activeDot={true}
            strokeWidth={2}
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
