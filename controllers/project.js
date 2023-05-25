const { getProjects } = require("../util/notion/get");
const { Project } = require("../models");
const sync = require("../util/sync/sync");

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

    await Promise.all(
      results
        .filter((v) => v.code >= req.body.file ?? 1)
        .map(({ result }) => {
          const thumbnail = projects.find(
            ({ id }) => id === result.dataValues.uuid
          ).thumbnail;
          return require("../util/s3/uploadFile")(
            `${"project"}/${"thumbnail"}/${result.dataValues.uuid}`,
            thumbnail
          );
        })
    );

    await Promise.all(
      results
        .filter((v) => v.code >= req.body.relation ?? 1)
        .map(({ result }) => {
          return result.addTechstacks(
            projects
              .find(({ id }) => id === result.dataValues.uuid)
              .techstack.relation.map(({ id }) => id)
          );
        })
    );
    return res.status(200).json({
      update: results.filter((v) => v.code === 1).length,
      create: results.filter((v) => v.code === 2).length,
      nothing: results.filter((v) => v.code === 0).length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server error occur at syncProjects",
    });
  }
};
