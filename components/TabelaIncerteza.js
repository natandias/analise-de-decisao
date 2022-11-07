import TabelaMiniMax from "./TabelaMiniMax";

function TabelaIncerteza({ cenarios, investimentos }) {
  const MaxiMax = [];
  const MaxiMin = [];
  const Laplace = [];
  const Hurwicz = [];

  investimentos.forEach(inv => {
    const invValues = Object.values(inv).map(i => Number(i.value));
    MaxiMax.push(Math.max(...invValues));
    MaxiMin.push(Math.min(...invValues));
    Laplace.push(invValues.reduce((sum, i) => sum + i) / invValues.length);

    const hurwicz = invValues.reduce(
      (total, invAtual, index) =>
        total + (Number(invAtual) * Number(cenarios[index].value)) / 100,
      0
    );

    Hurwicz.push(hurwicz);
  });

  console.log('MaxiMax', MaxiMax)

  const bestMaxiMax = MaxiMax.indexOf(Math.max(...MaxiMax));
  const bestMaxiMin = MaxiMin.indexOf(Math.max(...MaxiMin));
  const bestLaplace = Laplace.indexOf(Math.max(...Laplace));
  const bestHurwicz = Hurwicz.indexOf(Math.max(...Hurwicz))

  return (
    <>
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
                          Investimentos
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
                          MaxiMax
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                        >
                          MaxiMin
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                        >
                          LaPlace
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                        >
                          Hurwicz
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
                          {cenarios.map((i, cenIndex) => (
                            <td
                              className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                              key={`${field.id}-${fieldIndex}-${cenIndex}`}
                            >
                              {investimentos[fieldIndex][cenIndex].value}
                            </td>
                          ))}
                          <td className={`${fieldIndex === bestMaxiMax && 'font-bold'} text-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap`}>
                            {MaxiMax[fieldIndex].toFixed(2)}
                          </td>
                          <td className={`${fieldIndex === bestMaxiMin && 'font-bold'} text-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap`}>
                            {MaxiMin[fieldIndex].toFixed(2)}
                          </td>
                          <td className={`${fieldIndex === bestLaplace && 'font-bold'} text-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap`}>
                            {Laplace[fieldIndex].toFixed(2)}
                          </td>
                          <td className={`${fieldIndex === bestHurwicz && 'font-bold'} text-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap`}>
                            {Hurwicz[fieldIndex].toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-md text-center mt-6">
                    <strong>MaxiMax:</strong> Investimento{" "}
                    {bestMaxiMax + 1}
                  </p>

                  <p className="text-md text-center mt-2">
                    <strong>MaxiMin:</strong> Investimento{" "}
                    {bestMaxiMin + 1}
                  </p>

                  <p className="text-md text-center mt-2">
                    <strong>Laplace:</strong> Investimento{" "}
                    {bestLaplace + 1}
                  </p>

                  <p className="text-md text-center mt-2">
                    <strong>Hurwicz:</strong> Investimento{" "}
                    {bestHurwicz + 1}
                  </p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TabelaMiniMax cenarios={cenarios} investimentos={investimentos} />
    </>
  );
}

export default TabelaIncerteza;
