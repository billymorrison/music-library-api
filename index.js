const app = require('./src/app');

const APP_PORT = 4000;

app.listen(APP_PORT, () => {
    console.log(`Now serving your express app at http://localhost:${APP_PORT}`)
});