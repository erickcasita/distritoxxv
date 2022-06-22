let table = $('#example1').DataTable({


    "language": {
        "lengthMenu": "Display _MENU_ records per page",
        "zeroRecords": "Sin registros...",
        "info": "Mostrando página... _PAGE_ de _PAGES_",
        "infoEmpty": "Sin entradas disponibles",
        "infoFiltered": "(filtrando from _MAX_ total records)"
    },
    "responsive": true,
    "paging": true,
    "lengthChange": false,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": false,
    columnDefs: [{
        targets: 5,
        render: function (data, type, row, meta) {
            return moment(new Date(data)).format('YYYY-MM-DD')
        }
    }]
});


$(document).ready(function () {


    $(".btncancelarrequest").click(function () {

        fila = $(this);
        let id = $(this).closest('tr').find('td:first').text();
        const values = {
            clvsolicitud: id
        }

        Swal.fire({
            title: '¿Está segur@ de eliminar esta solicitud?',
            text: "Esta acción no se puede revertir!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'SI'
        }).then((result) => {
            if (result.isConfirmed) {


                $.ajax({

                    method: 'POST',
                    url: '/dashboard/cancelrequest',
                    data: values,
                    success: function (result) {
                        if (!result) {
                            console.log('No hay respuesta en el server');
                        } else {
                            

                            table.row(fila.parents('tr')).remove().draw();
                        }

                    }

                });


            }
        })



    });


}); 





