const calcVME = data => {
  const { investimentos, cenarios } = data;
  const vme = [];
  investimentos.forEach((inv) => {
    const result = Object.values(inv).reduce(
      (total, invAtual, index) =>
        total +
        (Number(invAtual.value) * Number(cenarios[index].value)) / 100,
      0
    );
    vme.push(result);
  });

  const bestValue = vme.reduce((a, b) => Math.max(a, b), -Infinity);
  const bestInv = vme.indexOf(bestValue);

  return { vme, bestVmeInv: bestInv };
};

const calcPOE = data => {
  const { investimentos, cenarios } = data;

  const arrPOE = investimentos.map(i => {
    return Object.values(i).map((invVal, index) => {
      const investimentosIndex = investimentos.map(i => i[index]);
      const bestInvOnIndex = investimentosIndex.reduce(
        (a, b) => {
          return Number(a.value) > Number(b.value) ? a : b;
        },
        { value: "0" }
      );
      return Math.abs(Number(invVal.value) - Number(bestInvOnIndex.value));
    });
  });

  const withMedia = arrPOE.map(poe => [
    ...poe,
    poe.reduce((acc, p, index) => {
      return acc + p * (Number(cenarios[index].value) / 100);
    }, 0),
  ]);

  const poeValues = withMedia.map(poe => poe[poe.length - 1]);
  const minPoeValue = Math.min(...poeValues);
  const bestPOEInv = withMedia.findIndex(
    poe => poe[poe.length - 1] === minPoeValue
  );

  return { poe: withMedia, bestPOEInv };
};

const calcVEIP = (data, vme) => {
  const { investimentos, cenarios } = data;

  const invPerfeito = investimentos.map(i => {
    return Object.values(i).map((invVal, index) => {
      const investimentosIndex = investimentos.map(i => i[index]);
      const bestInvOnIndex = investimentosIndex.reduce(
        (a, b) => {
          return Number(a.value) > Number(b.value) ? a : b;
        },
        { value: "0" }
      );
      return Number(bestInvOnIndex.value);
    });
  })[0];

  const invPerfeitoPonderado = [
    ...invPerfeito.map((i, index) => i * (Number(cenarios[index].value) / 100)),
    invPerfeito.reduce((acc, p, index) => {
      return acc + p * (Number(cenarios[index].value) / 100);
    }, 0),
  ];

  const veip =
    invPerfeitoPonderado[invPerfeitoPonderado.length - 1] - Math.max(...vme);
  return { veip, invPerfeito, invPerfeitoPond: invPerfeitoPonderado };
};

const calcMiniMax = data => {
  const { investimentos, cenarios } = data;

  const arrPOE = investimentos.map(i => {
    return Object.values(i).map((invVal, index) => {
      const investimentosIndex = investimentos.map(i => i[index]);
      const bestInvOnIndex = investimentosIndex.reduce(
        (a, b) => {
          return Number(a.value) > Number(b.value) ? a : b;
        },
        { value: "0" }
      );
      return Math.abs(Number(invVal.value) - Number(bestInvOnIndex.value));
    });
  });

  const withMax = arrPOE.map(poe => [...poe, Math.max(...poe)]);

  const poeValues = withMax.map(poe => poe[poe.length - 1]);
  const minPoeValue = Math.min(...poeValues);
  const bestPOEInv = withMax.findIndex(
    poe => poe[poe.length - 1] === minPoeValue
  );

  return { MiniMax: withMax, bestInv: bestPOEInv };
};


export { calcVME, calcPOE, calcVEIP, calcMiniMax };