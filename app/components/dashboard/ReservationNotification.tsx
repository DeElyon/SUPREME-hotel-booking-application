import React, { useEffect, useState } from 'react';
import { ReservationUpdate } from '../../types/reservation';

interface Props {
  update: ReservationUpdate | null;
}

const ReservationNotification: React.FC<Props> = ({ update }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (update) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [update]);

  if (!show || !update) return null;

  const getMessage = () => {
    switch (update.type) {
      case 'new':
        return `New reservation received for ${update.data.guestName}`;
      case 'update':
        return `Reservation updated for ${update.data.guestName}`;
      case 'delete':
        return `Reservation cancelled for ${update.data.guestName}`;
      default:
        return '';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 animate-slide-in">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            {getMessage()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationNotification;