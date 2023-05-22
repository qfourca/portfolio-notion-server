const { getProjects } = require("../util/notion/get");
const { Project } = require("../models");

const syncProject = async (id, updatedAt, info) => {
  const find = await Project.findOne({
    where: {
      uuid: id,
    },
    attributes: ["updatedAt"],
  });
  if (find) {
    if (new Date(find.dataValues.updatedAt) < new Date(updatedAt)) {
      await Project.update(
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
    await Project.create({
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
          return syncProject(project.id, project.updatedAt, {
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
