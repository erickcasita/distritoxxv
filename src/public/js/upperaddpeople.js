$(document).ready(function () {
    
    //CONVIRTIENDO INPUTS EN LETRAS MAYUSCULAS
  
    $("#nombre").on("keypress", function () {
      $input = $(this);
      setTimeout(function () {
        $input.val($input.val().toUpperCase());
      }, 50);
     
    });
  
    $("#apellidop").on("keypress", function () {
      $input = $(this);
      console.log($input);
      setTimeout(function () {
        $input.val($input.val().toUpperCase());
  
      }, 50);
    });
    $("#apellidom").on("keypress", function () {
        $input = $(this);
        console.log($input);
        setTimeout(function () {
          $input.val($input.val().toUpperCase());
    
        }, 50);
      });
      $("#direccion").on("keypress", function () {
        $input = $(this);
        console.log($input);
        setTimeout(function () {
          $input.val($input.val().toUpperCase());
    
        }, 50);
      });
  
  });