import { useState, useEffect } from 'react';
import './CountdownTimer.css';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const target = targetDate || getEndOfDay();
    const diff = Math.max(0, target - Date.now());
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: diff <= 0,
    };
  }

  function getEndOfDay() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) return <span className="countdown-expired">Deal Ended</span>;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="countdown-timer">
      <span className="countdown-label">Ends in</span>
      <div className="countdown-digits">
        <div className="countdown-unit">
          <span className="countdown-num">{pad(timeLeft.hours)}</span>
          <span className="countdown-text">hrs</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-unit">
          <span className="countdown-num">{pad(timeLeft.minutes)}</span>
          <span className="countdown-text">min</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-unit">
          <span className="countdown-num countdown-seconds">{pad(timeLeft.seconds)}</span>
          <span className="countdown-text">sec</span>
        </div>
      </div>
    </div>
  );
}
