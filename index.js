process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

const spawn = require('child_process').spawn;

exports.handler = function(event, context) {
	console.log("iniciando nueva version del lambda");
    var php = spawn('./php',['wrapper.php']); //< llama al php principal
    var output = "";

    php.stdin.write(JSON.stringify(event)); //< envía el evento de entrada json como cadena vía STDIN al proceso php
    php.stdin.end(); //< cierra el flujo de php para desbloquear el proceso php

    //dinámicamente recopila la salida php
    php.stdout.on('data', function(data) {
        output += data;
    });

    //reacciona ante posibles errores
    php.stderr.on('data', function(data) {
        console.log("STDERR: " + data);
    });

    //finaliza cuando se realiza el proceso php
    php.on('close', function(code) {
        console.log("mostrando contenido");
    	console.log(code);
        context.succeed(JSON.parse(output));
    });
}