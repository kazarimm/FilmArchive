const readline = require("readline");
const axios = require("axios");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter your userId: ", (userId) => {
  rl.question("Enter IMDb ID of the film: ", async (imdbID) => {

    try {
      const response = await axios.post("http://localhost:8081/watchlist/add", {
        userId,
        imdbID
      });

      console.log("Response:", response.data);
    } catch (err) {
  if (err.response) {
    console.log("Status:", err.response.status);
    console.log("Data:", err.response.data);
  } else {
    console.log("Error:", err.message);
  }
}

    rl.close();
  });
});