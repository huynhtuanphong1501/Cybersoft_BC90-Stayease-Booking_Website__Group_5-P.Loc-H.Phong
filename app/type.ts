import { AxiosError } from "axios";

// type state của api
export type InitState<T> = {
  loading: boolean;
  data: T | null;
  error: AxiosError<any> | null;
};

// type ai trả về (response)
export type TApiResponse<T> = {
  statusCode: number;
  message: string;
  content: T;
};

// type login
export type AuthUser = {
    email: string;
    password: string;
 }

export interface TDestination {
    id: number;
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    hinhAnh: string;
}

export interface TUser {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: number | null;
    birthday: string;
    avatar: string | null;
    gender: boolean;
    role: string;
}

export interface TCity {
    id: number;
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    hinhAnh: string;
}

export interface CityNameProps {
    params: Promise<{ id: string }>
}

export interface DetailRoomProps {
    params: Promise<{
        id: string
    }>
}

