const Sequelize = require("sequelize");

class Project extends Sequelize.Model {
  static initiate(sequelize) {
    Project.init(
      {
        uuid: {
          type: Sequelize.STRING(36),
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        thumbnail: {
          type: Sequelize.STRING,
        },
      },
      {
        sequelize,
        timestamps: true,
        createdAt: false,
        modelName: "Project",
        tableName: "projects",
      }
    );
  }

  static associate(db) {}
}

module.exports = Project;
