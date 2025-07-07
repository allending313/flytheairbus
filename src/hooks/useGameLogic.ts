import { useState } from 'react';
import { countries } from '../utils/country.data';
import type { Country } from '../types/game.types';
import { LatLng } from 'leaflet';
import { getCountryFromLatLng } from '../utils/reverseGeocode';

function shuffleCountries() {
  const shuffled = [...countries];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const useGameLogic = () => {
  const [deck, setDeck] = useState<Country[]>([]);
  const [hand, setHand] = useState<Country[]>([]);
  const [stage, setStage] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [clickedCountry, setClickedCountry] = useState<string | null>(null);

  const initializeGame = () => {
    setDeck(shuffleCountries());
    setHand([]);
    setStage(1);
    setCurrentQuestion('Round 1: North or South Hemisphere?');
    setMessage('Guess the hemisphere of the next country.');
    setGameOver(false);
    setClickedCountry(null);
  };

  const handleAnswer = (answer: string) => {
    const nextCountry = deck.pop();
    if (!nextCountry) {
      throw new Error("failed to initialize deck of countries")
    }

    let isCorrect = false;

    switch (stage) {
      case 1: // North or South Hemisphere?
        isCorrect = (answer === 'North' && nextCountry.latitude >= 0) || (answer === 'South' && nextCountry.latitude < 0);
        break;
      case 2: // East or West of Round 1 country?
        if (!hand[0]) break;
        isCorrect = (answer === 'East' && nextCountry.longitude > hand[0].longitude) || (answer === 'West' && nextCountry.longitude < hand[0].longitude);
        break;
      case 3: // Inside or Outside of longitudes of two prior countries?
        { if (!hand[0] || !hand[1]) break;
        const minLong = Math.min(hand[0].longitude, hand[1].longitude);
        const maxLong = Math.max(hand[0].longitude, hand[1].longitude);
        isCorrect = (answer === 'Inside' && nextCountry.longitude > minLong && nextCountry.longitude < maxLong) ||
                    (answer === 'Outside' && (nextCountry.longitude < minLong || nextCountry.longitude > maxLong));
        break; }
      case 4: // Continent of the last country?
        isCorrect = (answer === nextCountry.continent);
        break;
      default:
        break;
    }

    if (isCorrect) {
      setMessage('Correct!');
    } else {
      setMessage(`Wrong! The country was ${nextCountry.name} ${nextCountry.flag}.`);
      setGameOver(true)
    }

    setHand(prev => [...prev, nextCountry]);

    if (stage < 4) {
      setStage(r => r + 1);
      switch (stage + 1) {
        case 2: setCurrentQuestion('Round 2: East or West of the previous country?'); break;
        case 3: setCurrentQuestion('Round 3: Inside or Outside the longitudes of the first two countries?'); break;
        case 4: setCurrentQuestion('Round 4: What continent is this country in?'); break;
      }
    } else {
      setGameOver(true);
    }
  };

  const handleMapClick = (latlng: LatLng) => {
    const countryName = getCountryFromLatLng(latlng);
    setClickedCountry(countryName);

    if (stage === 1) {
      if (latlng.lat > 0) {
        handleAnswer('North');
      } else {
        handleAnswer('South');
      }
    } else if (stage === 2) {
      if (!hand[0]) return;
      if (latlng.lng > hand[0].longitude) {
        handleAnswer('East');
      } else {
        handleAnswer('West');
      }
    } else if (stage === 3) {
      if (!hand[0] || !hand[1]) return;
      const minLong = Math.min(hand[0].longitude, hand[1].longitude);
      const maxLong = Math.max(hand[0].longitude, hand[1].longitude);
      if (latlng.lng > minLong && latlng.lng < maxLong) {
        handleAnswer('Inside');
      } else {
        handleAnswer('Outside');
      }
    } else if (stage === 4) {
      if (countryName) {
        const clickedCountryData = countries.find(c => c.name === countryName);
        if (clickedCountryData) {
          handleAnswer(clickedCountryData.continent);
        } else {
          handleAnswer('Unknown');
        }
      } else {
        handleAnswer('Unknown');
      }
    }
  };

  return {
    deck,
    hand,
    stage,
    currentQuestion,
    message,
    gameOver,
    handleAnswer,
    initializeGame,
    handleMapClick,
    clickedCountry
  };
};
