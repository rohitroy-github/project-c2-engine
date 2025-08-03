const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "assets/nft-metadata")));

app.get("/", (req, res) => {
  res.send("Clash NFT Metadata Server Running...");
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
