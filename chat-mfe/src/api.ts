
import axios from "axios";

const createAPI = (token?: string) => {
    return axios.create({
        baseURL: "http://localhost:3000/api",
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    });
};

export default createAPI;
