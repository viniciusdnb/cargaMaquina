document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('form-fila').addEventListener('submit', async function(form){
        form.preventDefault();
        var tables = form.target.querySelectorAll("table");
        var groupTbody =[];
        Array.from(tables).forEach(table=>{
            groupTbody.push(table.querySelector("tbody"));
        });
        var newOrderFila = [];
       Array.from(groupTbody).forEach(tbody =>{
        var linhas = tbody.querySelectorAll(".linha");
        var ordem = 0;
        
        linhas.forEach(linha=>{            
            newOrderFila.push({
                "idFilaGravacao": linha.querySelector(".idFilaGravacao").value,
                "idMaquina": linha.querySelector(".idMaquina").value,
                "ordem":ordem
            });
            ordem++
            
        });
       });
        
       await fetch('/fila-serigrafia/recalcular',{
        method: 'post',
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(newOrderFila)
       }).then(res=>{
        if(res.ok){
            location.reload();
        }
       })

    });
});