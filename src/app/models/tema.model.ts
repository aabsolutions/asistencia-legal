interface _TemaUser{
    _id: string,
    nombre: string,
    img: string
}

interface _TemaCliente{
    _id: string,
    nombre_completo: string,
}

export class Tema{
    constructor(
        public asunto: string,
        public texto: string,
        public fecha: string,
        public cliente: _TemaCliente,
        public _id?: string,
        public usuario?: _TemaUser,
        public adjunto?: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ){}
}