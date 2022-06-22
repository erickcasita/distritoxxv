$(document).ready(function () {

    //CONVIRTIENDO INPUTS EN LETRAS MAYUSCULAS
  
    $("#solicitud").on("keypress", function () {
        $input = $(this);
        setTimeout(function () {
          $input.val($input.val().toUpperCase());
        }, 50);
       
      });
    
});