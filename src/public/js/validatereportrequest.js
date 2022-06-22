


    

    $("#agregar").click(function(){
        let fecha1= $('#fecha1').val();
        let fecha2= $('#fecha2').val();
        
        if(fecha1 == '' || fecha2 == ''){
            Swal.fire(
                '¡Atención!',
                'Algunos campos son requeridos',
                'info'
            )
           
            return false;
        }
    }); 
