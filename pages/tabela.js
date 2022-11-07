import { useEffect, useState, useContext } from "react";
import { withRouter, useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";
import TabelaVme from "../components/TabelaVme";
import styles from "../styles/Home.module.css";
import TabelaPoe from "../components/TabelaPoe";
import TabelaVeip from "../components/TabelaVeip";
import TabelaIncerteza from "../components/TabelaIncerteza";
import { TabelaContext } from "../context/TabelaContext";

const mockDefaultValues = {
  ambienteDecisao: "Incerteza",
  investimentos: [
    {
      0: {
        value: "100",
      },
      1: {
        value: "210",
      },
      2: {
        value: "140",
      },
    },
    {
      0: {
        value: "120",
      },
      1: {
        value: "80",
      },
      2: {
        value: "190",
      },
    },
    {
      0: {
        value: "170",
      },
      1: {
        value: "200",
      },
      2: {
        value: "140",
      },
    },
  ],
  cenarios: [{ value: "25" }, { value: "35" }, { value: "40" }],
};

function Tabela(props) {
  const router = useRouter();
  const { state, dispatch, resetState } = useContext(TabelaContext);

  const { ambienteDecisao, numCenarios, numInvestimentos } = state;
  
  const [generalErrorMsg, setGeneralErrorMsg] = useState("");

  useEffect(() => {
    if (!props.router || !state.ambienteDecisao || isNaN(state.numCenarios)|| isNaN(state.numInvestimentos)) {
      router.push("/");
    }
  }, [router, props.router, state]);

  const arrCenarios = Array.from(Array(numCenarios || 0), (_, i) => i + 1);

  const arrInvestimentos = Array.from(
    Array(numInvestimentos || 0),
    (_, i) => i + 1
  );

  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cenarios: arrCenarios.map(i => ({ value: 0 })),
      investimentos: arrInvestimentos.map(i => ({})),
    },
    // defaultValues: mockDefaultValues,
  });

  const { fields: fieldsCenarios } = useFieldArray({
    control,
    name: "cenarios",
  });

  const { fields: fieldsInvestimentos } = useFieldArray({
    control,
    name: "investimentos",
  });

  const allValues = watch();

  const reset = () => {
    resetState();
    router.push("/");
  }

  const onSubmit = data => {
    setGeneralErrorMsg("");
    const totalCenariosValue = data.cenarios.reduce(
      (total, cenario) => total + parseInt(cenario.value, 10),
      0
    );

    if (totalCenariosValue !== 100) {
      setGeneralErrorMsg(
        "Total de probabilidades dos cenários deve ser igual a 100!"
      );
      return;
    }

    const { investimentos, cenarios } = data;

    dispatch({ investimentos, cenarios, isSubmitted: true });
  };

  const saveAnalisis = () => {
    console.log('ambienteDecisao', allValues.ambienteDecisao);
    console.log('cenarios', allValues.cenarios);
    console.log('investimentos', allValues.investimentos);

    console.log("final state", state)
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {!state.isSubmitted ? (
          <>
            <h1>Distribuição de Probabilidades</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
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
                                {fieldsCenarios.map((i, index) => (
                                  <th
                                    scope="col"
                                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                    key={i.id}
                                  >
                                    <span>C{index + 1}</span>
                                    {" ("}
                                    <input
                                      {...register(`cenarios.${index}.value`, {
                                        required: "Cenário não informado!",
                                      })}
                                      type="number"
                                      className="text-center w-10"
                                      min={1}
                                      max={100}
                                    ></input>
                                    {"%)"}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {/* RENDERIZA INVESTIMENTOS */}
                              {fieldsInvestimentos.map((field, fieldIndex) => (
                                <tr
                                  className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                                  key={fieldIndex.id}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Inv {fieldIndex + 1}
                                  </td>
                                  {fieldsCenarios.map((i, cenIndex) => (
                                    <td
                                      className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                                      key={`${field.id}-${fieldIndex}-${cenIndex}`}
                                    >
                                      <input
                                        {...register(
                                          `investimentos.${fieldIndex}.${cenIndex}.value`,
                                          {
                                            required:
                                              "Investimento não informado!",
                                          }
                                        )}
                                        type="number"
                                        className="w-20 text-center"
                                        step="0.1"
                                      />
                                    </td>
                                  ))}
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
              <div className="flex gap-2">
                <button
                  type="button"
                  className="border rounded border-red-500 bg-red-500 text-white text-sm w-32 mt-2 p-2"
                  onClick={reset}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="border rounded border-green-500 bg-green-500 text-white text-sm w-32 mt-2 p-2"
                >
                  Concluir
                </button>
              </div>
              {errors.cenarios && (
                <p className="text-md text-red-500 mt-5">
                  Informe todos os cenários!
                </p>
              )}
              {errors.investimentos && (
                <p className="text-md text-red-500 mt-5">
                  Informe todos os investimentos!
                </p>
              )}
              {generalErrorMsg && (
                <p className="text-md text-red-500 mt-5">{generalErrorMsg}</p>
              )}
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl mb-6">RESULTADOS</h1>
            {ambienteDecisao === "Risco" && (
              <div>
                <h2 className="bold text-lg text-center">VME</h2>
                <TabelaVme />

                <h2 className="bold text-lg text-center mt-6">POE</h2>
                <TabelaPoe />

                <h2 className="bold text-lg text-center mt-6">VEIP</h2>
                <TabelaVeip />
              </div>
            )}
            {ambienteDecisao === "Incerteza" && (
              <div>
                <TabelaIncerteza />
              </div>
            )}
          </>
        )}
        {state.isSubmitted && (
          <div className="w-42">
            <button
              type="submit"
              className="border rounded border-green-500 bg-green-500 text-white text-center text-sm w-full mt-2 p-2 print:hidden"
              onClick={saveAnalisis}
            >
              Salvar análise
            </button>
            <button
              type="submit"
              className="border rounded border-red-500 bg-red-500 text-white text-center text-sm w-full mt-2 p-2 print:hidden"
              onClick={reset}
            >
              Realizar outra análise
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(Tabela);
