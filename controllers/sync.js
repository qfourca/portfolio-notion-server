const { getProjects, getTechstacks } = require("../util/notion/get");
const { Project, Techstack } = require("../models");

const sync = async (Model, id, updatedAt, info) => {
  const find = await Model.findOne({
    where: {
      uuid: id,
    },
    attributes: ["updatedAt"],
  });
  if (find) {
    if (new Date(find.dataValues.updatedAt) < new Date(updatedAt)) {
      await Model.update(
        {
          ...info,
          uuid: id,
          updatedAt,
        },
        {
          where: {
            uuid: id,
          },
        }
      );
      return 1;
    }
    return 0;
  } else {
    await Model.create({
      ...info,
      uuid: id,
      updatedAt,
    });
    return 2;
  }
};

exports.syncProjects = async (req, res) => {
  try {
    const projects = await getProjects();

    const results = await Promise.all(
      projects.map((project) => {
        return (() => {
          const title = project.title[project.title.type][0];
          const { start, end } = project.date[project.date.type];
          return sync(Project, project.id, project.updatedAt, {
            title: title.plain_text,
            thumbnail: "",
            startAt: start,
            endAt: end,
          });
        })();
      })
    );

    return res.status(200).json({
      update: results.filter((v) => v === 1).length,
      create: results.filter((v) => v === 2).length,
      nothing: results.filter((v) => v === 0).length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server error occur at syncProjects",
    });
  }
};

exports.syncTechstacks = async (req, res) => {
  try {
    const techstacks = await getTechstacks();
    const results = await Promise.all(
      techstacks.map((techstack) => {
        const title = techstack.title[techstack.title.type][0];
        const type = techstack.type[techstack.type.type];
        return sync(Techstack, techstack.id, techstack.updatedAt, {
          title: title.plain_text,
          icon: "",
          type: techstack.type[techstack.type.type].name,
        });
      })
    );
    return res.status(200).json({
      update: results.filter((v) => v === 1).length,
      create: results.filter((v) => v === 2).length,
      nothing: results.filter((v) => v === 0).length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server error occur at syncProjects",
    });
  }
};
