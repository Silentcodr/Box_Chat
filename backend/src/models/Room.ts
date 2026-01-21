import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Room extends Model {
    public id!: number;
    public name!: string;
    public protected!: boolean;
    public password!: string;
    public creator!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Room.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        protected: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        creator: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Room",
        tableName: "rooms",
    }
);

export default Room;
