import {belongsTo, Entity, Model, model, property} from '@loopback/repository';
import { Usuarios } from './usuarios.model';

@model({settings: {strict: false}})
export class PreferenciasUsuario extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  IdPreferencias?: number;

  @property({
    type: 'string',
    required: true,
  })
  EquipoFavorito: string;

  @property({
    type: 'string',
  })
  Lenguaje?: string;

  @property({
    type: 'string',
  })
  Fondo?: string;

  @belongsTo(()=>Usuarios)
  usuarios : string;
  
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PreferenciasUsuario>) {
    super(data);
  }
}

export interface PreferenciasUsuarioRelations {
  // describe navigational properties here
}

export type PreferenciasUsuarioWithRelations = PreferenciasUsuario & PreferenciasUsuarioRelations;
