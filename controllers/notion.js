let notion;

import("notion-client").then(({ NotionAPI }) => {
  notion = new NotionAPI();
});

exports.page = async (req, res) => {
  try {
    const recordMap = await notion.getPage(req.query.page);
    return res.status(200).json(recordMap);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server error occur at notion/page",
    });
  }
};
