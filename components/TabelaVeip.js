function TabelaVeip({ invPerfeito, invPonderado, veip }) {
  console.log(invPerfeito, invPonderado, veip);
  return (
    <div className="bg-white border rounded-5 ">
      <div className="p-4">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <tbody>
                    {/* RENDERIZA INVESTIMENTOS */}

                    <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 text-center">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Investimento perf.
                      </td>
                      {invPerfeito.map((field, fieldIndex) => (
                        <td
                          className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                          key={`${field.id}-${fieldIndex}`}
                        >
                          {field}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 text-center">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Investimento perf. pond.
                      </td>
                      {invPonderado.map((field, fieldIndex) => (
                        <td
                          className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                          key={`${field.id}-${fieldIndex}`}
                        >
                          {field}
                        </td>
                      ))}
                    </tr>
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
export default TabelaVeip;
