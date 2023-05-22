const { Client } = require("@notionhq/client");

module.exports = new Client({
  auth: process.env.NOTION_DB_KEY,
});
