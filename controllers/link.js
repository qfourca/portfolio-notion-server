const { getProjects } = require("../util/notion/get");
const db = require("../models");

exports.linkTechstackNProject = async (req, res) => {
  try {
    const projects = await getProjects();
    projects.forEach((proj) => {
      const projuuid = proj.id;
      proj.techstack.relation.forEach(({ id }) => {
        db.sequelize.models.TechstackNProject.create({
          ProjectUuid: projuuid,
          TechstackUuid: id,
        });
      });
    });
    return res.status(200).json({});
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server error occur at linkTechstackNProject",
    });
  }
};
