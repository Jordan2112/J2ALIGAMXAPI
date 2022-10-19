import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {J2AligamxDataSource} from '../datasources';
import {PreferenciasUsuario, PreferenciasUsuarioRelations} from '../models';

export class PreferenciasUsuarioRepository extends DefaultCrudRepository<
  PreferenciasUsuario,
  typeof PreferenciasUsuario.prototype.IdPreferencias,
  PreferenciasUsuarioRelations
> {
  constructor(
    @inject('datasources.j2aligamx') dataSource: J2AligamxDataSource,
  ) {
    super(PreferenciasUsuario, dataSource);
  }
}
