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
    phone: string | null;
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

export interface TBooking {
    id: number;
    maPhong: number;
    ngayDen: string;
    ngayDi: string;
    soLuongKhach: number;
    roomDetails?: any;
};

export interface TComment {
    id: number;
    ngayBinhLuan: string;
    noiDung: string;
    saoBinhLuan: number;
    tenNguoiBinhLuan: string;
    avatar?: string;
}

export type ModalCmpsProps = {
    open: boolean;
    title?: React.ReactNode;
    okText?: React.ReactNode;
    onOk?: () => void;
    onCancel?: () => void;
    children: React.ReactNode;
}