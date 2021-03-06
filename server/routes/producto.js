const express =  require('express');

const {verificaToken} = require ('../middlewares/autenticacion');

let app =express();
let Producto = require('../models/producto');

//============
//Obtener todos los productos
//============
app.get('/productos',verificaToken,(req,res) =>{
    //trear todos los productos
    //populate : usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

   Producto.find({ disponible: true})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) =>{
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productos
           }); 
    });

    
});


//============
//Obtener producto por id
//============
app.get('/productos/:id',verificaToken,(req,res) =>{
    //trear todos los productos
    let id = req.params.id;

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) =>{
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no se encontro'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
           });
    })
});

//============
//Buscar productos
//============
app.get('/productos/buscar/:termino', verificaToken, (req,res)=>{
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre:regex})
        .populate('categoria','nombre')
        .exec((err, productos) =>{
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
               });
        });
});


//============
//Crear producto
//============
app.post('/productos', verificaToken,(req,res) =>{
    //Grabar usuario
    //grabar categoria del listado
    let body = req.body;
    
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

        
    });

    producto.save((err, productoDB) => {
       if(err) {
           return res.status(500).json({
               ok: false,
               err
           });
       }
       
       res.status(201).json({
        ok: true,
        producto: productoDB 
       });

    });
});


//============
//Actualizar productos
//============
app.put('/productos/:id',verificaToken,(req,res) =>{
    //actualizar
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id,(err, productoDB) =>{
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'el producto no existe'
                }
            });
        }
        productoDB.nombre = body.nombre,
        productoDB.precioUni = body.precioUni
        productoDB.descripcion = body.descripcion
        productoDB.disponible = body.disponible
        productoDB.categoria = body.categoria

        productoDB.save((err, productoGuardado) =>{
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado 
               });
        });

    });
});


//============
//Eliminar un producto
//============
app.delete('/productos/:id', verificaToken,(req,res) =>{
    //Cambiar estado
    let id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoDB) =>{
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if(!productoDB) {
         return res.status(400).json({
             ok: false,
             err: {
                 message: 'El id no existe'
             }
         });
     }
     productoDB.disponible = false;
     productoDB.save((err, productoBorrado)=>{
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
           ok: true,
           producto: productoBorrado,
           message: 'Producto borrado'
           });
       });
     });

});

module.exports = app;