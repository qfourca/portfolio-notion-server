const Sequelize = require("sequelize");

class Techstack extends Sequelize.Model {
  static initiate(sequelize) {
    Techstack.init(
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
        type: {
          type: Sequelize.STRING,
          allowNull: false,
          isIn: [["language", "framework", "library", "tool", "etc"]],
        },
        icon: {
          type: Sequelize.STRING,
        },
      },
      {
        sequelize,
        timestamps: true,
        createdAt: false,
        modelName: "Techstack",
        tableName: "techstacks",
      }
    );
  }

  static associate(db) {}
}

module.exports = Techstack;
