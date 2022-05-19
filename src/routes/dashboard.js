const express = require('express');
const router = express.Router();
const pool = require("../database");
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
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
    const cargos = await pool.query('SELECT afiliaciones.clvpersona, afiliaciones.nombre, afiliaciones.apellidop, afiliaciones.apellidom, cargos.nombrecargo, municipios.nombremunicipio, afiliaciones.seccelectoral, colonias.nombrecolonias FROM afiliaciones INNER JOIN cargos ON afiliaciones.clvcargos = cargos.clvcargos INNER JOIN municipios ON afiliaciones.clvmunicipio = municipios.clvmunicipio INNER JOIN colonias ON afiliaciones.clvcolonias = colonias.clvcolonias WHERE (afiliaciones.clvcargos = 2 OR afiliaciones.clvcargos = 3 )  AND afiliaciones.clvmunicipio = ? ORDER BY afiliaciones.clvpersona', [clvmunicipio]);
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
router.get('/showprofile/:clvpersona', isLoggedIn, async (req, res) => {
    let clvpersona = req.params.clvpersona;
    let idcargo = "";
    let idmunicipio = "";
    let idcolonia = "";
    const card1 = await pool.query('SELECT clvpersona, nombre, apellidop,apellidom,seccelectoral,direccion,numtel,pathfoto,cdgpostal FROM afiliaciones WHERE clvpersona = ?', [clvpersona]);
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