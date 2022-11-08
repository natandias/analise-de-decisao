import mongoose from 'mongoose';

const AnaliseSchema = new mongoose.Schema({
  nome: String,
  ambienteDecisao: String,
  numCenarios: Number,
  numInvestimentos: Number,
  cenarios: Array,
  investimentos: Array,
  vme: Array,
  bestVme: Number,
  poe: Array,
  bestPoe: Number,
  veip: Array,
  invPerfeito: Array,
  invPerfeitoPond: Array,
  MaxiMax: Array,
  MaxiMin: Array,
  Laplace: Array,
  Hurwicz: Array,
  bestMaxiMax: Number,
  bestMaxiMin: Number,
  bestLaplace: Number,
  bestHurwicz: Number,
  MiniMax: Array,
  bestMiniMax: Number,
  isSubmitted: Boolean
});

const Analise = mongoose.models.Analise ?? mongoose.model('Analise', AnaliseSchema);

export default Analise;