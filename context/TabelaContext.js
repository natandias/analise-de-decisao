import React from 'react';

const initialValues = {
  ambienteDecisao: null,
  numCenarios: null,
  numInvestimentos: null,
  cenarios: [],
  investimentos: [],
  vme: null,
  bestVme: null,
  poe: null,
  bestPoe: null,
  veip: null,
  invPerfeito: null,
  invPerfeitoPond: null,
  MaxiMax: null,
  MaxiMin: null,
  Laplace: null,
  Hurwicz: null,
  bestMaxiMax: null,
  bestMaxiMin: null,
  bestLaplace: null,
  bestHurwicz: null,
  MiniMax: null,
  bestMiniMax: null,
  isSubmitted: false
};

const TabelaContext = React.createContext();

const stateReducer = (state, data) => ({ ...state, ...data });

function TabelaProvider({children}) {
  const [state, dispatch] = React.useReducer(stateReducer, initialValues)

  const resetState = () => dispatch(initialValues);

  const value = { state, dispatch, resetState }
  return <TabelaContext.Provider value={value} key='tabela-provider'>{children}</TabelaContext.Provider>
}

export { TabelaContext, TabelaProvider };