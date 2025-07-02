import React from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';
import { continents } from '../../utils/country.data';

const Game: React.FC = () => {
  const {
    hand,
    stage,
    currentQuestion,
    message,
    gameOver,
    handleAnswer,
    initializeGame,
  } = useGameLogic();


  const renderButtons = () => {
    if (gameOver) {
      return <button onClick={() => initializeGame()}>Play Again</button>;
    }

    switch (stage) {
      case 0:
        return (
          <div>
            <button onClick={() => initializeGame()}>Start</button>
          </div>
        );
      case 1:
        return (
          <div>
            <button onClick={() => handleAnswer('North')}>North</button>
            <button onClick={() => handleAnswer('South')}>South</button>
          </div>
        );
      case 2:
        return (
          <div>
            <button onClick={() => handleAnswer('East')}>East</button>
            <button onClick={() => handleAnswer('West')}>West</button>
          </div>
        );
      case 3:
        return (
          <div>
            <button onClick={() => handleAnswer('Inside')}>Inside</button>
            <button onClick={() => handleAnswer('Outside')}>Outside</button>
          </div>
        );
      case 4:
        return (
          <div>
            {continents.map(continent => (
              <button key={continent} onClick={() => handleAnswer(continent)}>{continent}</button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ color: '#333' }}>Fly The Airbus</h1>
      <div style={{ minHeight: '50px' }}>
        <h2 style={{ color: '#555' }}>{currentQuestion}</h2>
        <p style={{ fontSize: '1.2em', color: '#666' }}>{message}</p>
      </div>
      {renderButtons()}
      <div>
        <h3>Your Hand</h3>
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100px' }}>
          {hand.map((country, index) => (
            <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px 20px', margin: '5px', backgroundColor: 'white' }}>
              <p style={{ margin: 0, fontSize: '1.5em' }}>{country.flag}</p>
              <p style={{ margin: 0 }}>{country.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
