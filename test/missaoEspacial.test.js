const MissaoEspacial = require("../src/missaoEspacial");

describe("MissaoEspacial", () => {
  let nave;

  beforeEach(() => {
    nave = new MissaoEspacial("Aurora", 100);
  });

  test("abastece e consome combustível", () => {
    expect(nave.abastecer(80)).toBe(80);
    expect(nave.abastecer(50)).toBe(100);
    expect(nave.consumirCombustivel(20)).toBe(80);
    expect(() => nave.consumirCombustivel(90)).toThrow("Combustível insuficiente");
  });

  test("gerencia tripulação e carga", () => {
    expect(nave.adicionarTripulante("Pedro")).toBe(true);
    expect(nave.adicionarTripulante("Pedro")).toBe(false);
    expect(nave.removerTripulante("Pedro")).toBe(true);
    expect(nave.adicionarCarga("Robô", 30)).toBe(1);
    expect(nave.removerCarga("Robô")).toBe(true);
  });

  test("inicia, movimenta e encerra uma missão", () => {
    nave.abastecer(100);
    nave.adicionarTripulante("Pedro");

    expect(nave.iniciarMissao()).toBe(true);
    expect(nave.podeViajar(20)).toBe(true);
    expect(nave.mover(3, 4, 20)).toEqual({ x: 3, y: 4 });
    expect(nave.calcularDistanciaDaOrigem()).toBe(5);
    expect(nave.encerrarMissao()).toBe(false);
  });

  test("registra planetas e coleta amostras", () => {
    expect(nave.registrarPlaneta("Marte")).toBe(true);
    expect(nave.registrarPlaneta("Marte")).toBe(false);
    expect(nave.planetaFoiExplorado("Marte")).toBe(true);
    expect(nave.coletarAmostra("Marte", "Rocha")).toBe(1);
    expect(nave.contarAmostras("Marte")).toBe(1);
  });

  test("controla escudo, danos e reparos", () => {
    expect(nave.ativarEscudo()).toBe(true);
    expect(nave.receberDano(40)).toBe(80);
    expect(nave.desativarEscudo()).toBe(false);
    expect(nave.receberDano(30)).toBe(50);
    expect(nave.repararNave(80)).toBe(100);
  });

  test("retorna o status atual da nave", () => {
    nave.abastecer(60);
    nave.adicionarTripulante("Pedro");

    expect(nave.obterStatus()).toEqual({
      nave: "Aurora",
      combustivel: 60,
      tripulantes: 1,
      integridade: 100,
      emMissao: false
    });
  });

  test("impede iniciar missão sem os recursos necessários", () => {
    expect(() => nave.iniciarMissao()).toThrow("Nave sem tripulação");
    nave.adicionarTripulante("Pedro");
    expect(() => nave.iniciarMissao()).toThrow("Nave sem combustível");
  });
});
