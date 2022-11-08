import { cloneDeep } from 'lodash';
import dbConnect from "../../../database/dbConnection";
import Analise from "../../../database/models/analise";

export default async function handler(req, res) {
  try {
    const { method } = req;
    await dbConnect();

    if (method === 'GET') {
      const { id } = req.query;
      if (id) {
        const analise = await Analise.findById(id);
        if (analise) {
          const newAnalise = analise.toJSON();
          newAnalise.id = newAnalise._id;
          delete newAnalise.__v;
          delete newAnalise._id;
          res.status(200).json(newAnalise);
        }
        res.status(400);
      }
    }
  }
  catch(error) {
    console.log('erro listarAnalises', error);
  }
};