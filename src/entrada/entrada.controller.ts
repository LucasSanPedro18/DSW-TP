import { Request, Response, NextFunction } from 'express'
import { Entrada } from './entrada.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizedEntradaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    code: req.body.code,
    date: req.body.date,
    status: req.body.status,
    rating: req.body.rating,
    tipoEntrada: req.body.tipoEntrada,
    usuario: req.body.usuario,
    evento: req.body.evento,
  
  }
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const entradas = await em.find(
      Entrada,
      {},
      { populate: ['tipoEntrada', 'usuario', 'evento'] }
    )
    res.status(200).json({ message: 'found all entradas', data: entradas })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const entrada = await em.findOneOrFail(
      Entrada,
      { id },
      { populate: ['tipoEntrada', 'usuario', 'evento'] }
    )
    res.status(200).json({ message: 'found entrada', data: entrada })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const entrada = em.create(Entrada, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'entrada created', data: entrada })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const entradaToUpdate = await em.findOneOrFail(Entrada, { id })
    em.assign(entradaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'entrada updated', data: entradaToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const entrada = em.getReference(Entrada, id)
    await em.removeAndFlush(entrada)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizedEntradaInput, findAll, findOne, add, update, remove }