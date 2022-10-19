import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {J2AligamxDataSource} from '../datasources';
import {Usuarios, UsuariosRelations} from '../models';

export class UsuariosRepository extends DefaultCrudRepository<
  Usuarios,
  typeof Usuarios.prototype.CorreoElectronico,
  UsuariosRelations
> {
  constructor(
    @inject('datasources.j2aligamx') dataSource: J2AligamxDataSource,
  ) {
    super(Usuarios, dataSource);
  }
}
