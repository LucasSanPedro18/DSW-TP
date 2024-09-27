import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { eventoRouter } from './evento/evento.routes.js';
import { cuentaRouter } from './cuenta/cuenta.routes.js';
import { tipoEntradaRouter } from './tipoEntrada/tipoEntrada.routes.js';
import { paisRouter } from './pais/pais.routes.js';
import { organizadorRouter } from './organizador/organizador.routes.js';
import { usuarioRouter } from './usuario/usuario.routes.js';
import { ubicacionRouter } from './ubicacion/ubicacion.routes.js';
import { localidadRouter } from './localidad/localidad.routes.js';
import { entradaRouter } from './entrada/entrada.routes.js';
import { categoriaRouter } from './categoria/categoria.routes.js';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
app.use(cors());
app.use('/api/entrada', entradaRouter);
app.use('/api/eventos', eventoRouter);
app.use('/api/cuentas', cuentaRouter);
app.use('/api/tiposEntradas', tipoEntradaRouter);
app.use('/api/localidades', localidadRouter);
app.use('/api/organizadores', organizadorRouter);
app.use('/api/paises', paisRouter);
app.use('/api/ubicaciones', ubicacionRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/categorias', categoriaRouter);
app.use((req, res) => {
    return res.status(404).send({ message: 'Error 404. Recurso no encontrado!' });
});
await syncSchema(); //never in production
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map