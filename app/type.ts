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

export type TRooms = {
  id: number,
  tenPhong: string,
  khach: number,
  phongNgu: number,
  giuong: number,
  phongTam: number,
  moTa: string,
  giaTien: number,
  mayGiat: boolean,
  banLa: boolean,
  tivi: boolean,
  dieuHoa: boolean,
  wifi: boolean,
  bep: boolean,
  doXe: boolean,
  hoBoi: boolean,
  banUi: boolean,
  maViTri: number,
  hinhAnh: string
}

// modal type
export type ModalCmpsProps = {
    open: boolean;
    title?: React.ReactNode;
    okText?: React.ReactNode;
    onOk?: () => void;
    onCancel?: () => void;
    children: React.ReactNode;
}

//Admin function types
export type EditProps = {
  open: boolean;
  target: TUser| TCity | TRooms|null;
  onCancel: () => void;
  onSuccess: () => void;
};

export type AddProps = {
  onSuccess: () => void;
};

export type DeleteProps = {
  id: number | null;
  onSuccess: () => void;
  children: React.ReactNode;
};

