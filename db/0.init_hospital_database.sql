-- Connect via your admin account created with '0.init_create_your_admin_user.sql'

-- Create hospital database's tables
CREATE TABLE DONVI(
ID_DONVI VARCHAR2(50)NOT NULL,
TENDV NVARCHAR2(50),
MAPHONG VARCHAR2(50),
CONSTRAINT DONVI_PK PRIMARY KEY(ID_DONVI)
);
/
CREATE TABLE NHANVIEN(
ID_NHANVIEN VARCHAR2(50) NOT NULL,
TENNV NVARCHAR2(50) NOT NULL,
SDT VARCHAR2(50),
DIACHI NVARCHAR2(50),
GIOITINH NVARCHAR2(10),
NGAYSINH DATE,
LUONG NUMBER(9),
VAITRO NVARCHAR2(50),
DONVI VARCHAR2(50),
CONSTRAINT NHANVIEN_PK PRIMARY KEY (ID_NHANVIEN),
CONSTRAINT FK_DONVI_NHANVIEN FOREIGN KEY (DONVI) REFERENCES DONVI(ID_DONVI)
)
/
CREATE TABLE BENHNHAN(
ID_BENHNHAN VARCHAR2(50) NOT NULL,
HOTEN NVARCHAR2(50),
NGAYSINH DATE,
SDT VARCHAR2(50),
DIACHI NVARCHAR2(50),
GIOITINH NVARCHAR2(10),
NGHENGHIEP NVARCHAR2(50),
NOILAMVIEC NVARCHAR2(100),
SDTNGUOITHAN VARCHAR2(50),
CONSTRAINT BENHNHAN_PK PRIMARY KEY(ID_BENHNHAN)
);
/
CREATE TABLE HOSOBENHNHAN(
ID_KHAMBENH VARCHAR2(50),
NGAYKB DATE,
ID_BENHNHAN VARCHAR2(50),
TINHTRANGBD NVARCHAR2(100),
KETLUANBS NVARCHAR2(100),
MATT VARCHAR2(50),
MABS VARCHAR2(50),
CONSTRAINT HOSOBENHNHAN_PK PRIMARY KEY(ID_KHAMBENH),
CONSTRAINT FK_BENHNHAN_HOSOBENHNHAN FOREIGN KEY(ID_BENHNHAN)REFERENCES BENHNHAN(ID_BENHNHAN),
CONSTRAINT FK_NV_BACSI_HOSOBENHNHAN FOREIGN KEY(MABS) REFERENCES NHANVIEN(ID_NHANVIEN),
CONSTRAINT FK_NV_TIEPTAN_HOSOBENHNHAN FOREIGN KEY(MATT) REFERENCES NHANVIEN(ID_NHANVIEN)
);
/
CREATE TABLE DICHVU(
ID_DICHVU VARCHAR2(50),
TENDV NVARCHAR2(50),
DONGIA NUMBER(9,2),
CONSTRAINT DICHVU_PK PRIMARY KEY(ID_DICHVU)
);
/
CREATE TABLE HOSO_DICHVU(
ID_KHAMBENH VARCHAR2(50),
ID_DICHVU VARCHAR2(50),
NGAYGIO TIMESTAMP,
NGUOITHUCHIEN VARCHAR(50),
KETLUAN NVARCHAR2(100),
CONSTRAINT HS_DV_PK PRIMARY KEY(ID_KHAMBENH,ID_DICHVU),
CONSTRAINT FK_HOSOBENHNHAN_HS_DV FOREIGN KEY (ID_KHAMBENH) REFERENCES HOSOBENHNHAN(ID_KHAMBENH),
CONSTRAINT FK_DICHVU_HS_DV FOREIGN KEY (ID_DICHVU) REFERENCES DICHVU(ID_DICHVU),
CONSTRAINT FK_NHANVIEN_HS_DV FOREIGN KEY(NGUOITHUCHIEN) REFERENCES NHANVIEN(ID_NHANVIEN)
);
/
CREATE TABLE DONTHUOC(
ID_KHAMBENH VARCHAR2(50),
ID_DONTHUOC VARCHAR2(50),
NVPT VARCHAR2(50),
CONSTRAINT DONTHUOC_PK PRIMARY KEY(ID_DONTHUOC),
CONSTRAINT FK_HOSOBENHNHAN_DONTHUOC FOREIGN KEY(ID_KHAMBENH) REFERENCES HOSOBENHNHAN(ID_KHAMBENH),
CONSTRAINT FK_NHANVIEN_DONTHUOC FOREIGN KEY (NVPT) REFERENCES NHANVIEN(ID_NHANVIEN)
);
/
CREATE TABLE THUOC(
ID_THUOC VARCHAR2(50),
TENTHUOC NVARCHAR2(50),
DVT VARCHAR2(50),
DONGIA NUMBER(9,2),
LUUY NVARCHAR2(100),
XUATXU NVARCHAR2(50),
CONGDUNG NVARCHAR2(100),
CONSTRAINT THUOC_PK PRIMARY KEY(ID_THUOC)
);
/
CREATE TABLE CHITIETDONTHUOC(
ID_DONTHUOC VARCHAR2(50),
ID_THUOC VARCHAR2(50),
SOLUONG NUMBER (9),
LIEUDUNG NUMBER(9),
MOTA NVARCHAR2(100),
CONSTRAINT CT_DONTHUOC_PK PRIMARY KEY(ID_DONTHUOC,ID_THUOC),
CONSTRAINT FK_DONTHUOC_CTDONTHUOC FOREIGN KEY (ID_DONTHUOC) REFERENCES DONTHUOC(ID_DONTHUOC),
CONSTRAINT FK_THUOC_CTDONTHUOC FOREIGN KEY (ID_THUOC) REFERENCES THUOC(ID_THUOC)
);
/
CREATE TABLE HOADON(
ID_HOADON VARCHAR2(50),
ID_KHAMBENH VARCHAR2(50),
NGAYHD DATE,
NGUOIPT VARCHAR2(50),
TONGTIEN NUMBER(9),
CONSTRAINT HOADON_PK PRIMARY KEY(ID_HOADON),
CONSTRAINT FK_HOSOBENHNHAN_HOADON FOREIGN KEY (ID_KHAMBENH) REFERENCES HOSOBENHNHAN(ID_KHAMBENH),
CONSTRAINT FK_NHANVIEN_HOADON FOREIGN KEY (NGUOIPT) REFERENCES NHANVIEN(ID_NHANVIEN)
);
/
CREATE TABLE CTHOADON(
ID_HOADON VARCHAR2(50),
ID_DICHVU VARCHAR2(50),
CONSTRAINT CTHOADON_PK PRIMARY KEY(ID_HOADON,ID_DICHVU),
CONSTRAINT FK_HOADON_CTHOADON FOREIGN KEY (ID_HOADON) REFERENCES HOADON(ID_HOADON),
CONSTRAINT FK_DICHVU_CTHOADON FOREIGN KEY (ID_DICHVU) REFERENCES DICHVU(ID_DICHVU)
);
/
CREATE TABLE THANGNAM(
THANG NUMBER(2),
NAM NUMBER(4),
CONSTRAINT THANGNAM_PK PRIMARY KEY(THANG,NAM)
)
/
CREATE TABLE CHAMCONG(
ID_NHANVIEN VARCHAR2(50),
THANG NUMBER(2),
NAM NUMBER(4),
SONGAYCONG NUMBER(9,1)
);

/