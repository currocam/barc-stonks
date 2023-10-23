import styles from "./DrinkCard.module.scss";
import { Drink, Tendency, formatPrice } from "./useDrinks";

export function DrinkCard({ drink, reducePrices }: { drink: Drink, reducePrices: () => void }) {
  const handleIncreaseSolds = () => {
    drink.solds += 1;
    drink.price += 1.5;
    drink.accumulator += 2;
    // Reduce prices of all drinks by 0.5
    reducePrices();
  };
  console.log(drink);
  return (
    <div className={styles.drinkCard}>
      <div>
        {drink.name}. Price: {formatPrice(drink.price)}kr. N. of solds: {drink.solds}
        {
          (() => {
            switch (drink.tendency) {
              case Tendency.Up:
                return "📈";
              case Tendency.Down:
                return "📉";
              case Tendency.Stable:
                return "➡️";
              default:
                return "❓"; // Optional: Display a question mark for unknown tendencies
            }
          })()
        }
      </div>
      <button onClick={handleIncreaseSolds}>Increase Solds</button>
    </div>
  );
}

