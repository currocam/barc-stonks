import { useEffect, useState } from "react";

// Enum of tendency (up, down, stable)
export enum Tendency {
	Up,
	Down,
	Stable
}

export interface Drink {
	name: string;
	price: number;
	solds: number;
	max: number;
	min: number;
	tendency: Tendency;
	accumulator: number;
}

const CHANGE_TENDENCY_SECONDS = 2;
const CHANCES_OF_CHANGING_TENDENCY = 0.5;


// Format price to look beautiful
export function formatPrice(price: number) {
	return price.toFixed(2) + "kr";
}

function invisible_hand(drink: Drink) {
	// 1/10 chance of going from stable to up or down
	if (drink.tendency === Tendency.Stable && Math.random() < CHANCES_OF_CHANGING_TENDENCY) {
		drink.tendency = Math.random() < 0.5 ? Tendency.Up : Tendency.Down;
	}	
	// 1/5 chance of going from up or down to stable
	if (drink.tendency !== Tendency.Stable && Math.random() < 1 / 2) {
		drink.tendency = Tendency.Stable;
	}
	// If up, increase the price by a random number between 0.1 and 0.5
	if (drink.tendency === Tendency.Up) {
	  drink.price += Math.random() * 0.5;
	}
	// If down, decrease the price by a random number between 0.1 and 0.5
	if (drink.tendency === Tendency.Down) {
	  drink.price -= Math.random() * 0.5;
	}
  
	// Ensure price stays within the bounds of [min, max]
	drink.price = Math.max(drink.min, Math.min(drink.price, drink.max));
	
	return drink.price;
  }

// Read csv file and return a list of drinks

function mapTendency(tendencyValue: string): Tendency {
  switch (tendencyValue) {
    case 'Up':
      return Tendency.Up;
    case 'Down':
      return Tendency.Down;
    default:
      return Tendency.Stable; // Default value
  }
}

function readDrinks() {
  const [drinks, setDrinks] = useState<Drink[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data.csv');
        const data = await response.text();
        const rows = data.split('\n');

        const drinkArray = rows
          .slice(1) // Skip the header row if it's present
          .map((row) => {
            const [name, price, solds, max, min, tendency] = row.split(',');
            return {
              name: name,
              price: Number(price),
              solds: Number(solds),
              max: Number(max),
              min: Number(min),
              tendency: mapTendency(tendency),
							accumulator : 0
            };
          });

        setDrinks(drinkArray);
      } catch (error) {
        console.error('Error reading CSV file:', error);
      }
    }

    fetchData();
  }, []);

  return drinks;
}


export function useDrinks() {
	const a: Drink[] = [];
	// Add drinks to the state
	const [drinks, setDrinks] = useState<Drink[]>(a);
	// Add drinks from csv file to the state
	const drinks_csv = readDrinks();
	drinks_csv.forEach(drink => {
		if (!drinks.some(d => d.name === drink.name)) {
			drinks.push(drink);
		}
	});

	useEffect(() => {
    const interval = setInterval(() => {
      setDrinks((prevDrinks) =>
        prevDrinks.map((drink) => ({
          ...drink,
          price: invisible_hand(drink), // Apply the price reduction logic
        }))
      );
    }, CHANGE_TENDENCY_SECONDS * 1000); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, []);

  const reducePrices = () => {
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) => ({
        ...drink,
        price: Math.max(drink.price - 0.5, drink.min), // Reduce by 0.5 or to the minimum price
				accumulator: drink.accumulator - 1
      }))
    );
		// If accumulator is negative, reset it to 0 and change tendency
		setDrinks((prevDrinks) =>
			prevDrinks.map((drink) => ({
				...drink,
				tendency: drink.accumulator < -3 ? Tendency.Down : drink.tendency,
				accumulator: drink.accumulator < -3 ? 0 : drink.accumulator
			}))
		);
		setDrinks((prevDrinks) =>
			prevDrinks.map((drink) => ({
				...drink,
				tendency: drink.accumulator > 3 ? Tendency.Up : drink.tendency,
				accumulator: drink.accumulator > 3 ? 0 : drink.accumulator,
			}))
		);
  };

  return { drinks, reducePrices };
}



