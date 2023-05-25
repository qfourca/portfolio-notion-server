module.exports = async (Model, id, updatedAt, info) => {
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
