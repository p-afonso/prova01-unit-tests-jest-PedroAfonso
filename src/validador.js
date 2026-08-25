class Validador {
  ehString(valor) {
    return typeof valor === "string";
  }

  ehNumero(valor) {
    return typeof valor === "number" && Number.isFinite(valor);
  }

  ehBooleano(valor) {
    return typeof valor === "boolean";
  }

  ehArray(valor) {
    return Array.isArray(valor);
  }

  ehObjeto(valor) {
    return valor !== null && typeof valor === "object" && !Array.isArray(valor);
  }

  estaVazio(valor) {
    if (valor === null || valor === undefined) return true;
    if (typeof valor === "string" || Array.isArray(valor)) return valor.length === 0;
    if (this.ehObjeto(valor)) return Object.keys(valor).length === 0;
    return false;
  }

  ehPositivo(numero) {
    return this.ehNumero(numero) && numero > 0;
  }

  ehNegativo(numero) {
    return this.ehNumero(numero) && numero < 0;
  }

  ehPar(numero) {
    return Number.isInteger(numero) && numero % 2 === 0;
  }

  ehImpar(numero) {
    return Number.isInteger(numero) && Math.abs(numero % 2) === 1;
  }

  estaNoIntervalo(numero, minimo, maximo) {
    return this.ehNumero(numero) && numero >= minimo && numero <= maximo;
  }

  temTamanhoMinimo(texto, minimo) {
    return this.ehString(texto) && texto.length >= minimo;
  }

  temTamanhoMaximo(texto, maximo) {
    return this.ehString(texto) && texto.length <= maximo;
  }

  ehEmail(email) {
    if (!this.ehString(email)) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  ehUrl(url) {
    if (!this.ehString(url)) return false;

    try {
      const endereco = new URL(url);
      return endereco.protocol === "http:" || endereco.protocol === "https:";
    } catch {
      return false;
    }
  }

  contemApenasLetras(texto) {
    return this.ehString(texto) && /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(texto);
  }

  contemApenasNumeros(texto) {
    return this.ehString(texto) && /^\d+$/.test(texto);
  }

  ehPalindromo(texto) {
    if (!this.ehString(texto)) return false;
    const normalizado = texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

    return normalizado === normalizado.split("").reverse().join("");
  }

  arraysSaoIguais(primeiro, segundo) {
    return (
      Array.isArray(primeiro) &&
      Array.isArray(segundo) &&
      primeiro.length === segundo.length &&
      primeiro.every((item, indice) => Object.is(item, segundo[indice]))
    );
  }

  possuiPropriedade(objeto, propriedade) {
    return (
      this.ehObjeto(objeto) &&
      Object.prototype.hasOwnProperty.call(objeto, propriedade)
    );
  }
}

module.exports = Validador;
