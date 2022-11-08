import React from 'react';

const initialValues = {
  id: null,
  nome: null,
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

// const mockDefaultValues = {
//   ...initialValues,
//   ambienteDecisao: "Incerteza",
//   investimentos: [
//     {
//       0: {
//         value: "100",
//       },
//       1: {
//         value: "210",
//       },
//       2: {
//         value: "140",
//       },
//     },
//     {
//       0: {
//         value: "120",
//       },
//       1: {
//         value: "80",
//       },
//       2: {
//         value: "190",
//       },
//     },
//     {
//       0: {
//         value: "170",
//       },
//       1: {
//         value: "200",
//       },
//       2: {
//         value: "140",
//       },
//     },
//   ],
//   cenarios: [{ value: "25" }, { value: "35" }, { value: "40" }],
//   isSubmitted: true
// };

const TabelaContext = React.createContext();

const stateReducer = (state, data) => ({ ...state, ...data });

function TabelaProvider({children}) {
  const [state, dispatch] = React.useReducer(stateReducer, initialValues)

  const resetState = () => dispatch(initialValues);

  const value = { state, dispatch, resetState }
  return <TabelaContext.Provider value={value} key='tabela-provider'>{children}</TabelaContext.Provider>
}

export { TabelaContext, TabelaProvider };