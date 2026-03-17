document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('form-fila').addEventListener('submit', async function(form){
        form.preventDefault();
        console.log(form);
    })
})