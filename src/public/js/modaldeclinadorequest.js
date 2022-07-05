$(document).ready(function() {
    $('#idpersonadeclinado').attr('disabled', 'disabled'); 
    $('#nombredeclinado').attr('disabled', 'disabled'); 
    $('#idrequestdeclinado').attr('disabled', 'disabled'); 
    $(document).on("click", "#declinadorrequest", function () {
        
         let id = $(this).closest('tr').find('td').eq(2).text();
         let idrealirequest = $(this).closest('tr').find('td').eq(0).text();
         $( "#idrequestdeclinado" ).val(idrealirequest);
         const values = {
            clvpersona : id
        }
       
         $.ajax({

            method: 'POST',
            url: '/dashboard/validaterequest',
            data: values,
            success: function(result){
                if(!result){
                    console.log('No hay respuesta en el server');
                } else {
                    
                    result.forEach(element => {
                        $( "#idpersonadeclinado" ).val(element[0]);
                        $( "#nombredeclinado" ).val(element[1] + " "+element[2] + " "+element[3]);
                    });
                }

            }
         });
    });
    $(document).on("click", "#gendeclinado", function () {

        let motivodeclinado = $('#motivodeclinado').val();


        

        if(motivodeclinado === ''){
            Swal.fire(
                'Atención!',
                'Algunos campos son requeridos',
                'info'
            )
            return false;
        }else{
            $('#idrequestdeclinado').attr('disabled', false); 
            
        } 

    });
   
});
