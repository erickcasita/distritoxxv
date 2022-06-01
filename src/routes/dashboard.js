const express = require('express');
const router = express.Router();
const pool = require("../database");
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const path = require('path');
const xl = require('excel4node');

router.get('/', isLoggedIn, (req, res) => {
    res.render('dashboard/index');
});

router.get('/addpeople', isLoggedIn, async (req, res) => {

    const cargos = await pool.query('select * from cargos');
    const municipios = await pool.query('select * from municipios');
    res.render('dashboard/addpeople', { cargos, municipios });
});
router.post('/validatemunicipios', isLoggedIn, async (req, res) => {
    const { clvmunicipio } = req.body;
    const colonias = await pool.query('SELECT * FROM colonias WHERE clvmunicipio = ? ORDER BY clvcolonias DESC ', [clvmunicipio]);
    let tmp = [];

    colonias.forEach(element => {
        var fila = new Array();

        fila.push(element['clvcolonias']);
        fila.push(element['nombrecolonias']);
        fila.push(element['cdgpostal']);
        fila.push(element['clvmunicipio']);
        fila.push(element['clvestado']);

        tmp.push(fila);

    });

    res.send(tmp)

});

router.post('/validatecargos', isLoggedIn, async (req, res) => {
    const { clvmunicipio } = req.body;
    console.log(clvmunicipio);
    const cargos = await pool.query('SELECT afiliaciones.clvpersona, afiliaciones.nombre, afiliaciones.apellidop, afiliaciones.apellidom, cargos.nombrecargo, municipios.nombremunicipio, afiliaciones.seccelectoral, colonias.nombrecolonias FROM afiliaciones INNER JOIN cargos ON afiliaciones.clvcargos = cargos.clvcargos INNER JOIN municipios ON afiliaciones.clvmunicipio = municipios.clvmunicipio INNER JOIN colonias ON afiliaciones.clvcolonias = colonias.clvcolonias WHERE (afiliaciones.clvcargos != 1)  AND afiliaciones.clvmunicipio = ? ORDER BY afiliaciones.clvpersona', [clvmunicipio]);
    let tmpcargos = [];
    cargos.forEach(element => {
        var fila = new Array();

        fila.push(element['clvpersona']);
        fila.push(element['nombre']);
        fila.push(element['apellidop']);
        fila.push(element['apellidom']);
        fila.push(element['nombrecargo']);
        fila.push(element['nombremunicipio']);
        fila.push(element['seccelectoral']);
        fila.push(element['nombrecolonias']);
        tmpcargos.push(fila);

    });
    res.send(tmpcargos);
});

router.post('/newaddpeople', isLoggedIn, async (req, res) => {

    let { nombre, apellidop, apellidom, cargo, municipio, colonia, codigopostal, seccelectoral, numtel, direccion, grupo } = req.body;
    //Convirtiendo a mayúsculas 
    nombre = nombre.toUpperCase();
    apellidop = apellidop.toUpperCase();
    apellidom = apellidom.toUpperCase();
    direccion = direccion.toUpperCase();
    let path;
    let pathfoto;
    if (grupo === '') {
        grupo = null;
    }
    if (req.files['credencial'] === undefined) {
        path = " ";
    } else {
        path = '/uploads/' + req.files['credencial'][0].originalname;
    }
    if (req.files['foto'] === undefined) {
        pathfoto = "/uploads/user.png";
    } else {
        pathfoto = '/uploads/' + req.files['foto'][0].originalname;
    }

    const newpeole = {
        nombre,
        apellidop,
        apellidom,
        clvcargos: cargo,
        clvmunicipio: municipio,
        clvcolonias: colonia,
        cdgpostal: codigopostal,
        seccelectoral,
        numtel,
        direccion,
        cdgagrupador: grupo,
        pathcredencial: path,
        pathfoto

    }
    await pool.query('INSERT INTO afiliaciones set ?', [newpeole]);
    req.flash('success', '¡El registro se ha generado correctamente!');
    res.redirect('/dashboard/addpeople');


});


router.post('/neweditpeople', isLoggedIn, async (req, res) => {
    let { clvpersona, nombre, apellidop, apellidom, cargo, municipio, colonia, codigopostal, seccelectoral, numtel, direccion, grupo } = req.body;
    //Convirtiendo a mayúsculas 
    nombre = nombre.toUpperCase();
    apellidop = apellidop.toUpperCase();
    apellidom = apellidom.toUpperCase();
    direccion = direccion.toUpperCase();


    let clvcargos = cargo;
    let clvmunicipio = municipio;
    let clvcolonias = colonia;
    let cdgpostal = codigopostal;

    let cdgagrupador = grupo;

    let path;
    let pathfoto;
    if (grupo === '') {
        grupo = null;
    }


    const media = await pool.query('SELECT  pathcredencial, pathfoto FROM afiliaciones WHERE clvpersona = ?', [clvpersona]);
    let tmpcredencial, tmpfoto
    media.forEach(element => {

        tmpcredencial = element['pathcredencial'];
        tmpfoto = element['pathfoto'];

    });

    if (req.files['credencial'] === undefined) {
        path = tmpcredencial;
    } else {
        path = '/uploads/' + req.files['credencial'][0].originalname;
    }
    if (req.files['foto'] === undefined) {
        pathfoto = tmpfoto;
    } else {
        pathfoto = '/uploads/' + req.files['foto'][0].originalname;
    }


    await pool.query('UPDATE afiliaciones SET nombre = ?, apellidop = ?, apellidom = ?, clvcargos = ?, clvmunicipio = ?, clvcolonias = ?, cdgpostal = ?, seccelectoral = ?, numtel = ?, direccion = ?, cdgagrupador = ?, pathcredencial = ?, pathfoto = ? WHERE clvpersona = ?', [nombre, apellidop, apellidom, clvcargos, clvmunicipio, clvcolonias, cdgpostal, seccelectoral, numtel, direccion, cdgagrupador, path, pathfoto, clvpersona,]);

    req.flash('success', '¡El Usuario se ha editado correctamente!');
    res.redirect('/dashboard/showprofile/' + clvpersona);


});
router.get('/searchpeople', isLoggedIn, async (req, res) => {
    const search = await pool.query('select afiliaciones.clvpersona,afiliaciones.nombre,afiliaciones.apellidop,afiliaciones.apellidom,municipios.nombremunicipio,cargos.nombrecargo, seccelectoral from afiliaciones INNER JOIN municipios on afiliaciones.clvmunicipio = municipios.clvmunicipio INNER JOIN cargos on afiliaciones.clvcargos = cargos.clvcargos');
    res.render('dashboard/searchpeople', { search });
});
router.get('/reportmanage', isLoggedIn, async (req, res) => {

    const cargos = await pool.query('select * from cargos WHERE clvcargos != 1 ');
    const municipios = await pool.query('select * from municipios');
    res.render('dashboard/reportmanage', { cargos, municipios });
});

router.post('/newreportmanage', isLoggedIn, async (req, res) => {
    let { cargo, municipio, colonia } = req.body;
    if (colonia === undefined) {
        colonia = "0";
    }
    console.log(cargo, municipio, colonia);
    let q;
    let datos = []
    let contador1, contador2
    contador2 = 4;
    contador1 = 1;

    let user = req.user.username;
    var f = new Date();
    var mes = f.getMonth() + 1;
    var fecha = f.getDate() + "-" + mes + "-" + f.getFullYear();
    var hora_actual = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();


    if (colonia === "0" && municipio != "0" && cargo != "0") {

        q = await pool.query('SELECT afiliaciones.clvpersona, afiliaciones.nombre, afiliaciones.apellidop, afiliaciones.apellidom, municipios.nombremunicipio, colonias.nombrecolonias, afiliaciones.cdgpostal, afiliaciones.seccelectoral, afiliaciones.numtel, afiliaciones.direccion, cargos.nombrecargo FROM afiliaciones INNER JOIN municipios ON afiliaciones.clvmunicipio = municipios.clvmunicipio INNER JOIN colonias ON afiliaciones.clvcolonias = colonias.clvcolonias INNER JOIN cargos ON afiliaciones.clvcargos = cargos.clvcargos WHERE afiliaciones.clvcargos = ? AND afiliaciones.clvmunicipio = ?', [cargo, municipio]);



    }
    if (colonia != "0" && municipio != "0" && cargo != "0") {
        q = await pool.query('SELECT afiliaciones.clvpersona, afiliaciones.nombre, afiliaciones.apellidop, afiliaciones.apellidom, municipios.nombremunicipio, colonias.nombrecolonias, afiliaciones.cdgpostal, afiliaciones.seccelectoral, afiliaciones.numtel, afiliaciones.direccion, cargos.nombrecargo FROM afiliaciones INNER JOIN municipios ON afiliaciones.clvmunicipio = municipios.clvmunicipio INNER JOIN colonias ON afiliaciones.clvcolonias = colonias.clvcolonias INNER JOIN cargos ON afiliaciones.clvcargos = cargos.clvcargos WHERE afiliaciones.clvcargos = ? AND afiliaciones.clvmunicipio = ? AND afiliaciones.clvcolonias = ?', [cargo, municipio, colonia]);
    }

    if (municipio === "0" && colonia === "0" && cargo != "0") {
        q = await pool.query('SELECT afiliaciones.clvpersona, afiliaciones.nombre, afiliaciones.apellidop, afiliaciones.apellidom, municipios.nombremunicipio, colonias.nombrecolonias, afiliaciones.cdgpostal, afiliaciones.seccelectoral, afiliaciones.numtel, afiliaciones.direccion, cargos.nombrecargo FROM afiliaciones INNER JOIN municipios ON afiliaciones.clvmunicipio = municipios.clvmunicipio INNER JOIN colonias ON afiliaciones.clvcolonias = colonias.clvcolonias INNER JOIN cargos ON afiliaciones.clvcargos = cargos.clvcargos WHERE afiliaciones.clvcargos = ? ', [cargo]);
    }

    if (municipio === "0" && colonia === "0" && cargo === "0") {
        q = await pool.query('SELECT afiliaciones.clvpersona, afiliaciones.nombre, afiliaciones.apellidop, afiliaciones.apellidom, municipios.nombremunicipio, colonias.nombrecolonias, afiliaciones.cdgpostal, afiliaciones.seccelectoral, afiliaciones.numtel, afiliaciones.direccion, cargos.nombrecargo FROM afiliaciones INNER JOIN municipios ON afiliaciones.clvmunicipio = municipios.clvmunicipio INNER JOIN colonias ON afiliaciones.clvcolonias = colonias.clvcolonias INNER JOIN cargos ON afiliaciones.clvcargos = cargos.clvcargos ;');
    }
    //const q = await pool.query('SELECT afiliaciones.clvpersona, afiliaciones.nombre, afiliaciones.apellidop, afiliaciones.apellidom, municipios.nombremunicipio, colonias.nombrecolonias, afiliaciones.cdgpostal, afiliaciones.seccelectoral, afiliaciones.direccion, cargos.nombrecargo FROM afiliaciones INNER JOIN municipios ON afiliaciones.clvmunicipio = municipios.clvmunicipio INNER JOIN colonias ON afiliaciones.clvcolonias = colonias.clvcolonias INNER JOIN cargos ON afiliaciones.clvcargos = cargos.clvcargos WHERE afiliaciones.clvcargos = ? AND afiliaciones.clvmunicipio = ? AND afiliaciones.clvcolonias = ?',[cargo,municipio, colonia]);



    //Libro de Trabajo
    var wb = new xl.Workbook();
    //Hoja de Trabajo
    var ws = wb.addWorksheet('Reporte');
    ws.cell(1, 1).string("RAFAEL GUSTAVO FARARONI MAGAÑA DIP. DISTRITO XXV");
    ws.cell(1, 10).string("Usuario:");
    ws.cell(1, 11).string(user);

    ws.cell(2, 1).string("REPORTE DE COORDINADORES / RUTERO / AGENTES(SUBS) MUNICIPALES");
    ws.cell(2, 10).string("Fecha y Hora:");
    ws.cell(2, 11).string(fecha + " " + hora_actual);
    ws.cell(3, 1).string("ID");
    ws.cell(3, 2).string("NOMBRE");
    ws.cell(3, 3).string("APELLIDO PATERNO");
    ws.cell(3, 4).string("APELLIDO MATERNO");
    ws.cell(3, 5).string("MUNICIPIO");
    ws.cell(3, 6).string("COLONIA");
    ws.cell(3, 7).string("CODIGO POSTAL");
    ws.cell(3, 8).string("SECCION ELECTORAL");
    ws.cell(3, 9).string("TELEFONO");
    ws.cell(3, 10).string("DIRECCION");
    ws.cell(3, 11).string("TIPO CARGO");
    const pathExcel = path.join('src/public/reportes/', 'excel', 'reporte.xlsx');
    var fila = new Array();
    q.forEach(element => {

        fila.push(element['clvpersona']);
        fila.push(element['nombre']);
        fila.push(element['apellidop']);
        fila.push(element['apellidom']);
        fila.push(element['nombremunicipio']);
        fila.push(element['nombrecolonias']);
        fila.push(element['cdgpostal']);
        fila.push(element['seccelectoral']);
        fila.push(element['numtel']);
        fila.push(element['direccion']);


        fila.push(element['nombrecargo']);


    });




    for (let index = 0; index < fila.length; index++) {
        const element = fila[index];

        var cad = element.toString();



        ws.cell(contador2, contador1).string(cad);
        contador1++;
        if (contador1 == 12) {
            contador2++;
            contador1 = 1;
        }


    }


    wb.write(pathExcel);
    req.flash('showreportmanage', '¡El reporte se ha generado correctamente!');
    res.redirect('/dashboard/reportmanage/');

    // wb.write(pathExcel, function(err,stats){
    //     if(err){
    //         console.error(err);
    //     }else{
    //         function downloadFIle(){
    //             res.download(pathExcel);
    //         }
    //         downloadFIle();
    //         return false;

    //     }
    // });

});

router.get('/downloadreportmanage', function (req, res) {

    const file = 'src/public/reportes/excel/reporte.xlsx';
    var filename = path.basename(file);
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.download(file, 'reporte.xlsx', function (err) {
        console.log('download callback called');
        if (err) {
            console.log('something went wrong');
        }

    });




});
router.get('/showprofile/:clvpersona', isLoggedIn, async (req, res) => {
    let clvpersona = req.params.clvpersona;
    let idcargo = "";
    let idmunicipio = "";
    let idcolonia = "";
    const card1 = await pool.query('SELECT clvpersona, nombre, apellidop,apellidom,seccelectoral,direccion,numtel,pathfoto,pathcredencial,cdgpostal FROM afiliaciones WHERE clvpersona = ?', [clvpersona]);
    const card2 = await pool.query('SELECT  municipios.clvmunicipio,municipios.nombremunicipio,colonias.clvcolonias,colonias.nombrecolonias FROM afiliaciones INNER JOIN municipios ON afiliaciones.clvmunicipio = municipios.clvmunicipio INNER JOIN colonias on afiliaciones.clvcolonias = colonias.clvcolonias WHERE clvpersona = ?', [clvpersona]);
    const cargo = await pool.query('SELECT cargos.clvcargos,cargos.nombrecargo from afiliaciones INNER JOIN cargos ON afiliaciones.clvcargos = cargos.clvcargos WHERE clvpersona = ?', [clvpersona]);
    const totalpersonas = await pool.query('SELECT COUNT(*) AS total_personas FROM afiliaciones WHERE cdgagrupador = ?', [clvpersona]);

    //Obteniendo los cargos excepto el que ya tiene la persona
    card2.forEach(element => {

        idmunicipio = element['clvmunicipio'];
        idcolonia = element['clvcolonias'];
    });

    //Obteniendo los municipios excepto el que ya tiene la persona

    cargo.forEach(element => {

        idcargo = element['clvcargos'];

    });

    const listacargos = await pool.query('SELECT * FROM cargos WHERE clvcargos != ?', [idcargo]);
    const listamunicipios = await pool.query('SELECT * FROM municipios WHERE clvmunicipio != ?', [idmunicipio]);
    const listacolonia = await pool.query('SELECT * FROM colonias WHERE clvcolonias != ? AND clvmunicipio = ?', [idcolonia, idmunicipio]);
    const formdatos1 = await pool.query('SELECT clvpersona,nombre,apellidop,apellidom,numtel,direccion FROM afiliaciones WHERE clvpersona = ?', [clvpersona]);

    //Obteniendo el id del codigo agrupador

    const clvagrupador = await pool.query('SELECT cdgagrupador FROM afiliaciones WHERE clvpersona = ?', [clvpersona]);
    let cdgagrupador;
    clvagrupador.forEach(element => {

        cdgagrupador = element['cdgagrupador'];

    });
    const cordis = await pool.query('SELECT afiliaciones.clvpersona, afiliaciones.nombre, afiliaciones.apellidop, afiliaciones.apellidom, cargos.nombrecargo, municipios.nombremunicipio, afiliaciones.seccelectoral, colonias.nombrecolonias FROM afiliaciones INNER JOIN cargos ON afiliaciones.clvcargos = cargos.clvcargos INNER JOIN municipios ON afiliaciones.clvmunicipio = municipios.clvmunicipio INNER JOIN colonias ON afiliaciones.clvcolonias = colonias.clvcolonias WHERE  afiliaciones.clvpersona = ?', [cdgagrupador]);
    res.render('dashboard/showprofile', { card1, cargo, card2, totalpersonas, formdatos1, listacargos, listamunicipios, listacolonia, cordis });
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/');

})
module.exports = router;