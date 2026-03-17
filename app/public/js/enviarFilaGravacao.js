function enviarFila(el){
    var idForno = el.querySelector(".idForno");
    var idMaquina = el.querySelectorAll('.idMaquina');
    var idOrdemProducao = document.querySelector('#idOrdemProducao').value;
    var radio = document.querySelectorAll(".form-check-input")
    var radioChecked
    Array.from(radio).forEach(r =>{
       if(r.checked){
        radioChecked = r.value;
       }
    });

   
    var objFila = {

        idOrdemProducao:idOrdemProducao,
        idForno:idForno.value        
    };
    var maquinas = [];
    idMaquina.forEach(id=>{
        maquinas.push({idMaquina:id.value});
    });
    objFila["maquinas"] = maquinas;
    objFila["valueGravacao"] = radioChecked
   
    fetch('/fila-serigrafia',{
    method: 'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify(objFila)
   }).then(res =>{
        if(res.ok){
            location.reload();
        }
   });
   
}