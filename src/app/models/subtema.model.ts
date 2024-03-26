interface _SubtemaUser{
    _id: string,
    nombre: string,
    img: string
}

interface _SubtemaTema{
    _id: string,
    asunto: string,
}

export class Subtema{
    constructor(
        public asunto: string,
        public texto: string,
        public fecha: string,
        public tema: string,
        public _id?: string,
        public usuario?: _SubtemaUser,
        public adjunto?: string
    ){}
}