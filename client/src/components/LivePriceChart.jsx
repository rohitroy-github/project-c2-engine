import { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

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

    socket.on('prices', handlePriceUpdate);

    return () => socket.off('prices', handlePriceUpdate);
  }, [symbol]);

  return (
    <div className="p-4">
      <h3 className="font-bold mb-2">{symbol} Live price feed</h3>
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="time" interval={2} />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Line type="natural" dataKey="price" stroke="#8884d8" dot={true} />
      </LineChart>
    </div>
  );
}
