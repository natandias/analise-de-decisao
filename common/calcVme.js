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

export default calcVME;