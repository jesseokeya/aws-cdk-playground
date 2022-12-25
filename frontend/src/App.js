import React, { useState } from "react";

function App() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    fetch(`https://enlearacademy.tk/generate/${number}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setResult(data.output);
        setNumber("");
      })
      .catch(function (error) {
        console.log("Error in fetching weather data");
      });
  };

  return (
    <div className="App">
      <h2>Fibonacci Generator 1.0v</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <label>Number: </label>
        <input type="text" onChange={(e) => setNumber(e.target.value)} />
        <button type="submit">Generate</button>
        <hr />
        <h2>Result: {result}</h2>
      </form>
    </div>
  );
}

export default App;
