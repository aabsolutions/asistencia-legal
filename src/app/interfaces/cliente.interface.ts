import { Cliente } from "../models/cliente.model";

export interface CargarCliente{
    total: number;
    clientes: Cliente[];
}