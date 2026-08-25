class MissaoEspacial {
  constructor(nomeNave, combustivelMaximo = 100) {
    this.nomeNave = nomeNave;
    this.combustivelMaximo = combustivelMaximo;
    this.combustivel = 0;
    this.tripulacao = [];
    this.carga = [];
    this.coordenadas = { x: 0, y: 0 };
    this.planetasExplorados = [];
    this.amostras = [];
    this.escudoAtivo = false;
    this.integridade = 100;
    this.emMissao = false;
  }

  abastecer(quantidade) {
    if (quantidade <= 0) throw new Error("Quantidade inválida");
    this.combustivel = Math.min(this.combustivel + quantidade, this.combustivelMaximo);
    return this.combustivel;
  }

  consumirCombustivel(quantidade) {
    if (quantidade > this.combustivel) throw new Error("Combustível insuficiente");
    this.combustivel -= quantidade;
    return this.combustivel;
  }

  adicionarTripulante(nome) {
    if (!nome || this.tripulacao.includes(nome)) return false;
    this.tripulacao.push(nome);
    return true;
  }

  removerTripulante(nome) {
    const indice = this.tripulacao.indexOf(nome);
    if (indice === -1) return false;
    this.tripulacao.splice(indice, 1);
    return true;
  }

  adicionarCarga(item, peso) {
    if (!item || peso <= 0) throw new Error("Carga inválida");
    this.carga.push({ item, peso });
    return this.carga.length;
  }

  removerCarga(item) {
    const indice = this.carga.findIndex((carga) => carga.item === item);
    if (indice === -1) return false;
    this.carga.splice(indice, 1);
    return true;
  }

  mover(x, y, custoCombustivel) {
    if (!this.emMissao) throw new Error("Missão não iniciada");
    this.consumirCombustivel(custoCombustivel);
    this.coordenadas = { x, y };
    return { ...this.coordenadas };
  }

  calcularDistanciaDaOrigem() {
    return Math.hypot(this.coordenadas.x, this.coordenadas.y);
  }

  registrarPlaneta(nome) {
    if (!nome || this.planetasExplorados.includes(nome)) return false;
    this.planetasExplorados.push(nome);
    return true;
  }

  planetaFoiExplorado(nome) {
    return this.planetasExplorados.includes(nome);
  }

  coletarAmostra(planeta, tipo) {
    if (!this.planetaFoiExplorado(planeta)) throw new Error("Planeta não explorado");
    this.amostras.push({ planeta, tipo });
    return this.amostras.length;
  }

  contarAmostras(planeta) {
    return this.amostras.filter((amostra) => amostra.planeta === planeta).length;
  }

  ativarEscudo() {
    this.escudoAtivo = true;
    return this.escudoAtivo;
  }

  desativarEscudo() {
    this.escudoAtivo = false;
    return this.escudoAtivo;
  }

  receberDano(dano) {
    const danoFinal = this.escudoAtivo ? dano / 2 : dano;
    this.integridade = Math.max(0, this.integridade - danoFinal);
    return this.integridade;
  }

  repararNave(pontos) {
    this.integridade = Math.min(100, this.integridade + pontos);
    return this.integridade;
  }

  iniciarMissao() {
    if (this.tripulacao.length === 0) throw new Error("Nave sem tripulação");
    if (this.combustivel === 0) throw new Error("Nave sem combustível");
    this.emMissao = true;
    return this.emMissao;
  }

  encerrarMissao() {
    this.emMissao = false;
    return this.emMissao;
  }

  obterStatus() {
    return {
      nave: this.nomeNave,
      combustivel: this.combustivel,
      tripulantes: this.tripulacao.length,
      integridade: this.integridade,
      emMissao: this.emMissao
    };
  }

  podeViajar(custoCombustivel) {
    return (
      this.emMissao &&
      this.integridade > 0 &&
      this.tripulacao.length > 0 &&
      this.combustivel >= custoCombustivel
    );
  }
}

module.exports = MissaoEspacial;
