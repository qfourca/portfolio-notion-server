const notion = require("./client");

const projectMatch = new Map([
  ["dhB%3B", "techstack"],
  ["pjmR", "reward"],
  ["rnVx", "date"],
  ["title", "title"],
]);

exports.getProjects = async () => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_PROJECT_DB,
  });
  const result = new Array();
  response.results.forEach((res) => {
    const append = {
      id: res.id,
      thumbnail: res.cover.file.url,
      updatedAt: res.last_edited_time,
    };

    Object.keys(res.properties).forEach((key) => {
      const pro = res.properties[key];
      const get = projectMatch.get(pro.id);
      if (get != undefined) {
        append[get] = pro;
      }
    });
    result.push(append);
  });
  return result;
};

const techstackMatch = new Map([
  ["title", "title"],
  ["of%5Ct", "type"],
  ["SJ%3FQ", "relation"],
]);
exports.getTechstacks = async () => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_TECHSTACK_DB,
  });
  const result = new Array();
  response.results.forEach((res) => {
    const append = {
      id: res.id,
      icon: res.icon,
    };
    Object.keys(res.properties).forEach((key) => {
      const pro = res.properties[key];
      const get = techstackMatch.get(pro.id);
      if (get != undefined) {
        append[get] = pro;
      }
    });
    result.push(append);
  });
  return result;
};
