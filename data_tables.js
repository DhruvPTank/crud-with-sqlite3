const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'notes.db',
});

const Users = sequelize.define('Users', {
    Uid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    tableName: 'dbUsers',
    timestamps: false,
});

const Tasks = sequelize.define('Tasks', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'Uid',
        },
    },
    task: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
}, {
    freezeTableName: true,
    tableName: 'myTasks',
    timestamps: false,
}
);

sequelize.sync({ force: true });

module.exports = {
    sequelize,
    Users,
    Tasks
};



     1
    232
   34543
  4567654