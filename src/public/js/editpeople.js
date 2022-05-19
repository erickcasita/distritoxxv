$(document).ready(function() {
    $('#clvpersona').prop("disabled",true); 
    console.log($('#clvpersona').val());
    $(document).on("change", "#cargo", function(){
        let optionSelected = $("option:selected", this);
        let valueSelected = optionSelected.val();
        if(valueSelected !=1 ){
            

            $('#grupo').empty().append('');
            $('#grupo').attr('disabled', 'disabled'); 
      
        }else{
            $('#grupo').removeAttr('disabled');
        }
       
    });
    

    $(document).on("change", "#municipios", function(){
        let optionSelected = $("option:selected", this);
        let valueSelected = optionSelected.val();
        const values = {
            clvmunicipio : valueSelected
        }
       
        $.ajax({
            method: 'POST',
            url: '/dashboard/validatemunicipios',
            data: values,
            success: function(result){
                if(!result){
                    console.log('No hay respuesta en el server');
                } else {
                    $('#colonia').empty().append('');
                    $('#cdgpostal').empty().append('');
                    result.forEach(element => {

                        $('#colonia').append("<option value='"+element[0]+"'>"+element[1]+"</option>");
                        $('#cdgpostal').append("<option value='"+element[2]+"'>"+element[2]+"</option>");
                        
                    });

                    let valuemunicipio = $( "#municipios option:selected" ).val();
                    let valuecargos = $( "#cargo option:selected" ).val();
                    const values = {
                        clvmunicipio : valuemunicipio
                    }
                    console.log(values);
                    if(valuecargos == 1){

                        $.ajax({
                            method: 'POST',
                            url: '/dashboard/validatecargos',
                            data: values,
                            success: function(result){
                                if(!result){
                                    console.log('No hay respuesta en el server');
                                } else {
                                    $('#grupo').empty().append('');
                                    result.forEach(element => {
                
                                        $('#grupo').append("<option value='"+element[0]+"'>"+element[1]+" "+element[2]+" "+element[3]+" --- " + "CARGO: "+element[4]+" --- " +" MUNICIPIO: "+element[5]+" --- " +" COLONIA: "+ element[7]+ " ---"+" SECCION ELECTORAL: "+element[6]+"</option>");
                                        
                                        
                                    });
                                   
                                }
                            }
                        });
                    }

                   
                }
            }
        });

    });



    
});