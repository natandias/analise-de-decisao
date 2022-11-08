import dbConnect from "../../database/dbConnection";
import Analise from "../../database/models/analise";

export default async function handler(req, res) {
  try {
    const { method } = req;
    await dbConnect();

    if (method === 'POST') {
      await Analise.create(req.body);
      res.status(200).json('Saved');
    }
    else {
      res.status(400);
    }
  } catch(error) {
    console.log('erro salvarAnalise', error);
  }
}