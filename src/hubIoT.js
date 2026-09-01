class HubIoT {
  constructor(nome) {
    this.nome = nome;
    this.dispositivos = new Map();
    this.automacoes = new Map();
  }

  adicionarDispositivo(id, nome, tipo) {
    if (!id || !nome || !tipo) throw new Error("Dados do dispositivo inválidos");
    if (this.dispositivos.has(id)) throw new Error("Dispositivo já cadastrado");

    this.dispositivos.set(id, {
      id,
      nome,
      tipo,
      online: false,
      ligado: false,
      leituras: [],
      limite: null,
      consumo: 0,
    });
    return this.dispositivos.size;
  }

  removerDispositivo(id) {
    return this.dispositivos.delete(id);
  }

  listarDispositivos() {
    return [...this.dispositivos.values()].map((dispositivo) => ({ ...dispositivo }));
  }

  obterDispositivo(id) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    return { ...dispositivo, leituras: [...dispositivo.leituras] };
  }

  conectarDispositivo(id) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    dispositivo.online = true;
    return dispositivo.online;
  }

  desconectarDispositivo(id) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    dispositivo.online = false;
    dispositivo.ligado = false;
    return dispositivo.online;
  }

  estaOnline(id) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    return dispositivo.online;
  }

  ligar(id) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    if (!dispositivo.online) throw new Error("Dispositivo offline");
    dispositivo.ligado = true;
    return dispositivo.ligado;
  }

  desligar(id) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    dispositivo.ligado = false;
    return dispositivo.ligado;
  }

  alternarEstado(id) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    if (!dispositivo.online) throw new Error("Dispositivo offline");
    dispositivo.ligado = !dispositivo.ligado;
    return dispositivo.ligado;
  }

  registrarLeitura(id, valor, data = new Date()) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    if (!dispositivo.online) throw new Error("Dispositivo offline");
    if (!Number.isFinite(valor)) throw new Error("Leitura inválida");
    dispositivo.leituras.push({ valor, data });
    return dispositivo.leituras.length;
  }

  ultimaLeitura(id) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    if (dispositivo.leituras.length === 0) return null;
    return { ...dispositivo.leituras[dispositivo.leituras.length - 1] };
  }

  mediaLeituras(id) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    if (dispositivo.leituras.length === 0) return 0;
    const total = dispositivo.leituras.reduce((soma, leitura) => soma + leitura.valor, 0);
    return total / dispositivo.leituras.length;
  }

  definirLimite(id, limite) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    if (!Number.isFinite(limite)) throw new Error("Limite inválido");
    dispositivo.limite = limite;
    return dispositivo.limite;
  }

  verificarAlerta(id) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    const leitura = this.ultimaLeitura(id);
    return leitura !== null && dispositivo.limite !== null && leitura.valor > dispositivo.limite;
  }

  consumoTotal() {
    return [...this.dispositivos.values()].reduce(
      (total, dispositivo) => total + dispositivo.consumo,
      0,
    );
  }

  atualizarConsumo(id, quilowattsHora) {
    const dispositivo = this.dispositivos.get(id);
    if (!dispositivo) throw new Error("Dispositivo não encontrado");
    if (!Number.isFinite(quilowattsHora) || quilowattsHora < 0) {
      throw new Error("Consumo inválido");
    }
    dispositivo.consumo += quilowattsHora;
    return dispositivo.consumo;
  }

  criarAutomacao(nome, id, acao) {
    if (!nome || this.automacoes.has(nome)) throw new Error("Automação inválida");
    if (!this.dispositivos.has(id)) throw new Error("Dispositivo não encontrado");
    if (!["ligar", "desligar"].includes(acao)) throw new Error("Ação inválida");
    this.automacoes.set(nome, { id, acao });
    return this.automacoes.size;
  }

  executarAutomacao(nome) {
    const automacao = this.automacoes.get(nome);
    if (!automacao) throw new Error("Automação não encontrada");
    return automacao.acao === "ligar"
      ? this.ligar(automacao.id)
      : this.desligar(automacao.id);
  }

  resumoRede() {
    const dispositivos = [...this.dispositivos.values()];
    return {
      total: dispositivos.length,
      online: dispositivos.filter((dispositivo) => dispositivo.online).length,
      ligados: dispositivos.filter((dispositivo) => dispositivo.ligado).length,
      consumo: this.consumoTotal(),
    };
  }
}

module.exports = HubIoT;
