$(document).ready(function() {
    $('#idpersona').attr('disabled', 'disabled'); 
    $('#nombrecargo').attr('disabled', 'disabled'); 
    $('#nombre').attr('disabled', 'disabled'); 
    $(document).on("click", "#newrequest", function () {
         let id = $(this).closest('tr').find('td:first').text();
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
                        $( "#idpersona" ).val(element[0]);
                        $( "#nombrecargo" ).val(element[4]);
                        $( "#nombre" ).val(element[1] + " "+element[2] + " "+element[3]);
                    });
                }

            }
         });
    });

   
});