import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "../styles/Home.module.css";

export default function Tabela() {
  const [VMEvalue, setVMEvalue] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ambiente = "Risco";
  const numCenarios = 3;
  const numInvestimentos = 3;

  const arrCenarios = Array.from(Array(numCenarios), (_, i) => i + 1);

  const arrInvestimentos = Array.from(Array(numInvestimentos), (_, i) => i + 1);

  const { control, register, watch, handleSubmit } = useForm({
    defaultValues: {
      cenarios: arrCenarios.map(i => ({ value: 0 })),
      investimentos: arrInvestimentos.map(i => ({})),
    },
  });

  const { fields: fieldsCenarios } = useFieldArray({
    control,
    name: "cenarios",
  });

  const {
    fields: fieldsInvestimentos,
    append,
    prepend,
    remove,
    swap,
    move,
    insert,
  } = useFieldArray({
    control,
    name: "investimentos",
  });

  const allValues = watch();

  console.log("currentValues", allValues);

  const calcVME = data => {
    const { investimentos, cenarios } = data;
    console.log("data clacVME", data);
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div class="bg-white border rounded-5 ">
                <div class="p-4">
                  <div class="flex flex-col">
                    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                        <div class="overflow-hidden">
                          <table class="min-w-full">
                            <thead class="bg-white border-b">
                              <tr>
                                <th
                                  scope="col"
                                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Investimentos
                                </th>

                                {/* RENDERIZA CENARIOS */}
                                {fieldsCenarios.map((i, index) => (
                                  <th
                                    scope="col"
                                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                    key={i.id}
                                  >
                                    <span>C{index + 1}</span>
                                    {" ("}
                                    <input
                                      {...register(`cenarios.${index}.value`)}
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
                                  class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                                  key={fieldIndex.id}
                                >
                                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Inv {fieldIndex + 1}
                                  </td>
                                  {fieldsCenarios.map((i, cenIndex) => (
                                    <td
                                      class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                                      key={`${field.id}-${fieldIndex}-${cenIndex}`}
                                    >
                                      <input
                                        {...register(
                                          `investimentos.${fieldIndex}.C${cenIndex}.value`
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
              <button
                type="submit"
                className="border rounded border-green-500 bg-green-500 text-white text-sm w-full p-2"
              >
                Concluir
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>RESULTADOS</h1>
            <h2>VME</h2>
            <div>
              {VMEvalue.map((i, index) => (
                <p key={index}>Inv {index+1}: {i}</p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
