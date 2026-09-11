import { useState, useEffect } from 'react';
import { FiWifiOff, FiWifi } from 'react-icons/fi';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      setShowOnline(true);
      setTimeout(() => setShowOnline(false), 3000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !showOnline) return null;

  return (
    <div className={`offline-banner ${showOnline ? 'online' : ''}`}>
      {isOffline ? (
        <><FiWifiOff size={16} /> You're offline — Some features may be limited</>
      ) : (
        <><FiWifi size={16} /> Back online!</>
      )}
    </div>
  );
}
