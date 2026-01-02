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
    params: Promise<{ id: number }>;
}
