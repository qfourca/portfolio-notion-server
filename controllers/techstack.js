const { getTechstacks } = require("../util/notion/get");
const { Techstack } = require("../models");
const sync = require("../util/sync/sync");

const generateS3Key = (uuid) => `${"techstack"}/${"icon"}/${uuid}`;

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
        .filter((v) => v.code >= req.body.file ?? 1)
        .map(({ result }) => {
          const tech = techstacks.find(
            ({ id }) => id === result.dataValues.uuid
          );
          const icon = tech.icon.file.url;
          return require("../util/s3/uploadFile")(
            generateS3Key(result.dataValues.uuid),
            icon
          );
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

exports.listTechstacks = async (req, res) => {
  try {
    const list = (
      await Techstack.findAll({
        attributes: ["uuid", "title", "type"],
      })
    ).map((result) => result.dataValues);

    const icons = await Promise.all(
      list.map((techstack) => {
        return require("../util/s3/makeUrl")(generateS3Key(techstack.uuid));
      })
    );

    for (let i = 0; i < list.length; i++) {
      list[i].icon = icons[i];
    }

    return res.status(200).json(list);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server error occur at listTechstacks",
    });
  }
};
