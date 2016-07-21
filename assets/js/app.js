(function () {
    /* Eventos disparados */
    $(window).load(desenharMapa);

    /* Variáveis globais */
    var app = angular.module('Dijkstra', []);
    
    var vertices = new Array();
    var arestas = new Array();
    var verticeInicial;
    var verticeFinal;
    
    var canvasId = 'mapa';
    var porcentagemLargura;
    var porcentagemAltura;    
    
    var fonte = '16px Arial bold';
    var raioVertice = 5;
    var larguraAresta = 2;
    var corTexto = '#696969';
    var corContorno = '#C0C0C0';
    var corVerticeNormal = '#8B4513';
    var corVerticeVisitado = '#0000FF';
    var corVerticeCerto = '#00FF00';
    var corArestaNormal = '#DA70D6';
    var corArestaVisitada = '#DAA520';
    var corArestaCerta = '#FF0000';
    
    /* Definição dos objetos e funções do algoritmo */
    function Vertice() {
        this.cor = corVerticeNormal;
        this.nome;
        this.eixoX = 0;
        this.eixoY = 0;
        this.checagem = false;
        this.verticeAnterior;
        this.custo;
    }

    function Aresta() {
        this.cor = corArestaNormal;
        this.verticeInicio;
        this.verticeFim;
        this.distancia = 1;
    }

    // Funções de teste
    function testePadrao() {
        var vertice = new Vertice();
        vertice.nome = 'A';
        vertice.eixoX = 10;
        vertice.eixoY = 10;
        vertices.push(vertice);
        var vertice = new Vertice();
        vertice.nome = 'B';
        vertice.eixoX = 25;
        vertice.eixoY = 10;
        vertices.push(vertice);
        var vertice = new Vertice();
        vertice.nome = 'C';
        vertice.eixoX = 40;
        vertice.eixoY = 10;
        vertices.push(vertice);
        var vertice = new Vertice();
        vertice.nome = 'D';
        vertice.eixoX = 55;
        vertice.eixoY = 10;
        vertices.push(vertice);
        var vertice = new Vertice();
        vertice.nome = 'E';
        vertice.eixoX = 25;
        vertice.eixoY = 25;
        vertices.push(vertice);
        var vertice = new Vertice();
        vertice.nome = 'F';
        vertice.eixoX = 10;
        vertice.eixoY = 55;
        vertices.push(vertice);
        var vertice = new Vertice();
        vertice.nome = 'G';
        vertice.eixoX = 70;
        vertice.eixoY = 10;
        vertices.push(vertice);
        var vertice = new Vertice();
        vertice.nome = 'Y';
        vertice.eixoX = 0;
        vertice.eixoY = 0;
        vertices.push(vertice);
        var vertice = new Vertice();
        vertice.nome = 'Z';
        vertice.eixoX = 100;
        vertice.eixoY = 100;
        vertices.push(vertice);
        var aresta = new Aresta();
        aresta.distancia = 10;
        aresta.verticeInicio = vertices[0];
        aresta.verticeFim = vertices[1];
        arestas.push(aresta);
        var aresta = new Aresta();
        aresta.distancia = 6;
        aresta.verticeInicio = vertices[1];
        aresta.verticeFim = vertices[2];
        arestas.push(aresta);
        var aresta = new Aresta();
        aresta.distancia = 2;
        aresta.verticeInicio = vertices[2];
        aresta.verticeFim = vertices[3];
        arestas.push(aresta);
        var aresta = new Aresta();
        aresta.distancia = 3;
        aresta.verticeInicio = vertices[6];
        aresta.verticeFim = vertices[3];
        arestas.push(aresta);
        var aresta = new Aresta();
        aresta.distancia = 12;
        aresta.verticeInicio = vertices[0];
        aresta.verticeFim = vertices[4];
        arestas.push(aresta);
        var aresta = new Aresta();
        aresta.distancia = 14;
        aresta.verticeInicio = vertices[0];
        aresta.verticeFim = vertices[5];
        arestas.push(aresta);
        var aresta = new Aresta();
        aresta.distancia = 1;
        aresta.verticeInicio = vertices[4];
        aresta.verticeFim = vertices[5];
        arestas.push(aresta);
        var aresta = new Aresta();
        aresta.distancia = 1;
        aresta.verticeInicio = vertices[5];
        aresta.verticeFim = vertices[2];
        arestas.push(aresta);
        var aresta = new Aresta();
        aresta.distancia = 3.5;
        aresta.verticeInicio = vertices[5];
        aresta.verticeFim = vertices[3];
        arestas.push(aresta);
        var aresta = new Aresta();
        aresta.distancia = 5.5;
        aresta.verticeInicio = vertices[0];
        aresta.verticeFim = vertices[7];
        arestas.push(aresta);
        var aresta = new Aresta();
        aresta.distancia = 5.5;
        aresta.verticeInicio = vertices[5];
        aresta.verticeFim = vertices[8];
        arestas.push(aresta);
    }

    function efetuarPesagem(raiz) {
        var fila = [];
        fila.push(raiz);
        fila[0].custo = 0;
        
        do {
            // Desenha o vértice
            fila[0].cor = corVerticeVisitado;
            
            var vizinhos = [];
            for (var i = 0; i < arestas.length; i++) {

                if ((arestas[i].verticeInicio === fila[0])) {
                    // Risca a aresta                  
                    arestas[i].cor = corArestaVisitada;
                    
                    // Reajuste de custo / Relaxamento dos vértices
                    if (arestas[i].verticeFim.custo === undefined || ((arestas[i].distancia + fila[0].custo) < arestas[i].verticeFim.custo)) {
                        arestas[i].verticeFim.custo = (arestas[i].distancia + fila[0].custo);
                        arestas[i].verticeFim.verticeAnterior = fila[0];
                    }

                    // Verifica os que não foram checados e os marca
                    if (arestas[i].verticeFim.checagem === false) {
                        arestas[i].verticeFim.checagem = true;
                                                
                        vizinhos.push(arestas[i].verticeFim);
                    }
                }
            }

            // Ordena os vizinhos em ordem crescente baseado em seu custo
            vizinhos.sort(function (a, b) {
                return a.custo - b.custo;
            });
            for (var i = 0; i < vizinhos.length; i++) {
                fila.push(vizinhos[i]);
            }

            // Retira o primeiro nó da fila
            fila.shift();
        } while (fila.length > 0);
    }

    function mostrarTrajeto() {
        var texto, caminho = '';
        var tragetoria = [];
        var vertice = verticeFinal;
        do {
            vertice.cor = corVerticeCerto;
            
            arestas.forEach(function(elemento){
                if((elemento.verticeFim === vertice) && (elemento.verticeInicio === vertice.verticeAnterior) && (vertice.verticeAnterior !== undefined)){
                    elemento.cor = corArestaCerta;
                }
            });
            
            tragetoria.push(vertice);
            vertice = vertice.verticeAnterior;
        } while (vertice !== undefined);
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
        var largura = $(canvas).width();
        var altura = $(canvas).height();
        porcentagemLargura = ((largura / 100) /2).toFixed();
        porcentagemAltura = ((altura / 100) /2).toFixed();
    }

    function resetarMapa() {
        var canvas = document.getElementById(canvasId);
        var caneta = canvas.getContext("2d");
        caneta.clearRect(0, 0, $(canvas).width(), $(canvas).height());
    }

    function desenharMapa() {
        ajustarCanvas();
        resetarMapa();
        
        var cor = corContorno;        
        for (var i = 0; i <= 100; i += 10) {
            desenharAresta(0, i, 100, i, cor);
            desenharAresta(i, 0, i, 100, cor);
        }
        
        escreverTexto('X' , (porcentagemLargura*50)-6, 16);
        escreverTexto('Y' , 8, (porcentagemAltura*50)+6);
        escreverTexto('(0,0)' , 0, 16);
        escreverTexto('(100,100)' , (porcentagemLargura*100)-64, (porcentagemAltura*100)-6);
        
        arestas.forEach(function(elemento){           
            desenharAresta(elemento.verticeInicio.eixoX, elemento.verticeInicio.eixoY, elemento.verticeFim.eixoX, elemento.verticeFim.eixoY, elemento.cor);
        });
        vertices.forEach(function(elemento){
            desenharVertice(elemento.eixoX, elemento.eixoY, elemento.cor);
        });
    }

    function escreverTexto(texto, x, y){
        var canvas = document.getElementById(canvasId);
        var caneta = canvas.getContext("2d");
        
        caneta.fillStyle = corTexto;
        caneta.font = fonte;
        caneta.fillText(texto, x, y);
    }
    
    function desenharVertice(x, y, cor) {
        var canvas = document.getElementById(canvasId);
        var caneta = canvas.getContext("2d");
        x = (porcentagemLargura * x);
        y = (porcentagemAltura * y);
        caneta.fillStyle = cor;
        caneta.beginPath();
        caneta.arc(x, y, raioVertice, 0, Math.PI * 2, false);
        caneta.fill();
    }

    function desenharAresta(xInicio, yInicio, xFim, yFim, cor) {
        var canvas = document.getElementById(canvasId);
        var caneta = canvas.getContext("2d");
        caneta.strokeStyle = cor;
        caneta.lineWidth = larguraAresta;
        xInicio = (porcentagemLargura * xInicio);
        yInicio = (porcentagemAltura * yInicio);
        xFim = (porcentagemLargura * xFim);
        yFim = (porcentagemAltura * yFim);
        caneta.beginPath();
        caneta.moveTo(xInicio, yInicio);
        caneta.lineTo(xFim, yFim);
        caneta.stroke();
    }

    app.controller('mapaCtrl', function () {
        this.lista_vertices = vertices;
        this.lista_arestas = arestas;
        this.inicio;
        this.fim;
        this.aviso = false;
        this.resultado = false;
        
        testePadrao();
        desenharMapa();
        
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
            this.aviso = true;
            $("#aviso").text("Calculando...");
            verticeInicial = this.inicio;
            verticeFinal = this.fim;
            efetuarPesagem(verticeInicial);
            if (verticeFinal.verticeAnterior === undefined) {
                desenharMapa();
                $("#aviso").text("Impossível calcular uma rota entre estes vértices!");
                this.aviso = true;
                this.resultado = false;
            } else {
                mostrarTrajeto();
                desenharMapa();
                this.aviso = false;
                this.resultado = true;
            }
        };
    });
    app.controller('VerticeCtrl', function () {
        this.formulario = new Vertice();
        this.addVertice = function () {
            vertices.push(this.formulario);
            desenharMapa();            
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
            desenharMapa();
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
