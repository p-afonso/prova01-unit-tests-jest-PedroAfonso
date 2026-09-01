const HubIoT = require("../src/hubIoT");

describe("HubIoT", () => {
  let hub;

  beforeEach(() => {
    hub = new HubIoT("Casa Lume");
    hub.adicionarDispositivo("lampada-1", "Lâmpada da sala", "iluminação");
  });

  test("adiciona, consulta, lista e remove dispositivos", () => {
    expect(hub.adicionarDispositivo("sensor-1", "Sensor térmico", "temperatura")).toBe(2);
    expect(hub.obterDispositivo("sensor-1").nome).toBe("Sensor térmico");
    expect(hub.listarDispositivos()).toHaveLength(2);
    expect(hub.removerDispositivo("sensor-1")).toBe(true);
    expect(() => hub.obterDispositivo("sensor-1")).toThrow("Dispositivo não encontrado");
  });

  test("impede o cadastro duplicado", () => {
    expect(() =>
      hub.adicionarDispositivo("lampada-1", "Outra lâmpada", "iluminação"),
    ).toThrow("Dispositivo já cadastrado");
  });

  test("conecta e desconecta um dispositivo", () => {
    expect(hub.estaOnline("lampada-1")).toBe(false);
    expect(hub.conectarDispositivo("lampada-1")).toBe(true);
    expect(hub.estaOnline("lampada-1")).toBe(true);
    expect(hub.desconectarDispositivo("lampada-1")).toBe(false);
  });

  test("liga, desliga e alterna o estado", () => {
    expect(() => hub.ligar("lampada-1")).toThrow("Dispositivo offline");
    hub.conectarDispositivo("lampada-1");
    expect(hub.ligar("lampada-1")).toBe(true);
    expect(hub.alternarEstado("lampada-1")).toBe(false);
    expect(hub.desligar("lampada-1")).toBe(false);
  });

  test("registra e calcula leituras do sensor", () => {
    const data = new Date("2026-09-01T18:00:00Z");
    hub.conectarDispositivo("lampada-1");

    expect(hub.ultimaLeitura("lampada-1")).toBeNull();
    expect(hub.registrarLeitura("lampada-1", 24, data)).toBe(1);
    hub.registrarLeitura("lampada-1", 26, data);

    expect(hub.ultimaLeitura("lampada-1")).toEqual({ valor: 26, data });
    expect(hub.mediaLeituras("lampada-1")).toBe(25);
  });

  test("gera alerta quando a leitura ultrapassa o limite", () => {
    hub.conectarDispositivo("lampada-1");
    expect(hub.definirLimite("lampada-1", 30)).toBe(30);
    hub.registrarLeitura("lampada-1", 31);
    expect(hub.verificarAlerta("lampada-1")).toBe(true);
  });

  test("acumula o consumo dos dispositivos", () => {
    hub.adicionarDispositivo("tomada-1", "Tomada inteligente", "energia");
    expect(hub.atualizarConsumo("lampada-1", 0.4)).toBe(0.4);
    expect(hub.atualizarConsumo("tomada-1", 1.1)).toBe(1.1);
    expect(hub.consumoTotal()).toBeCloseTo(1.5);
  });

  test("cria e executa automações", () => {
    hub.conectarDispositivo("lampada-1");
    expect(hub.criarAutomacao("acender sala", "lampada-1", "ligar")).toBe(1);
    expect(hub.executarAutomacao("acender sala")).toBe(true);
    expect(hub.obterDispositivo("lampada-1").ligado).toBe(true);
  });

  test("resume o estado da rede IoT", () => {
    hub.adicionarDispositivo("sensor-1", "Sensor térmico", "temperatura");
    hub.conectarDispositivo("lampada-1");
    hub.ligar("lampada-1");
    hub.atualizarConsumo("lampada-1", 0.5);

    expect(hub.resumoRede()).toEqual({
      total: 2,
      online: 1,
      ligados: 1,
      consumo: 0.5,
    });
  });
});
