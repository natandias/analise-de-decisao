import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [numCenarios, setNumCenarios] = useState();
  const [numInvestimentos, setNumInvestimentos] = useState();

  const onSubmit = data => console.log(data);

  return (
    <div className={styles.container}>
      <Head>
        <title>Análise de Decisão</title>
        <meta name="description" content="Analise sua decisão" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className="mb-10 text-xl">ANÁLISE DE DECISÃO</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="ambienteDecisao">
            <p className="text-md">Qual o ambiente de decisão?</p>

            <div className="flex gap-4">
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

          <button
            type="submit"
            className="border rounded border-green-500 bg-green-500 text-white text-sm p-2"
          >
            Prosseguir
          </button>
          {console.log("errors", errors)}
        </form>
      </main>
    </div>
  );
}
