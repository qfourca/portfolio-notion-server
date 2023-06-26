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
        tag: {
          type: Sequelize.ENUM(
            "프로젝트",
            "MDA 인턴 프로젝트",
            "대표 프로젝트",
            "LEGACY"
          ),
          allowNull: true,
        },
        startAt: {
          type: Sequelize.DATE,
        },
        endAt: {
          type: Sequelize.DATE,
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

  static associate(db) {
    db.Project.belongsToMany(db.Techstack, {
      through: "TechstackNProject",
    });
  }
}

module.exports = Project;
