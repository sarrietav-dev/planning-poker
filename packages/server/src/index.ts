import Express from "express";

const app = Express();

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
