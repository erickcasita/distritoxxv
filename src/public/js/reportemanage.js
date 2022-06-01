$(document).ready(function () {
    
    $(document).on("change", "#municipios", function () {

        let optionSelected = $("option:selected", this);
        let valueSelected = optionSelected.val();
        const values = {
            clvmunicipio: valueSelected
        }
        $.ajax({
            method: 'POST',
            url: '/dashboard/validatemunicipios',
            data: values,
            success: function (result) {
                if (!result) {
                    console.log('No hay respuesta en el server');
                } else {
                    $('#colonia').empty().append('');
                    $('#colonia').append("<option value='" + 0 + "'></option>");
                    result.forEach(element => {
                        
                        $('#colonia').append("<option value='" + element[0] + "'>" + element[1] + "</option>");


                    });
                }
            }
        });

    });

});

