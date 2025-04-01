import { useState, useEffect, useRef } from 'react';
import './FlipCounter.css'; 

interface FlipCounterProps {
  count: number;
}

const FlipCounter: React.FC<FlipCounterProps> = ({ count }) => {
  const prevCountRef = useRef(count);
  const [flipping, setFlipping] = useState(false);
  
  useEffect(() => {
    if (prevCountRef.current !== count) {
      setFlipping(true);
      const timer = setTimeout(() => {
        setFlipping(false);
        prevCountRef.current = count;
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [count]);
  
  // Convert number to array of digits
  const digits = count.toString().padStart(5, '0').split('');
  
  return (
    <div className="flip-counter">
      {digits.map((digit, index) => (
        <div 
          key={index} 
          className={`flip-digit ${flipping ? 'flipping' : ''}`}
        >
          <div className="flip-digit-current">{digit}</div>
          <div className="flip-digit-next">
            {flipping ? digit : prevCountRef.current.toString().padStart(5, '0')[index]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlipCounter;