interface _ClienteUsuario{
    _id: string,
    nombre: string,
    img: string
}

export class Cliente{
    constructor(
        public cedula: string,
        public nombre_completo: string,
        public direccion: string,
        public celular: string,
        public correo: number,
        public tipo_cliente: string,
        public img_public_id: string,
        public img_secure_url: string,
        public usuario?: _ClienteUsuario,
        public _id?: string
    ){}
}

