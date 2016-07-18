(function () {
    /* Eventos disparados */
    $(window).load(desenharMapa);
    $(window).resize(ajustarCanvas);

    /* Variáveis globais */
    var app = angular.module('Dijkstra', []);
    var vertices = new Array();
    var arestas = new Array();
    var verticeInicial;
    var verticeFinal;
    var canvasId = "mapa";
    var canvasLargura;
    var canvasAltura;

    /* Definição dos objetos e funções do algoritmo */
    function Vertice() {
        this.cor = '#000080';
        this.nome;
        this.eixoX = 0;
        this.eixoY = 0;
        this.checagem = false;
        this.verticeAnterior;
        this.custo;
    }

    function Aresta() {
        this.cor = '#FF0000';
        this.verticeInicio;
        this.verticeFim;
        this.distancia = 1;
    }

    function efetuarPesagem(vertice) {
        vertice.checagem = true;

        var vizinhos = [];
        var contador = 0;
        var menor = null;
        var posicao;

        for (var i = 0; i < arestas.length; i++) {
            if ((arestas[i].verticeInicio === vertice)) {
                // Reajusta custo dos vizinhos
                if (arestas[i].verticeFim.custo === undefined || ((arestas[i].distancia + vertice.custo) < arestas[i].verticeFim.custo)) {
                    arestas[i].verticeFim.custo = (arestas[i].distancia + vertice.custo);
                    arestas[i].verticeFim.verticeAnterior = vertice;
                }

                if (arestas[i].verticeFim.checagem === false) {
                    // Calcula se é o menor caminho a ser seguido
                    if ((menor === null) || (arestas[i].verticeFim.custo < menor)) {
                        menor = arestas[i].verticeFim.custo;
                        posicao = contador;
                    }
                    // Adiciona o vizinho na lista
                    vizinhos.push(arestas[i].verticeFim);
                    contador++;
                }
            }
        }

        // Se tiver vizinho ele vai para o de menor custo
        if (vizinhos.length > 0) {
            efetuarPesagem(vizinhos[posicao]);
        } else if (vertice !== verticeInicial) { // Se voltou para a raiz então a pesagem acabou
            efetuarPesagem(vertice.verticeAnterior);
        }
    }

    function mostrarTrajeto() {
        var texto, caminho = '';
        var tragetoria = [];
        var vertice = verticeFinal;

        tragetoria.push(vertice);
        do {
            vertice = vertice.verticeAnterior;
            tragetoria.push(vertice);
        } while (vertice !== verticeInicial);

        tragetoria.reverse();

        texto = 'Partindo de <b>' + verticeInicial.nome + '</b>, o menor caminho para chegar em <b>' + verticeFinal.nome + '</b> tem um total de <b>' + verticeFinal.custo + ' metros</b>. ';
        texto = texto + 'A menor tragetória possível é:<br><br>';

        for (var i = 0; i < tragetoria.length; i++) {
            if (tragetoria[i] !== verticeFinal) {
                caminho = caminho + '<i>' + tragetoria[i].nome + '</i> <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span> ';
            }
        }
        caminho = caminho + '<i>' + verticeFinal.nome + '</i>';
        caminho = '<b>' + caminho + '</b>';
        texto = '<div class="jumbotron">' + texto + caminho + '</div>';

        var resultado = $("#resultado");
        resultado.html(texto);
    }

    function resetarTrajeto() {
        for (var i = 0; i < vertices.length; i++) {
            vertices[i].custo = undefined;
            vertices[i].checagem = false;
            vertices[i].verticeAnterior = undefined;
        }
        verticeInicial = undefined;
        verticeFinal = undefined;
    }

    /* Funções gráficas */
    function ajustarCanvas() {
        var canvas = document.getElementById(canvasId);
        canvasLargura = (($(canvas).width() / 100).toFixed(2) / 2).toFixed();
        canvasAltura = (($(canvas).height() / 100).toFixed(2) / 2).toFixed();
    }

    function desenharMapa() {
        ajustarCanvas();
        resetarMapa();

        var cor = '#c0c0c0';

        for (var i = 0; i <= 100; i += 10) {
            desenharAresta(0, i, 100, i, cor);
            desenharAresta(i, 0, i, 100, cor);
        }
        // criar algum efeito daorinha
    }

    function resetarMapa() {
        var canvas = document.getElementById(canvasId);
        var caneta = canvas.getContext("2d");
        caneta.clearRect(0, 0, $(canvas).width(), $(canvas).height());
    }

    function desenharVertice(x, y, cor) {
        var canvas = document.getElementById(canvasId);
        var caneta = canvas.getContext("2d");

        x = canvasLargura * x;
        y = canvasAltura * y;

        caneta.fillStyle = cor;
        caneta.beginPath();
        caneta.arc(x, y, 4, 0, Math.PI * 2, false);
        caneta.fill();
    }

    function desenharAresta(xInicio, yInicio, xFim, yFim, cor) {
        var canvas = document.getElementById(canvasId);
        var caneta = canvas.getContext("2d");
        caneta.strokeStyle = cor;
        caneta.lineWidth = 1;

        xInicio = canvasLargura * xInicio;
        yInicio = canvasAltura * yInicio;
        xFim = canvasLargura * xFim;
        yFim = canvasAltura * yFim;

        caneta.beginPath();
        caneta.moveTo(xInicio, yInicio);
        caneta.lineTo(xFim, yFim);
        caneta.closePath();
        caneta.stroke();
    }

    app.controller('mapaCtrl', function () {
        this.lista_vertices = vertices;
        this.lista_arestas = arestas;

        this.inicio;
        this.fim;
        this.aviso = false;
        this.resultado = false;

        this.desativarAviso = function () {
            this.aviso = false;
        };

        this.pesquisaPermitida = function () {
            var permitida = true;
            if (vertices.length < 2 || arestas.length < 1) {
                permitida = false;
            }

            return permitida;
        };

        this.pesquisaInvalida = function () {
            var invalidade = false;
            if (this.inicio === this.fim) {
                invalidade = true;
            } else if (this.inicio === undefined || this.fim === undefined) {
                invalidade = true;
            }

            return invalidade;
        };

        this.calcular = function () {
            resetarTrajeto();

            this.resultado = false;
            this.aviso = "Calculando...";

            verticeInicial = this.inicio;
            verticeInicial.custo = 0;
            verticeFinal = this.fim;

            efetuarPesagem(verticeInicial);

            if (verticeFinal.verticeAnterior === undefined) {
                this.aviso = "Impossível calcular uma rota entre estes vértices!";
                this.resultado = false;

            } else {
                mostrarTrajeto();

                this.aviso = false;
                this.resultado = true;
            }
        };
    });

    app.controller('VerticeCtrl', function () {
        this.formulario = new Vertice();

        this.addVertice = function () {
            vertices.push(this.formulario);

            desenharVertice(this.formulario.eixoX, this.formulario.eixoY, this.formulario.cor);

            this.formulario = new Vertice();
        };

        this.invalido = function () {
            var invalidade = false;
            for (var i = 0; i < vertices.length; i++) {
                if ((vertices[i].eixoX === this.formulario.eixoX) && (vertices[i].eixoY === this.formulario.eixoY)) {
                    invalidade = true;
                }
            }

            if (this.formulario.nome === undefined || this.formulario.nome === "") {
                invalidade = true;
            }

            return invalidade;
        };
    });

    app.controller('ArestaCtrl', function () {
        this.formulario = new Aresta();

        this.addAresta = function () {
            arestas.push(this.formulario);

            desenharAresta(this.formulario.verticeInicio.eixoX, this.formulario.verticeInicio.eixoY, this.formulario.verticeFim.eixoX, this.formulario.verticeFim.eixoY, this.formulario.cor);

            this.formulario = new Aresta();
        };

        this.invalida = function () {
            var invalidade = false;

            for (var i = 0; i < arestas.length; i++) {
                if ((arestas[i].verticeInicio === this.formulario.verticeInicio) && (arestas[i].verticeFim === this.formulario.verticeFim)) {
                    invalidade = true;
                }
            }

            if (this.formulario.verticeInicio === undefined || this.formulario.verticeFim === undefined) {
                invalidade = true;
            } else if (vertices.length < 2) {
                invalidade = true;
            } else if (this.formulario.verticeInicio === this.formulario.verticeFim) {
                invalidade = true;
            }

            return invalidade;
        };
    });

})();