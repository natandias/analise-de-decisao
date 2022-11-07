import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useContext } from "react";
import { TabelaContext } from "../context/TabelaContext";

export default function Home() {
  const router = useRouter();
  const { state, dispatch } = useContext(TabelaContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = data => {
    const { ambienteDecisao, numCenarios, numInvestimentos } = data;

    const submitData = {
      ambienteDecisao,
      numCenarios: parseInt(numCenarios, 10),
      numInvestimentos: parseInt(numInvestimentos, 10),
    };

    dispatch({ ...submitData });

    router.push("/tabela");
  };

  return (
    <div>
      <Head>
        <title>Análise de Decisão</title>
        <meta name="description" content="Analise sua decisão" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={ `flex justify-center items-center flex-col min-h-screen min-w-full p-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-lg` }>
        <div className="h-[600px] w-[500px] flex items-center flex-col border-4 pt-16 bg-white rounded-xl ">
          <h1 className="mb-10 text-2xl">ANÁLISE DE DECISÃO</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <p className="text-md">Qual o ambiente de decisão?</p>

              <div className="flex gap-4 mb-4">
                <div className="radio">
                  <label>
                    <input
                      {...register("ambienteDecisao", {
                        required: "Selecione o ambiente de decisão!",
                      })}
                      type="radio"
                      value="Risco"
                      className="mr-2"
                    />
                    Risco
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      {...register("ambienteDecisao")}
                      type="radio"
                      value="Incerteza"
                      className="mr-2"
                    />
                    Incerteza
                  </label>
                </div>
              </div>

              <ErrorMessage
                errors={errors}
                name="ambienteDecisao"
                render={({ message }) => (
                  <p className="text-sm text-red-500 mb-4">{message}</p>
                )}
              />
            </div>
            <div className="cenarios">
              <p className="text-md">Qual o número de cenários?</p>

              <div className="flex mb-4">
                <div className="input">
                  <input
                    className="border-2 h-8"
                    type="number"
                    min="0"
                    {...register("numCenarios", {
                      valueAsNumber: true,
                      required: "Digite o número de cenários!",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="numCenarios"
                    render={({ message }) => (
                      <p className="text-sm text-red-500 mb-4">{message}</p>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mb-20">
              <p className="text-md">Qual o número de Investimentos?</p>

              <div className="flex mb-4">
                <div className="">
                  <input
                    className="border-2 h-8"
                    type="number"
                    min="0"
                    {...register("numInvestimentos", {
                      valueAsNumber: true,
                      required: "Digite o número de cenários!",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="numInvestimentos"
                    render={({ message }) => (
                      <p className="text-sm text-red-500 mb-4">{message}</p>
                    )}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="border rounded border-green-500 bg-green-500 text-white text-md w-full p-2"
            >
              Prosseguir
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
