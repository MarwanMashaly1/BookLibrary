const express = require("express");
const { createRequestHandler } = require("@remix-run/express");
const process = require("process");

const app = express();

app.use(express.static("public"));

app.all(
  "*",
  createRequestHandler({
    getLoadContext() {
      // Whatever you return here will be passed as `context` to your loaders.
    },
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
