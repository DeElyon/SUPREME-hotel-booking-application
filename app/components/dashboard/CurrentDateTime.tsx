import React from 'react';
import { useEffect, useState } from 'react';

const CurrentDateTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(getCurrentUTCDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentUTCDateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-sm text-gray-600 flex flex-col items-end">
      <div className="font-mono">{currentTime}</div>
      <div className="text-xs text-gray-500">UTC</div>
    </div>
  );
};

function getCurrentUTCDateTime(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default CurrentDateTime;