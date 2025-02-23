import { Model, DataTypes } from 'sequelize';

import sequelize from '../config/connection.js';

class book extends Model {

}

book.init(
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
export default book;