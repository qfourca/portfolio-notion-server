const { getProjects } = require("../util/notion/get");
const { Project } = require("../models");
const sync = require("../util/sync/sync");

const generateS3Key = (uuid) => `${"project"}/${"thumbnail"}/${uuid}`;

exports.syncProjects = async (req, res) => {
  try {
    const projects = await getProjects();
    const results = await Promise.all(
      projects.map((project) => {
        return (() => {
          const title = project.title[project.title.type][0];
          if (title == null) return { code: -1 };
          const { start, end } = project.date[project.date.type];
          return sync(Project, project.id, project.updatedAt, {
            title: title.plain_text,
            thumbnail: "",
            tag: project.tag.select.name,
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
            generateS3Key(result.dataValues.uuid),
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

exports.listProjects = async (req, res) => {
  try {
    const list = (
      await Project.findAll({
        attributes: ["uuid", "title", "startAt", "endAt"],
      })
    ).map((result) => result.dataValues);

    const thumbnails = await Promise.all(
      list.map((techstack) => {
        return require("../util/s3/makeUrl")(generateS3Key(techstack.uuid));
      })
    );
    for (let i = 0; i < list.length; i++) {
      list[i].thumbnail = thumbnails[i];
    }
    return res.status(200).json(list);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server error occur at listProjects",
    });
  }
};
