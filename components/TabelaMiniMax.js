const calcMiniMax = data => {
  const { investimentos, cenarios } = data;

  const arrPOE = investimentos.map(i => {
    return Object.values(i).map((invVal, index) => {
      const investimentosIndex = investimentos.map(i => i[index]);
      const bestInvOnIndex = investimentosIndex.reduce(
        (a, b) => {
          return Number(a.value) > Number(b.value) ? a : b;
        },
        { value: "0" }
      );
      return Math.abs(Number(invVal.value) - Number(bestInvOnIndex.value));
    });
  });

  const withMax = arrPOE.map(poe => [...poe, Math.max(...poe)]);

  const poeValues = withMax.map(poe => poe[poe.length - 1]);
  const minPoeValue = Math.min(...poeValues);
  const bestPOEInv = withMax.findIndex(
    poe => poe[poe.length - 1] === minPoeValue
  );

  return { miniMax: withMax, bestInv: bestPOEInv };
};

function TabelaMiniMax({ cenarios, investimentos }) {
  const { miniMax, bestInv } = calcMiniMax({ cenarios, investimentos });

  return (
    <div className="bg-white border rounded-5 mt-6">
      <div className="p-4">
        <h2 className="bold text-lg text-center mt-6">MiniMax</h2>
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
                        </th>
                      ))}

                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                      >
                        Maiores
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
                            className={`${fieldIndex === bestInv && cenIndex === cenarios.length && 'font-bold'} text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap`}
                            key={`${field.id}-${fieldIndex}-${cenIndex}`}
                          >
                            {cenIndex === cenarios.length ? miniMax[fieldIndex][cenIndex].toFixed(2) : miniMax[fieldIndex][cenIndex]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-md text-center mt-6">
                  <strong>Melhor investimento:</strong> Investimento{" "}
                  {bestInv + 1}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabelaMiniMax;
