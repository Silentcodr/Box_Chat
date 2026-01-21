import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class User extends Model {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public avatar!: string;
    public bio!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: "https://via.placeholder.com/150",
        },
        bio: {
            type: DataTypes.STRING,
            defaultValue: "Hello, I am using Box Chat!",
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
    }
);

export default User;
