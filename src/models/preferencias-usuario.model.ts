import {User} from '@loopback/authentication-jwt';
import {belongsTo, Entity, model, property} from '@loopback/repository';

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
  idEquipoFavorito: string;

  @property({
    type: 'string',
  })
  NombreEquipo?: string;

  @property({
    type: 'string',
  })
  LogoEquipo?: string;

  @belongsTo(()=>User)
  idUser : string;

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
