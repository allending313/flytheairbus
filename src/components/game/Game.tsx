import React from 'react';
import Map from "../map/Map";
import { useGameLogic } from '../../hooks/useGameLogic';
import { continents } from '../../utils/country.data';


const Game: React.FC = () => {
  const {
    hand,
    stage,
    currentQuestion,
    message,
    gameOver,
    initializeGame,
    handleMapClick,
    clickedCountry,
    handleAnswer
  } = useGameLogic();

  const renderButtons = () => {
    if (gameOver) {
      return <button onClick={() => initializeGame()}>Play Again</button>;
    }

    if (stage === 0) {
      return (
        <div>
          <button onClick={() => initializeGame()}>Start</button>
        </div>
      );
    }

    return null;
  };

  const renderChoiceButtons = () => {
    if (gameOver || stage === 0) {
      return null;
    }

    let choices: string[] = [];
    switch (stage) {
      case 1:
        choices = ['North', 'South'];
        break;
      case 2:
        choices = ['East', 'West'];
        break;
      case 3:
        choices = ['Inside', 'Outside'];
        break;
      case 4:
        choices = continents;
        break;
      default:
        break;
    }

    return (
      <div style={{ marginTop: '10px' }}>
        {choices.map(choice => (
          <button key={choice} onClick={() => handleAnswer(choice)} style={{ margin: '5px', padding: '10px 20px', fontSize: '1em' }}>
            {choice}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ color: '#333' }}>Fly The Airbus</h1>
      <div style={{ minHeight: '50px' }}>
        <h2 style={{ color: '#555' }}>{currentQuestion}</h2>
        <p style={{ fontSize: '1.2em', color: '#666' }}>{message}</p>
        {clickedCountry && <p>You clicked on {clickedCountry}</p>}
      </div>
      {renderButtons()}
      {stage > 0 && <Map onMapClick={gameOver ? () => {} : handleMapClick} />}
      {renderChoiceButtons()}
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
