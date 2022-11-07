import { useContext, useEffect } from "react";
import { TabelaContext } from "../context/TabelaContext";
import { calcPOE } from "../common/calcs";

function TabelaPoe() {
  const {
    state: { cenarios, investimentos, poe, bestPoe },
    dispatch,
  } = useContext(TabelaContext);

  useEffect(() => {
    if (cenarios.length && investimentos.length) {
      const { poe, bestPOEInv } = calcPOE({ cenarios, investimentos });
      dispatch({ poe, bestPoe: bestPOEInv });
    }
  }, [cenarios, investimentos, dispatch]);

  return (
    poe &&
    bestPoe !== null && (
      <div className="bg-white border rounded-5 ">
        <div className="p-4">
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-white border-b">
                      <tr>
                        <th
                          scope="col"
                          className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                        >
                          Investimento
                        </th>

                        {/* RENDERIZA CENARIOS */}
                        {cenarios.map((i, index) => (
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                            key={i.id}
                          >
                            <span>C{index + 1}</span>
                            {" ("}
                            {i.value}
                            {"%)"}
                          </th>
                        ))}

                        <th
                          scope="col"
                          className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                        >
                          Perdas Ponderadas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* RENDERIZA INVESTIMENTOS */}
                      {investimentos.map((field, fieldIndex) => (
                        <tr
                          className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 text-center"
                          key={fieldIndex.id}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Inv {fieldIndex + 1}
                          </td>
                          {[...cenarios, {}].map((i, cenIndex) => (
                            <td
                              className={`${
                                fieldIndex === bestPoe &&
                                cenIndex === cenarios.length &&
                                "font-bold"
                              } text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap`}
                              key={`${field.id}-${fieldIndex}-${cenIndex}`}
                            >
                              {cenIndex === cenarios.length
                                ? poe[fieldIndex][cenIndex].toFixed(2)
                                : poe[fieldIndex][cenIndex]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-md text-center mt-6">
                    <strong>Melhor investimento:</strong> Investimento{" "}
                    {bestPoe + 1} (menor perda)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default TabelaPoe;
