$(document).ready(function() {
    $('#idpersona').attr('disabled', 'disabled'); 
    $('#nombre').attr('disabled', 'disabled'); 
    $('#idrequest').attr('disabled', 'disabled'); 
    $(document).on("click", "#realirequest", function () {
        
         let id = $(this).closest('tr').find('td').eq(2).text();
         let idrealirequest = $(this).closest('tr').find('td').eq(0).text();
         $( "#idrequest" ).val(idrealirequest);
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
                        $( "#nombre" ).val(element[1] + " "+element[2] + " "+element[3]);
                    });
                }

            }
         });
    });
    $(document).on("click", "#genrequest", function () {

        let tituloapoyo = $('#tituloapoyo').val();
        let descripcionapoyo = $('#descripcionapoyo').val();
        let fecharealiapoyo = $('#fecharealiapoyo').val();
        let foto = $('#foto').val();

        

        if(tituloapoyo === '' || descripcionapoyo === '' || fecharealiapoyo === ''|| foto === ''){
            Swal.fire(
                'Atención!',
                'Algunos campos son requeridos',
                'info'
            )
            return false;
        }else{
            $('#idpersona').attr('disabled', false); 
            $('#idrequest').attr('disabled', false);
        } 

    });
   
});
