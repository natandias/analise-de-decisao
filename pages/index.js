import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [ambienteDecisao, setAmbienteDecisao] = useState();
  const [numCenarios, setNumCenarios] = useState();
  const [numInvestimentos, setNumInvestimentos] = useState();

  return (
    <div className={styles.container}>
      <Head>
        <title>Análise de Decisão</title>
        <meta name="description" content="Analise sua decisão" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className="mb-10 text-xl">ANÁLISE DE DECISÃO</h1>
        <form>
          <div className="ambienteDecisao">
            <p className="text-md">Qual o ambiente de decisão?</p>

            <div className="flex gap-4 mb-4">
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    value="Male"
                    checked={ambienteDecisao === "Risco"}
                    onChange={() => setAmbienteDecisao("Risco")}
                  />
                  Risco
                </label>
              </div>
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    value="Female"
                    checked={ambienteDecisao === "Incerteza"}
                    onChange={() => setAmbienteDecisao("Incerteza")}
                  />
                  Incerteza
                </label>
              </div>
            </div>
          </div>

          <button type="submit">Prosseguir</button>
        </form>
      </main>
    </div>
  );
}
