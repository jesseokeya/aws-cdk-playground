const express = require("express");

const app = express();

// Calculating the fibonacci value
const fib = (n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
};

// Memoized and optimized version of the fibonacci function
const fibMemoized = (n, memo = new Map()) => {
  if (memo.has(n)) return memo.get(n);
  if (n <= 1) return n;
  const result = fibMemoized(n - 1, memo) + fibMemoized(n - 2, memo);
  memo.set(n, result);
  return result;
};

// Check if the server is healthy
const healthCheck = (_, res) => {
  res.status(200);
  res.send("healthy");
};

// Generate fibonacci number
const generateNumber = (req, res) => {
  let output = 0;

  try {
    const number = parseInt(req.params.number);
    // if (number) output = fib(number);
    if (number) output = fibMemoized(number);
  } catch (e) {
    res.send("Error");
  }

  res.json({ output });
};

// Root endpoint
app.get("/", (_, res) => res.send("👾"));

// Health check endpoint
app.get("/health", healthCheck);

// Generate fibonacci number endpoint
app.get("/generate/:number", generateNumber);

app.listen(80, () => console.log("Server listening on port 80 🚀 "));
