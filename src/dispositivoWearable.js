class DispositivoWearable {
  constructor(nome, bateria = 100) {
    this.nome = nome;
    this.bateria = Math.max(0, Math.min(100, bateria));
    this.conectado = false;
    this.passos = [];
    this.metaPassos = 10000;
    this.batimentos = [];
    this.oxigenacao = [];
    this.sono = [];
    this.temperaturas = [];
    this.alertas = [];
    this.ultimaSincronizacao = null;
  }

  conectar() {
    this.conectado = true;
    return this.conectado;
  }

  desconectar() {
    this.conectado = false;
    return this.conectado;
  }

  estaConectado() {
    return this.conectado;
  }

  registrarBatimento(valor) {
    if (valor <= 0) throw new Error("Batimento inválido");
    this.batimentos.push(valor);
    return this.batimentos.length;
  }

  mediaBatimentos() {
    if (this.batimentos.length === 0) return 0;
    const total = this.batimentos.reduce((soma, valor) => soma + valor, 0);
    return total / this.batimentos.length;
  }

  registrarOxigenacao(valor) {
    if (valor < 0 || valor > 100) throw new Error("Oxigenação inválida");
    this.oxigenacao.push(valor);
    return this.oxigenacao.length;
  }

  mediaOxigenacao() {
    if (this.oxigenacao.length === 0) return 0;
    const total = this.oxigenacao.reduce((soma, valor) => soma + valor, 0);
    return total / this.oxigenacao.length;
  }

  registrarPassos(quantidade) {
    if (!Number.isInteger(quantidade) || quantidade < 0) {
      throw new Error("Quantidade de passos inválida");
    }
    this.passos.push(quantidade);
    return this.totalPassos();
  }

  totalPassos() {
    return this.passos.reduce((soma, quantidade) => soma + quantidade, 0);
  }

  definirMetaPassos(meta) {
    if (!Number.isInteger(meta) || meta <= 0) throw new Error("Meta inválida");
    this.metaPassos = meta;
    return this.metaPassos;
  }

  progressoMetaPassos() {
    return Math.min(100, (this.totalPassos() / this.metaPassos) * 100);
  }

  registrarSono(horas) {
    if (horas < 0 || horas > 24) throw new Error("Duração de sono inválida");
    this.sono.push(horas);
    return this.sono.length;
  }

  totalSono() {
    return this.sono.reduce((soma, horas) => soma + horas, 0);
  }

  registrarTemperatura(valor) {
    if (!Number.isFinite(valor)) throw new Error("Temperatura inválida");
    this.temperaturas.push(valor);
    return this.temperaturas.length;
  }

  ultimaTemperatura() {
    if (this.temperaturas.length === 0) return null;
    return this.temperaturas[this.temperaturas.length - 1];
  }

  adicionarAlerta(mensagem) {
    if (!mensagem) throw new Error("Mensagem inválida");
    this.alertas.push(mensagem);
    return this.alertas.length;
  }

  listarAlertas() {
    return [...this.alertas];
  }

  sincronizar(data = new Date()) {
    if (!this.conectado) throw new Error("Wearable desconectado");
    this.ultimaSincronizacao = data;
    return this.ultimaSincronizacao;
  }

  obterNivelBateria() {
    return this.bateria;
  }

  carregarBateria(quantidade) {
    if (quantidade <= 0) throw new Error("Carga inválida");
    this.bateria = Math.min(100, this.bateria + quantidade);
    return this.bateria;
  }
}

module.exports = DispositivoWearable;
