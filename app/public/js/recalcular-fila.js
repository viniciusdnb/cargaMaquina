document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('form-fila').addEventListener('submit', async function(form){
    form.preventDefault();
    var tbody = document.querySelector('tbody');
    var linhas = tbody.querySelectorAll('.linha');
    var idMaquina = document.getElementById('idMaquina').value; 
    var newOrdemFila =[]
    
    var ordem = 0;
    linhas.forEach(linha=>{
        newOrdemFila.push({
            "idFilaMaquina": linha.querySelector('.idFilaMaquina').textContent.trim(),
            "ordem":ordem
        });
        ordem++;
       
    });

    
    var dataForm = {
        "idMaquina":idMaquina,
        "ordem":newOrdemFila
    }

    await fetch('/filamaquina/recalcular', {
        method: 'post',
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(dataForm)
    });

   location.reload();
    
  });
})