const Koa = require("koa");
const parser = require("koa-bodyparser");
const cors = require("@koa/cors");
const Router = require("koa-router");
const router = new Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/daily/:sign", async (ctx) => {
  if (!ctx.params.sign) {
    ctx.status = 400;
    ctx.body = {
      error: "No sign provided",
    };
    return;
  }

  const url = "https://www.astrology.com/horoscope/daily/";

  try {
    const response = await axios.get(`${url}${ctx.params.sign}.html`);
    const html = response.data;
    const $ = cheerio.load(html);
    const content = $("#content p").text();
    ctx.body = {
      sign: ctx.params.sign,
      horoscope: content,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = "Error fetching daily horoscope";
  }
});

const app = new Koa();
app.use(parser());
app.use(cors());
app.use(router.routes());

app.listen(8080, () => {
  console.log("Server running on port 3000");
});
