const calcPOE = data => {
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

  const withMedia = arrPOE.map(poe => [
    ...poe,
    poe.reduce((acc, p, index) => {
      return acc + p * (Number(cenarios[index].value) / 100);
    }, 0),
  ]);

  const poeValues = withMedia.map(poe => poe[poe.length - 1]);
  const minPoeValue = Math.min(...poeValues);
  const bestPOEInv = withMedia.findIndex(
    poe => poe[poe.length - 1] === minPoeValue
  );

  return { poe: withMedia, bestPOEInv };
};

function TabelaPoe({ cenarios, investimentos }) {
  const { poe, bestPOEInv } = calcPOE({ cenarios, investimentos });

  return (
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
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Investimento
                      </th>

                      {/* RENDERIZA CENARIOS */}
                      {cenarios.map((i, index) => (
                        <th
                          scope="col"
                          className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
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
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
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
                              className={`${fieldIndex === bestPOEInv && cenIndex === cenarios.length && 'font-bold'} text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap`}
                              key={`${field.id}-${fieldIndex}-${cenIndex}`}
                            >
                              {cenIndex === cenarios.length ? poe[fieldIndex][cenIndex].toFixed(2) : poe[fieldIndex][cenIndex]}
                            </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-md text-center mt-6">
                  <strong>Melhor investimento:</strong> Investimento{" "}
                  {bestPOEInv + 1} (menor perda)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabelaPoe;
