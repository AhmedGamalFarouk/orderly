import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import './CelebrationAnimation.css';

const CelebrationAnimation = ({ participants }) => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000); // Animation duration + message display

    return () => clearTimeout(timer);
  }, []);

  if (!showAnimation) {
    return null;
  }

  // Define some initial and final positions for avatars
  const avatarPositions = [
    { initialX: '-100vw', initialY: '-100vh', finalX: '50vw', finalY: '50vh' }, // Top-left to center-right
    { initialX: '100vw', initialY: '-100vh', finalX: '-50vw', finalY: '50vh' }, // Top-right to center-left
    { initialX: '-100vw', initialY: '100vh', finalX: '50vw', finalY: '-50vh' }, // Bottom-left to center-right
    { initialX: '100vw', initialY: '100vh', finalX: '-50vw', finalY: '-50vh' }, // Bottom-right to center-left
    { initialX: '0vw', initialY: '-100vh', finalX: '0vw', finalY: '50vh' }, // Top-center to bottom-center
    { initialX: '0vw', initialY: '100vh', finalX: '0vw', finalY: '-50vh' }, // Bottom-center to top-center
  ];

  return (
    <div className="celebration-container">
      {participants.map((participant, index) => {
        const pos = avatarPositions[index % avatarPositions.length];
        return (
          <div
            key={participant.id || index}
            className="celebration-avatar"
            style={{
              '--initial-x': pos.initialX,
              '--initial-y': pos.initialY,
              '--final-x': pos.finalX,
              '--final-y': pos.finalY,
              animationDelay: `${index * 0.1}s`, // Staggered animation
              left: '50%', /* Center horizontally for initial transform origin */
              top: '50%', /* Center vertically for initial transform origin */
            }}
          >
            <Avatar title={participant.name || participant.initials} className="w-16 h-16 text-3xl" />
          </div>
        );
      })}
      <h2 className="celebration-message">Order Placed!</h2>
    </div>
  );
};

export default CelebrationAnimation;
