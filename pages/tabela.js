import { useEffect, useState } from "react";
import { withRouter, useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";
import TabelaVme from "../components/TabelaVme";
import styles from "../styles/Home.module.css";
import TabelaPoe from "../components/TabelaPoe";
import TabelaVeip from "../components/TabelaVeip";

function Tabela(props) {
  const router = useRouter();

  const [VMEvalue, setVMEvalue] = useState([]);
  const [POEvalue, setPOEvalue] = useState([]);
  const [bestVME, setBestVME] = useState();
  const [bestPOE, setBestPOE] = useState();
  const [invPerfeito, setInvPerfeito] = useState();
  const [invPerfeitoPond, setInvPerfeitoPond] = useState();
  const [veip, setVeip] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generalErrorMsg, setGeneralErrorMsg] = useState("");

  useEffect(() => {
    if (!props.router || !Object.values(props.router.query).length) {
      router.push("/");
    }
  }, [router, props.router]);

  const query = props.router.query;

  const { ambienteDecisao } = query;
  const numCenarios = parseInt(query.numCenarios, 10);
  const numInvestimentos = parseInt(query.numInvestimentos, 10);

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
      investimentos: [
        {
          0: {
            value: "100"
          },
          1: {
            value: "210"
          },
          2: {
            value: "140"
          }
        },
        {
          0: {
            value: "120"
          },
          1: {
            value: "80"
          },
          2: {
            value: "190"
          }
        },
        {
          0: {
            value: "170"
          },
          1: {
            value: "200"
          },
          2: {
            value: "140"
          }
        }
      ],
      cenarios: [
        {value: '25'},
        {value: '35'},
        {value: '40'}
      ]
  }});

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
          (Number(invAtual.value) * Number(cenarios[index].value)) /
            100,
        0
      );
      vme.push(result);
    });

    const bestValue = vme.reduce((a, b) => Math.max(a, b), -Infinity);
    const bestInv = vme.indexOf(bestValue);

    return { vme, bestVmeInv: bestInv };
  };

  const calcPOE = (data) => {
    const { investimentos, cenarios } = data;

    const arrPOE = investimentos.map((i) => {
      return Object.values(i).map((invVal, index) => {
        const investimentosIndex = investimentos.map((i) => i[index]);
        const bestInvOnIndex = investimentosIndex.reduce((a, b) => 
          {
            return Number(a.value) > Number(b.value) ? a : b
          },
          { value: '0' }
        );
        return Math.abs(Number(invVal.value) - Number(bestInvOnIndex.value));
      });
    });

    const withMedia = arrPOE.map((poe) => [...poe, poe.reduce((acc, p, index) => {
      return acc + (p * (Number(cenarios[index].value)/100));
    }, 0)]);

    const poeValues = withMedia.map((poe) => poe[poe.length-1]);
    const minPoeValue = Math.min(...poeValues);
    const bestPOEInv = withMedia.findIndex((poe) => poe[poe.length-1] === minPoeValue);

    return { poe: withMedia, bestPOEInv  };
  }

  const calcVEIP = (data, vme) => {
    const { investimentos, cenarios } = data;

    const invPerfeito = investimentos.map((i) => {
      return Object.values(i).map((invVal, index) => {
        const investimentosIndex = investimentos.map((i) => i[index]);
        const bestInvOnIndex = investimentosIndex.reduce((a, b) => 
          {
            return Number(a.value) > Number(b.value) ? a : b
          },
          { value: '0' }
        );
        return Number(bestInvOnIndex.value);
      });
    })[0];

    const invPerfeitoPonderado = [...invPerfeito.map((i, index) => i * (Number(cenarios[index].value)/100)), invPerfeito.reduce((acc, p, index) => {
      return acc + (p * (Number(cenarios[index].value)/100));
    }, 0)];

    const veip = invPerfeitoPonderado[invPerfeitoPonderado.length - 1] - Math.max(...vme);
    return { veip, invPerfeito, invPerfeitoPond: invPerfeitoPonderado };
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

    console.log("totalCenariosValue", totalCenariosValue);
    console.log("submit -->", data);

    const { vme, bestVmeInv } = calcVME(data);
    setVMEvalue(vme);
    setBestVME(bestVmeInv);

    const { poe, bestPOEInv } = calcPOE(data);
    setPOEvalue(poe);
    setBestPOE(bestPOEInv);

    const { veip, invPerfeito, invPerfeitoPond } = calcVEIP(data, vme);
    setVeip(veip);
    setInvPerfeito(invPerfeito);
    console.log('invPerfeitoPond', invPerfeitoPond)
    setInvPerfeitoPond(invPerfeitoPond);

    setIsSubmitted(true);
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
                                          `investimentos.${fieldIndex}.${cenIndex}.value`,
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
            <div>
              <h2 className="bold text-lg text-center">VME</h2>
              <TabelaVme cenarios={allValues.cenarios} investimentos={allValues.investimentos} vme={VMEvalue} /> 
              <p className="text-md text-center">
                <strong>Melhor investimento:</strong> Investimento {bestVME + 1}
              </p>

              <h2 className="bold text-lg text-center mt-6">POE</h2>
              <TabelaPoe cenarios={allValues.cenarios} investimentos={allValues.investimentos} poe={POEvalue} />
              <p className="text-md text-center">
                <strong>Melhor investimento:</strong> Investimento {bestPOE + 1}
              </p>

              <h2 className="bold text-lg text-center mt-6">VEIP</h2>
              <TabelaVeip invPerfeito={invPerfeito} invPonderado={invPerfeitoPond} veip={veip} />
              <p className="text-md text-center">
                <strong>VEIP:</strong> {veip}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default withRouter(Tabela);
