function TabelaIncerteza({ cenarios, investimentos }) {
  console.log('TabelaIncerteza investimentos', investimentos);
  const MaxiMax = [];
  const MaxiMin = [];
  const Laplace = [];
  const Hurwicz = [];

  investimentos.forEach((inv) => {
    const invValues = Object.values(inv).map((i) => Number(i.value));
    MaxiMax.push(Math.max(...invValues));
    MaxiMin.push(Math.min(...invValues));
    Laplace.push(invValues.reduce((sum, i) => sum + i) / invValues.length);

    const hurwicz = invValues.reduce(
      (total, invAtual, index) =>
        total +
        (Number(invAtual) * Number(cenarios[index].value)) / 100,
      0
    );

    Hurwicz.push(hurwicz);
  });

  console.log('MaxiMax', MaxiMax);
  console.log('MaxiMin', MaxiMin);

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
                        Investimentos
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
                        MaxiMax
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        MaxiMin
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        LaPlace
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
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
                        <td className="text-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {MaxiMax[fieldIndex].toFixed(2)}
                        </td>
                        <td className="text-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {MaxiMin[fieldIndex].toFixed(2)}
                        </td>
                        <td className="text-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {Laplace[fieldIndex].toFixed(2)}
                        </td>
                        <td className="text-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {Hurwicz[fieldIndex].toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabelaIncerteza;
