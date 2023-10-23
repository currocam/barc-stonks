import pumpkin from './assets/pumpkin.svg'
import barcLogo from './assets/logo.png'
import { DrinkCard } from './drinks/DrinkCard'
import { useDrinks } from './drinks/useDrinks'
import './App.css'


function App() {
  const { drinks, reducePrices } = useDrinks();

  return (
    <>
      <div>
        <img src={barcLogo} className="logo" alt="BaRC logo" />
        <img src={pumpkin} className="logo" alt="Pumpkin" />
      </div>
      <h1 className="title">BaRC Stock Market</h1>
      <h2 className="subtitle">Halloween edition</h2>
      <h4>Current products</h4>
      <div className="drink-card-container">
        {drinks.map((drink) => (
          <DrinkCard key={drink.name} drink={drink} reducePrices={reducePrices} />
        ))}
      </div>
    </>
  )
}

export default App
