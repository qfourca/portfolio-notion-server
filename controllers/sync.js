const { getProjects, getTechstacks } = require("../util/notion/get");
const { Project, Techstack } = require("../models");

const sync = async (Model, id, updatedAt, info) => {
  const find = await Model.findOne({
    where: {
      uuid: id,
    },
    attributes: ["uuid", "updatedAt"],
  });
  if (find) {
    if (new Date(find.dataValues.updatedAt) < new Date(updatedAt)) {
      return {
        code: 1,
        result: await Model.update(
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
        ),
      };
    }
    return {
      code: 0,
      result: find,
    };
  } else {
    return {
      code: 2,
      result: await Model.create({
        ...info,
        uuid: id,
        updatedAt,
      }),
    };
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
          type: type.name,
        });
      })
    );
    await Promise.all(
      results
        .filter((v) => v.code >= req.body.relation ?? 1)
        .map(({ result }) => {
          return result.addProjects(
            techstacks
              .find(({ id }) => id === result.dataValues.uuid)
              .relation.relation.map(({ id }) => id)
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
