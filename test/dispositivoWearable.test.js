const DispositivoWearable = require("../src/dispositivoWearable");

describe("DispositivoWearable", () => {
  let wearable;

  beforeEach(() => {
    wearable = new DispositivoWearable("Lume Ring", 40);
  });

  test("controla a conexão do wearable", () => {
    expect(wearable.estaConectado()).toBe(false);
    expect(wearable.conectar()).toBe(true);
    expect(wearable.estaConectado()).toBe(true);
    expect(wearable.desconectar()).toBe(false);
  });

  test("registra e calcula a média de batimentos", () => {
    expect(wearable.mediaBatimentos()).toBe(0);
    expect(wearable.registrarBatimento(70)).toBe(1);
    wearable.registrarBatimento(80);
    expect(wearable.mediaBatimentos()).toBe(75);
    expect(() => wearable.registrarBatimento(0)).toThrow("Batimento inválido");
  });

  test("registra e calcula a média de oxigenação", () => {
    expect(wearable.registrarOxigenacao(96)).toBe(1);
    wearable.registrarOxigenacao(98);
    expect(wearable.mediaOxigenacao()).toBe(97);
    expect(() => wearable.registrarOxigenacao(101)).toThrow("Oxigenação inválida");
  });

  test("acompanha passos e progresso da meta", () => {
    expect(wearable.definirMetaPassos(8000)).toBe(8000);
    expect(wearable.registrarPassos(2000)).toBe(2000);
    wearable.registrarPassos(2000);
    expect(wearable.totalPassos()).toBe(4000);
    expect(wearable.progressoMetaPassos()).toBe(50);
  });

  test("registra dados de sono e temperatura", () => {
    expect(wearable.registrarSono(7.5)).toBe(1);
    wearable.registrarSono(8);
    expect(wearable.totalSono()).toBe(15.5);
    expect(wearable.ultimaTemperatura()).toBeNull();
    expect(wearable.registrarTemperatura(36.4)).toBe(1);
    expect(wearable.ultimaTemperatura()).toBe(36.4);
  });

  test("adiciona e lista alertas sem expor o array interno", () => {
    wearable.adicionarAlerta("Hora de caminhar");
    const alertas = wearable.listarAlertas();
    alertas.push("Alerta externo");

    expect(wearable.listarAlertas()).toEqual(["Hora de caminhar"]);
  });

  test("sincroniza apenas quando está conectado", () => {
    const data = new Date("2026-08-25T12:00:00Z");

    expect(() => wearable.sincronizar(data)).toThrow("Wearable desconectado");
    wearable.conectar();
    expect(wearable.sincronizar(data)).toBe(data);
  });

  test("consulta e recarrega a bateria até o limite", () => {
    expect(wearable.obterNivelBateria()).toBe(40);
    expect(wearable.carregarBateria(30)).toBe(70);
    expect(wearable.carregarBateria(50)).toBe(100);
  });
});
