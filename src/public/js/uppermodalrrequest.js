$(document).ready(function () {

    //CONVIRTIENDO INPUTS EN LETRAS MAYUSCULAS
  
    $("#tituloapoyo").on("keypress", function () {
        $input = $(this);
        setTimeout(function () {
          $input.val($input.val().toUpperCase());
        }, 50);
       
      });

      $("#descripcionapoyo").on("keypress", function () {
        $input = $(this);
        setTimeout(function () {
          $input.val($input.val().toUpperCase());
        }, 50);
       
      });

      $("#comentarioapoyo").on("keypress", function () {
        $input = $(this);
        setTimeout(function () {
          $input.val($input.val().toUpperCase());
        }, 50);
       
      });

      
    
});