import { initializeDatabase } from "./config/db.config.js";
import app from "./app.js";

initializeDatabase().then(() => {
  app.listen(8080, (): void => {
    console.log('Task Manager Backend');
    console.log('Server running on port 8080');
  });
});
