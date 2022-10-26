import { useEffect, useState } from "react";
import { withRouter, useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "../styles/Home.module.css";

function Tabela(props) {
  const router = useRouter();

  const [VMEvalue, setVMEvalue] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generalErrorMsg, setGeneralErrorMsg] = useState('');

  useEffect(() => {
    if (!props.router || !Object.values(props.router.query).length) {
      router.push("/");
    }
  }, [router, props.router])

  const query = props.router.query;

  const { ambienteDecisao } = query;
  const numCenarios = parseInt(query.numCenarios, 10);
  const numInvestimentos = parseInt(query.numInvestimentos, 10);

  const arrCenarios = Array.from(Array(numCenarios || 0), (_, i) => i + 1);

  const arrInvestimentos = Array.from(Array(numInvestimentos || 0), (_, i) => i + 1);

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

  console.log("currentValues", allValues);

  const calcVME = data => {
    const { investimentos, cenarios } = data;
    const vme = [];
    investimentos.forEach((inv, index) => {
      const result = Object.values(inv).reduce(
        (total, invAtual, index) =>
          total +
          (parseInt(invAtual.value, 10) * parseInt(cenarios[index].value, 10)) /
            100,
        0
      );
      vme.push(result);
    });

    setVMEvalue(vme);
    {
      /*
        "cenarios": [
            {
              "value": "14"
            },
            {
              "value": "16"
            },
            {
              "value": "15"
            }
          ]
          cada investimento:
          {
            "C0": {
              "value": "8"
            },
            "C1": {
              "value": "19"
            },
            "C2": {
              "value": "17"
            }
          }
        */
    }
  };

  const onSubmit = data => {
    setGeneralErrorMsg('');
    const totalCenariosValue = data.cenarios.reduce((total, cenario) => total + parseInt(cenario.value, 10), 0);

    if (totalCenariosValue !== 100) {
      setGeneralErrorMsg('Total de probabilidades dos cenários deve ser igual a 100!');
      return;
    }

    console.log('totalCenariosValue', totalCenariosValue)

    calcVME(data);
    setIsSubmitted(true);
    console.log("submit -->", data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {!isSubmitted ? (
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
                                          `investimentos.${fieldIndex}.C${cenIndex}.value`,
                                          {
                                            required:
                                              "Investimento não informado!",
                                          }
                                        )}
                                        type="number"
                                        className="w-20"
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
                  onClick={() => router.push("/")}
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
              {errors.cenarios && <p className="text-md text-red-500 mt-5">Informe todos os cenários!</p>}
              {errors.investimentos && <p className="text-md text-red-500 mt-5">Informe todos os investimentos!</p>}
              {generalErrorMsg && <p className="text-md text-red-500 mt-5">{generalErrorMsg}</p>}
            </form>
          </>
        ) : (
          <>
            <h1>RESULTADOS</h1>
            <h2>VME</h2>
            <div>
              {VMEvalue.map((i, index) => (
                <p key={index}>
                  Inv {index + 1}: {i}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default withRouter(Tabela);
