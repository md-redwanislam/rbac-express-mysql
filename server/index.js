import app from "./app.js";
import config from "./configs/config.js";
import { testConnection } from "./configs/db.js";

const port = config.app.port;

app.listen(port, () => {
  testConnection();
  console.log(`Server is running on http://localhost:${port}`);
});
