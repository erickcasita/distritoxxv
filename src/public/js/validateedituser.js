    $("#update").click(function(){
         $('#clvpersona').prop("disabled",false); 
     
    let nombre = $('#nombre').val();
    let apellidop = $('#apellidop').val();
    let apellidom = $('#apellidom').val();
    let cargo = $('#cargo').val();
    let municipios = $('#municipios').val();
    let colonia =  $('#colonia').val();
    let cdgpostal = $('#cdgpostal').val();
    let seccelectoral = $('#seccelectoral').val();
    let numtel = $('#numtel').val();
    let direccion = $('#direccion').val();

    if(nombre === '' || apellidop === '' || apellidom === '' || cargo === ''|| municipios === ''|| colonia === ''|| cdgpostal === ''|| numtel === ''|| seccelectoral === ''|| direccion === ''){
        Swal.fire(
            'Atención!',
            'Algunos campos son requeridos',
            'info'
        )
        return false;
    } 

    





}); 
