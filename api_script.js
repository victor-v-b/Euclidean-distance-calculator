
//numero de formularios de endereço
var contador = 1;

//botao que adiciona nova linha de formulário
var btn_add = document.getElementById('add');

btn_add.addEventListener('click', function(){
	contador ++;
	createForm();		
}
);

//funcao que adiciona um formulario
function createForm(){
	
	//cria o form
	var formulario = document.createElement('form');
	formulario.setAttribute('id', 'form_' + contador);
	
	//adiciona o form à div
	var div = document.getElementById('div');
	div.appendChild(formulario);
	
		//cria inputs para serem adicionados ao form
		var Rua = document.createElement('input');
		Rua.setAttribute('type', 'text');
		Rua.setAttribute('placeholder', 'Rua');
		
		var Numero = document.createElement('input');
		Numero.setAttribute('type', 'number');
		Numero.setAttribute('placeholder', 'Número');
		
		var Bairro = document.createElement('input');
		Bairro.setAttribute('type', 'text');
		Bairro.setAttribute('placeholder', 'Bairro');

		var Cidade = document.createElement('input');
		Cidade.setAttribute('type', 'text');
		Cidade.setAttribute('placeholder', 'Cidade');
		
		var Estado = document.createElement('input');
		Estado.setAttribute('type', 'text');
		Estado.setAttribute('placeholder', 'Estado');
		Estado.setAttribute('maxlength', '2');

	//adiciona inputs ao form
	var formulario_x = document.getElementById('form_'+ contador);
	formulario_x.appendChild(Rua);
	formulario_x.appendChild(Numero);
	formulario_x.appendChild(Bairro);
	formulario_x.appendChild(Cidade);
	formulario_x.appendChild(Estado);
}




//arrays para agrupar elementos
var ruas =[];
var numeros =[];
var bairros =[];
var cidades =[];
var estados =[];

var camposVazios = 0;

//funcionalidade do botão calcular
var btn_submit = document.getElementById('btn_submit');
btn_submit.addEventListener('click', function(){		

	//minimo de dois endereços (contador)
	if(contador > 1){

		//pega o valor inputado em todos os campos
		var input = document.querySelectorAll('input')

			for (var i = 0; i < input.length; i++) {
				
				var valorInput = input[i].value;				
				
					//se não houverem campos vazios, popula as arrays (ruas, bairros, etc.)
					if(valorInput != "" && (input[i].type !="button")) { 
																	
						if ( i%5 == 1){						
						ruas.push(valorInput);					
						}
						
						if ( i%5 == 2){					
						numeros.push(valorInput);						}
						
						if ( i%5 == 3){					
						bairros.push(valorInput);
						}
						
						if ( i%5 == 4){					
						cidades.push(valorInput);
						}
						
						if ( i%5 == 0){					
						estados.push(valorInput);
						}
					
					//contador de campos vazios
					}else if (valorInput == ""){
						camposVazios = camposVazios + 1;			
					}	
										
			}		//se houverem campos vazios, alerta
					if (camposVazios > 0){
						alert('Há '+ camposVazios + ' campos vazios.');
						camposVazios = 0;
					
					//se tudo estiver preenchido, acessa a API e disponibiliza na página
					}else{
					
					document.getElementById('btn_submit').disabled = true;
					document.getElementById('btn_reveal').disabled = false;
					
					trazCoordenadas();
					
										
					}
			
	//alerta se houver apenas 1 endereço							
	}else{
	alert('Adicione 2 ou mais endereços');
	}	

});

//declarando arrays para latitudes e longitudes
var listaLat = [];
var listaLng = [];

//async await permite que os requests sejam processados em ordem
async function trazCoordenadas(){

		for (var i = 0; i < contador; i++) {		

		//biblioteca para http requests "axios"
		await axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
			params:{
				address: ruas[i] + ',' + numeros[i] + ',' + bairros[i] + ',' + cidades[i] + ',' + estados[i],
				key: 'AIzaSyCX1NvQkPdtq_LT82p89C0Ou6-nb7sSD24'
				
			}
		})
		.then(function(response){
			//log da requisicao completa
			console.log(response);
			
			//log da latitude e longitude
			var Lat = response.data.results[0].geometry.location.lat;
			var Lng = response.data.results[0].geometry.location.lng;			
			
			listaLat.push(Lat);
			listaLng.push(Lng);
			
			console.log(Lat);
			console.log(Lng);			
		})
		}
} 

//distancia numérica e nome das ruas comparadas
var listaDistancias = [];
var valorListaDistancias = [];

//declarando a funcão que calcula as distâncias entre pontos
function calculaDistancias(){	
	
var n = listaLat.length;

	//itera por todas as combinações dois a dois	
	var k = 0;
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			if (i != j) {
				
				//calculo da distancia em um plano
			var	distancia = Math.sqrt(Math.pow(listaLat[i] - listaLat[j], 2) + Math.pow(listaLng[i] - listaLng[j], 2));
				
				//popula a array de distancias
				listaDistancias.push(distancia);
				
				//popula a array com o nome das ruas comparadas
				valorListaDistancias.push(ruas[i] + ' x ' + ruas[j]); 
				
				display2.innerHTML += ruas[i] + ' x ' + ruas[j] + ': ' + listaDistancias[k++] + '<br />';
				
				
			}
		}		
	}
		//chama função que compara distancias
		comparaDistâncias();		
}


//funcionalidade do botão revelar
var display = document.getElementById("lat-lng-display");
var display2 = document.getElementById("distancia-display");
var display3 = document.getElementById("menor-maior-display");

var btn_reveal = document.getElementById('btn_reveal');
btn_reveal.addEventListener('click', function(){
	
		//chamando a função de cálculo
		calculaDistancias();
		
		document.getElementById('btn_reveal').disabled = true;
		document.getElementById('coordenadas').style.visibility = 'visible';
		document.getElementById('distancias').style.visibility = 'visible';
	
		//printa latitudes e longitudes		
		for (let i = 0; i < listaLat.length; i++) {
			display.innerHTML += ruas[i] + ': ' + listaLat[i] + ' ' + listaLng[i] + ' &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp ' + 'https://www.google.com/maps?q=' + listaLat[i] + '+' + listaLng[i] + '<br/> ';;
		}	
	
});

var maior = '';
var menor = '';

//declarando função que compara distancias
function comparaDistâncias(){

	maior = listaDistancias[0];
	menor = listaDistancias[0];

	maiorNome = valorListaDistancias[0];
	menorNome = valorListaDistancias[0];
	
	//itera pela lista de distancias e nome das ruas comparadas
	for (var i = 0; i < listaDistancias.length; i++) {

	   if (listaDistancias[i] > maior) {
		maior = listaDistancias[i];
		maiorNome = valorListaDistancias[i];

	  } else if (listaDistancias[i] < menor) {
		menor = listaDistancias[i];
		menorNome = valorListaDistancias[i];
	  }  
	}
	
	display3.innerHTML += 'Maior distância: ' + maior + ' ' + maiorNome + '<br />' + 'Menor distância: ' + menor + ' ' + menorNome;	
}