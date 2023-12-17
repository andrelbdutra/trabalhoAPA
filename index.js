const fs = require('fs');

var pivotCase;

function getRandomInt(max) 
{
    return Math.floor(Math.random() * max);
}

function getRandomArbitrary(min, max) 
{
    return Math.random() * (max - min + 1) + min;
}

function averageArray(arr)
{
    let sum = 0;
    for(let i = 0; i < arr.length; i++)
    {
        sum += arr[i];
    }

    return sum/arr.length;
}

function generateUnorderedArrayByDegree(deg,size)
{
    let arr = Array.from({length: size}, (_, i) => i + 1);
    
    let swaps = Math.floor(size * (deg/100));

    for(let i = 0; i < swaps; i++)
    {
        let i = getRandomInt(size);
        let j = getRandomInt(size);

        if(i != j)
        {
            [arr[i],arr[j]] = [arr[j],arr[i]];
        }
        else
        {
            i--;
        }
    }

    return arr;
}

function randPartition(arr,l,h)
{
    let rand = getRandomArbitrary(l, h);
    [arr[rand],arr[h]] = [arr[h],arr[rand]];
    let pivot = arr[rand];
    let i = l;
    for (let j = l; j < h; j++) 
    {
        if (arr[j] < pivot) 
        {
            [arr[i],arr[j]] = [arr[j],arr[i]];
            i++;
        }
    }

    [arr[i],arr[h]] = [arr[h],arr[i]];

    return i;
}

function kMininum(arr,l,h,k)
{
    if(l==h)
    {
        return arr[l];
    }
    
    let q = randPartition(arr,l,h);

    if(k == q)
    {
        return arr[q];
    }

    if(k < q)
    {
        return kMininum(arr,l, q - 1,k);
    }
    else
    {
        return kMininum(arr,q + 1,h,k);
    }
}

function findPivot(arr,l,h)
{
    let prox = l + 1;
    for(let i = l; i < h; i++)
    {
        if(arr[i] > arr[prox])
        {
            return arr[i];
        }
        else
        {
            prox++;
        }
    }

    return -1;
}

function pivotChoice(arr,l,h)
{
    let pivot;
    switch(pivotCase)
    {
        case 'firstElem':
            pivot = arr[l];
            break;
        case 'middleElem':
            pivot = arr[Math.floor((h - l)/2) + l]
            break;
        case 'meanFML':
            pivot = (arr[l] + arr[Math.floor((h - l)/2) + l] + arr[h])/3;
            break;
        case 'rand':
            pivot = arr[getRandomArbitrary(l,h)];
            break;
        case 'medianElem':
            let auxArr = arr.slice(l,h+1);
            pivot = kMininum(auxArr,0,auxArr.length - 1,Math.floor((auxArr.length + 1)/2) - 1);
            break;
        case 'findPivot':
            pivot = findPivot(arr,l,h);
            break;
        default:
            pivot = -1;
            break;
    }

    return pivot;
}

function partition(arr,l,h)
{
    let pivot = pivotChoice(arr,l,h);

    if(pivot < 0) return -1;

    let i = l - 1;
    let j = h + 1;

    while(true)
    {
        do{
            i++;
        } while(arr[i] < pivot);

        do{
            j--;
        } while(arr[j] > pivot);

        if(i >= j)
        {
            return j;
        }

        [arr[i],arr[j]] = [arr[j],arr[i]];
    }
}

function quickSort(arr,l,h)
{
    if(l >= 0 && h >= 0 && l < h)
    {
        let p = partition(arr,l,h);
        if(p >= 0)
        {
            quickSort(arr,l,p);
            quickSort(arr,p+1,h);
        }
    }
}

function generateData(maxExp,degree)
{
    let size = 10;
    let labels = [];
    let meanTimes = [];

    for(let i = 2; i <= maxExp;i++)
    {
        let times = [];
        size = size * 10;
        labels.push(`10^(${i})`);

        for(let j = 0; j < 10; j++)
        {
            let arr = generateUnorderedArrayByDegree(degree,size);
            let start = performance.now();
            quickSort(arr,0,arr.length - 1);
            let end = performance.now();
            times.push(end - start);
        }

        meanTimes.push(averageArray(times));
    }

    return [labels,meanTimes];
}

function generateHTMLTemplate(id)
{
    let temp = `<div class="col-4"> <canvas id="${id}"></canvas> </div>\n`;
    return temp;
}

function generateJSTemp(id,labels,times,title)
{
    let temp = `new Chart(document.getElementById('${id}'), {
        type: 'line',
        data: {
          labels: ${JSON.stringify(labels)},
          datasets: [{
            label: 'Média de Tempo',
            data: ${JSON.stringify(times)},
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            title: {
                display: true,
                text: '${title}'
            }
        }
        }
      });\n`;

      return temp;
}

function generateHTMLPage(html,js)
{
    let temp = `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trabalho APA - Gráficos</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    </head>
    <body>
        <div class="container-fluid">
            <div class="row">
                ${html.join('')}
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
            ${js.join('')}
        </script>
    </body>
    </html>`

    fs.writeFile('./graph.html',temp,err =>{
        if(err)
        {
            console.error(err);
        }
    });
}

function runTests()
{
    let pivots = ['firstElem','middleElem','meanFML','rand','medianElem','findPivot'];
    let degrees = [5,25,45];
    let htmlTemps = [];
    let jsTemps = [];

    for(let i = 0; i < pivots.length; i++)
    {
        pivotCase = pivots[i];
        for(let j = 0; j < degrees.length; j++)
        {
            [labels,times] = generateData(5,degrees[j]);
            htmlTemps.push(generateHTMLTemplate(`${pivots[i]}${j}`));
            jsTemps.push(generateJSTemp(`${pivots[i]}${j}`,labels,times,`${pivots[i]} ${degrees[j]}%`));
        }
    }

    generateHTMLPage(htmlTemps,jsTemps);
}

runTests();