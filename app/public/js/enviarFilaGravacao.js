function enviarFila(el){
    var idForno = el.querySelector(".idForno");
    var idMaquina = el.querySelectorAll('.idMaquina');
    var idOrdemProducao = document.querySelector('#idOrdemProducao').value;
    console.log(idOrdemProducao);
    var objFila = {

        idOrdemProducao:idOrdemProducao,
        idForno:idForno.value        
    };
    var maquinas = [];
    idMaquina.forEach(id=>{
        maquinas.push({idMaquina:id.value});
    });
    objFila["maquinas"]= maquinas;
   
    fetch(`http://192.168.0.15:3000/fila-serigrafia`,{
    method: 'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify(objFila)
   });
}