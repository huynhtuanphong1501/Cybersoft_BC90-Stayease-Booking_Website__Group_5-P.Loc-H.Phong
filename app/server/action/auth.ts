import api from "@/app/service/api";
import type { AuthUser } from "@/app/type";

export const fetchData = async (user:AuthUser ) => {
    try {
    const response = await api.post("auth/signin", user);
      return response.data.content;
    } catch (error) {
      console.log(error);
    }
};