const Validador = require("../src/validador");

describe("Validador", () => {
  let validador;

  beforeEach(() => {
    validador = new Validador();
  });

  test("valida os tipos básicos", () => {
    expect(validador.ehString("texto")).toBe(true);
    expect(validador.ehNumero(10)).toBe(true);
    expect(validador.ehNumero(NaN)).toBe(false);
    expect(validador.ehBooleano(false)).toBe(true);
    expect(validador.ehArray([])).toBe(true);
    expect(validador.ehObjeto({})).toBe(true);
    expect(validador.ehObjeto([])).toBe(false);
  });

  test("identifica valores vazios", () => {
    expect(validador.estaVazio("")).toBe(true);
    expect(validador.estaVazio([])).toBe(true);
    expect(validador.estaVazio({})).toBe(true);
    expect(validador.estaVazio("conteúdo")).toBe(false);
  });

  test("valida números e intervalos", () => {
    expect(validador.ehPositivo(5)).toBe(true);
    expect(validador.ehNegativo(-5)).toBe(true);
    expect(validador.ehPar(4)).toBe(true);
    expect(validador.ehImpar(3)).toBe(true);
    expect(validador.ehImpar(-3)).toBe(true);
    expect(validador.estaNoIntervalo(5, 1, 10)).toBe(true);
  });

  test("valida tamanho de textos", () => {
    expect(validador.temTamanhoMinimo("Pedro", 5)).toBe(true);
    expect(validador.temTamanhoMaximo("Pedro", 5)).toBe(true);
    expect(validador.temTamanhoMaximo("Pedro", 4)).toBe(false);
  });

  test("valida formatos de texto", () => {
    expect(validador.ehEmail("pedro@email.com")).toBe(true);
    expect(validador.ehEmail("email-invalido")).toBe(false);
    expect(validador.ehUrl("https://github.com")).toBe(true);
    expect(validador.ehUrl("github")).toBe(false);
    expect(validador.contemApenasLetras("João Silva")).toBe(true);
    expect(validador.contemApenasNumeros("12345")).toBe(true);
    expect(validador.contemApenasNumeros("12a45")).toBe(false);
  });

  test("valida palíndromos, arrays e propriedades", () => {
    expect(validador.ehPalindromo("Socorram-me, subi no ônibus em Marrocos")).toBe(true);
    expect(validador.arraysSaoIguais([1, 2], [1, 2])).toBe(true);
    expect(validador.arraysSaoIguais([1, 2], [2, 1])).toBe(false);
    expect(validador.possuiPropriedade({ nome: "Pedro" }, "nome")).toBe(true);
    expect(validador.possuiPropriedade({}, "nome")).toBe(false);
  });
});
