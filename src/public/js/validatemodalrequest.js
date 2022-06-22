$("#guardarequest").click(function(){
  

let solicitud = $('#solicitud').val();
let fecha = $('#fecha').val();
let credencial  = $('#credencial').val();

if(solicitud == '' || fecha == '' || credencial == ''){
   Swal.fire(
       '¡Atención!',
       'Algunos campos son requeridos',
       'info'
   )
  

   return false;
} else{
    $('#idpersona').prop("disabled",false); 
}







}); 