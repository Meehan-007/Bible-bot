const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Book extends Model {

}

Book.init(
    {
        book: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        chapterNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        verseNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sectionNumber: {    
            type: DataTypes.INTEGER,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'book'
    }
);
module.exports = Book;