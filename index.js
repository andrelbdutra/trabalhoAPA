const fs = require('fs');

// Função para criar um array de números de 1 a n embaralhados
function criarArrayEmbaralhado(tamanho, grauDesordenamento) {
  const array = Array.from({ length: tamanho }, (_, index) => index + 1);

  // Determinar o número de swaps com base no grau de desordem especificado
  let numSwaps;
  switch (grauDesordenamento) {
    case 'pouco':
      numSwaps = Math.floor(tamanho * 0.05);
      break;
    case 'medio':
      numSwaps = Math.floor(tamanho * 0.25);
      break;
    case 'muito':
      numSwaps = Math.floor(tamanho * 0.45);
      break;
    default:
      numSwaps = 0;
  }

  // Realizar swaps aleatórios para criar o grau de desordem desejado
  for (let i = 0; i < numSwaps; i++) {
    const idx1 = Math.floor(Math.random() * tamanho);
    const idx2 = Math.floor(Math.random() * tamanho);
    [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
  }

  return array;
}

// Função para trocar elementos de posição no array
function trocar(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

// Função de particionamento para o quicksort
function particionar(array, inicio, fim, pivo) {
  while (inicio <= fim) {
    while (array[inicio] < pivo) {
      inicio++;
    }
    while (array[fim] > pivo) {
      fim--;
    }
    if (inicio <= fim) {
      trocar(array, inicio, fim);
      inicio++;
      fim--;
    }
  }
  return inicio;
}

// Função de ordenação quicksort
function quicksort(array, inicio, fim, tipoPivo) {
  if (inicio < fim) {
    let pivo;
    switch (tipoPivo) {
      case 'primeira':
        pivo = array[inicio];
        break;
      case 'central':
        pivo = array[Math.floor((inicio + fim) / 2)];
        break;
      case 'media':
        pivo = pivoMedia(array.slice(inicio, fim));
        break;
      case 'aleatorio':
        pivo = array[Math.floor(Math.random() * (fim - inicio)) + inicio];
        break;
      case 'mediana':
        pivo = pivoMediana(array.slice(inicio, fim));
        break;
      case 'achaPivo':
        pivo = achaPivo(array.slice(inicio, fim));
        break;
      default:
        console.log('Pivo invalido!');
        return;
    }

    const indiceParticao = particionar(array, inicio, fim, pivo);

    quicksort(array, inicio, indiceParticao - 1, tipoPivo);
    quicksort(array, indiceParticao, fim, tipoPivo);
  }
  return array;
}

// Função para encontrar o pivo média considerando o primeiro, central e último valores da lista
function pivoMedia(array) {
  const inicio = 0;
  const fim = array.length - 1;
  const first = array[inicio];
  const middle = array[Math.floor((fim - inicio) / 2)];
  const last = array[fim];
  return Math.floor((first + middle + last) / 3);
}

// Função para encontrar o pivo mediana
function pivoMediana(array) {
  const inicio = 0;
  const meio = Math.floor((array.length - 1) / 2);
  const fim = array.length - 1;

  const a = array[inicio];
  const b = array[meio];
  const c = array[fim];

  if ((a - b) * (c - a) >= 0) {
    return a;
  } else if ((b - a) * (c - b) >= 0) {
    return b;
  } else {
    return c;
  }
}

// Função para encontrar o pivô pelo procedimento Acha Pivô
function achaPivo(array) {
  for (let i = 1; i < array.length; i++) {
    if (array[i] < array[i - 1]) {
      return array[i];
    }
  }
  // Se todos os elementos estiverem ordenados, retorna o último elemento
  return array[array.length - 1];
}

// Função para salvar um array em um arquivo
function salvarArrayEmArquivo(nomeArquivo, array) {
  fs.writeFile(nomeArquivo, JSON.stringify(array), (err) => {
    if (err) {
      console.error('Erro ao salvar o arquivo:', err);
      return;
    }
    //console.log(`Array salvo em "${nomeArquivo}"`);
  });
}

function calculaMedia(array) {
  const soma = array.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
  const media = soma / array.length;
  return media;
}

function main() {
  var tamanhoArray = 100000; // Tamanho do array desejado
  const grauDesordenamento = 'muito'; // 'pouco', 'medio', 'muito'

  let arrayEmbaralhado;
  let inicio;
  let fim;
  let arrayOrdenado;
  let tempoExecucao;
  let tipoPivo;
  let times = [];
  let N = 10;
  // executa quickSort N vezes e salva média
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  for (let i = 0; i < N; i++) {
    arrayEmbaralhado = criarArrayEmbaralhado(tamanhoArray, grauDesordenamento);       
    tipoPivo = 'mediana' // 'primeira', 'cental', 'media', 'aleatorio', 'mediana', 'achaPivo'
    inicio = performance.now(); // inicio timer
    arrayOrdenado = quicksort([...arrayEmbaralhado], 0, (arrayEmbaralhado.length - 1), tipoPivo); // quicksort(array, inicio, fim, tipoPivo)
    fim = performance.now(); // fim timer
    tempoExecucao = fim - inicio;
    times[i] = tempoExecucao;
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let mediaTempoMilisegundos = calculaMedia(times);
  let mediaTempoSegundos = calculaMedia(times)/1000;
  console.log("\nMédia de tempo de " + qntRepeticoes + " execuções quickSort com "+ tamanhoArray + " elementos com " +
   grauDesordenamento + " desordenamento " + "e pivo " + tipoPivo + ": " +
   "\n", mediaTempoSegundos.toFixed(5) + " segundos");  console.log(mediaTempoMilisegundos.toFixed(5) + " milisegundos");
  salvarArrayEmArquivo('array_embaralhado.json', arrayEmbaralhado);
  salvarArrayEmArquivo('array_ordenado.json', arrayOrdenado);
}

main();