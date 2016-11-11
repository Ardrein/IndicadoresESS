
var appMod = angular.module('app',[]);

appMod.controller("MainController",['$http',function($http){

	var instancia = this;
	instancia.tokenString = "";
	instancia.mathMLString = "";


	/*
	 * Funcion para obtener el MathML del editor WIRIS.
	 */
	instancia.getMathML = function(){
		instancia.mathMLString = editor.getMathML();
		console.log(instancia.mathMLString);
		var a = instancia.transformarAString(instancia.mathMLString);
		console.log(a);
		instancia.getNumVariables(a);
	}

	/*
	*Funcion para cargar una cadena de contenido de MathML en un objeto XML DOM para poder extraer su contenido.
	*/
	instancia.getDOM = function(mathMLString){
		var parser = new DOMParser();
		return parser.parseFromString(mathMLString,"text/xml");
	}

	/*
	*Funcion para transformar el XML DOM a una cadena .
	*/
	instancia.transformarAString = function(mathMLString){
		var xmlDoc =  instancia.getDOM(mathMLString);

		var nodo = xmlDoc.documentElement;
		return instancia.extraerTokens(nodo);
		
	}

	/*
	*Funcion para transformar la cadena de XML a una cadena normal con las operaciones.
	*/
	instancia.extraerTokens = function(nodo){
		var nodosHijos = nodo.childNodes;
		var resultado = "";
		var nombreEtiqueta = nodo.tagName;
		//length == 0
		if(!nodosHijos.length){
			if (nodo.nodeValue == " ")  resultado = "";
        	else resultado = nodo.nodeValue;

		}else if( nombreEtiqueta == "mi"){
			resultado = nodo.childNodes[0].nodeValue;
		}else if(nombreEtiqueta == "mn" || nombreEtiqueta == "mo"){
			resultado = nodo.childNodes[0].nodeValue;
		}else if(nombreEtiqueta == "mfrac"){
			resultado = "("+instancia.extraerTokens(nodosHijos[0])+")/("+instancia.extraerTokens(nodosHijos[1])+")";
		}else if(nombreEtiqueta == "msup"){
			resultado = "Math.pow("+instancia.extraerTokens(nodosHijos[0])+","+instancia.extraerTokens(nodosHijos[1])+")";
		}else if(nombreEtiqueta == "msqrt"){
			resultado = "Math.sqrt(";
				for(var i =0;i<nodosHijos.length;i++){
				resultado+= instancia.extraerTokens(nodosHijos[i]);
			}
			resultado+=")";
		}else if(nombreEtiqueta == "mfenced"){
			resultado = "(";
				for(var i =0;i<nodosHijos.length;i++){
				resultado+= instancia.extraerTokens(nodosHijos[i]);
			}
			resultado+=")";
		}else if(nombreEtiqueta == "math"){
			for(var i =0;i<nodosHijos.length;i++){
				resultado+= instancia.extraerTokens(nodosHijos[i]);
			}
		}else if(nombreEtiqueta == "mrow" || nombreEtiqueta == "mstyle"){
			for(var i =0;i<nodosHijos.length;i++){
				resultado+= instancia.extraerTokens(nodosHijos[i]);
			}
		}
			
		



		return resultado;
	}


	/*
	*Funcion para extraer un token(variable o número) de una etiqueta cn o ci.
	*/
	instancia.getToken = function(nodo){
		var resultado = "";
		var nombreEtiqueta = nodo.tagName;
		if(nombreEtiqueta == "mn" || nombreEtiqueta == "mi"){
			resultado = nodo.childNodes[0].nodeValue;
		}
	}

	/*
	*Funcion para extraer un operador de una etiqueta.
	*/
	instancia.getOperador = function(nodo){
		var resultado = "";
		var nombreEtiqueta = nodo.tagName;
		

		if(nombreEtiqueta == "mo"){
			resultado = nodo.childNodes[0].nodeValue;
		}

	}

	/*
	*Funcion para extraer un operador representado por una etiqueta.
	*/
	instancia.getOperadorSimbolo  = function(nodo){
		var resultado = "";
		var nombreEtiqueta = nodo.tagName;
		

		if(nombreEtiqueta == "mfrac"){
			resultado = nodo.tagName;
		}else if(nombreEtiqueta == "msup"){
			resultado = nodo.tagName;
		}else if(nombreEtiqueta == "msqrt"){
			resultado = nodo.tagName;
		}else if(nombreEtiqueta == "mfenced"){
			resultado = nodo.tagName;
		}else resultado = "";

	}

	/*
	*Funcion para extraer el contenido de etiquetas como mrow y mstyle.
	*/
	instancia.getContenidoEtiqueta = function(nodo){
		var resultado = "";
		var nombreEtiqueta = nodo.tagName;

		if(nombreEtiqueta == "mrow"){
			resultado = nodo.tagName;
		}else if(nombreEtiqueta == "mstyle"){
			resultado = nodo.tagName;
		}else resultado = "";
		
	}

	/*
	*Funcion para buscar el numero de variables dentro de la cadena extraida de mathml y guardarlas en un arreglo.
	*/
	instancia.getNumVariables = function(fcString){
		//busca los nombres de las variables y si no encuentra retorna un arreglo vacio.
		//g argumento para que busque dentro de toda la cadena.
		var variables = (fcString.match(/[a-z|A-Z|ñ|Ñ]+/g ) || []);
		console.log(variables);
		console.log(variables.length);

		return variables;

	}



	/* FUncion sin uso, el transformador de WIRIS tiene errores al pasar de Presentation a Content MathML
	instancia.getContentMathML = function(){
			$http({
				method: 'GET',
				url: 'http://www.wiris.net/demo/editor/mathml2content?mml='+instancia.mathMLString
			}).success(function(data){
				console.log(data);
			}).error(function(data){
				console.log(data+"error");
			});
	}*/


}]);





