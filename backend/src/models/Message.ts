import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Message extends Model {
    public id!: number;
    public roomId!: number;
    public sender!: string;
    public senderId!: number;
    public content!: string;
    public readonly createdAt!: Date;
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Message",
        tableName: "messages",
    }
);

export default Message;
