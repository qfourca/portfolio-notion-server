const { getProjects } = require("../util/notion/get");

exports.syncProjects = async (req, res) => {
  try {
    console.log(await getProjects());
    return res.status(200).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server error occur at syncProjects",
    });
  }
};
