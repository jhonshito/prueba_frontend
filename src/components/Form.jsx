import React, { useState, useRef } from 'react'

const Form = () => {

    // donde se van almacenar los datos temporarmente
    const [datos, setDatos] = useState({
        nombre: '',
        nacimiento: '',
        correo: ''
    });

    // capturar algunos elementos del dom
    const contenError = useRef(null);
    const errorFecha = useRef(null);
    const errorCorreo = useRef(null);
    const formulario = useRef(null);
    const dataExitosamente = useRef(null);

    // algunos estados del formulario
    const [textValidacion, setTextValidacion] = useState();
    const [textCorreo, setTextCorreo] = useState();
    const [textFecha, setTextFecha] = useState();
    const [textSuccess, setTextSuccess] = useState();
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // funcion para resetiar el estado del form
    const resetForm = () => {
        setDatos({
          nombre: '',
          nacimiento: '',
          correo: ''
        });
    }

    // obtener los datos y hacer las validuaciones
    const handleChangeValue = (event) => {
        const { name, value } = event.target;

        if (name === 'nombre' && !/^[a-zA-Z\s]*$/.test(value)) {
            setTextValidacion('El nombre solo puede contener letras');
            contenError.current.style.display = 'block'
            return;
        }else {
            setTextValidacion('')
            contenError.current.style.display = 'none'
        }

        if(name === 'nacimiento' && value === ''){
            errorFecha.current.style.display = 'block'
            setTextFecha('Debe ingresar tu fecha de nacimiento');
            return
        }else {
            setTextFecha('');
            errorFecha.current.style.display = 'none'
        }

        if (name === 'correo' && (value === '' || !emailRegex.test(value))) {
            errorCorreo.current.style.display = 'block';
            setTextCorreo('Debe ingresar una dirección de correo electrónico válida');
            return;
          } else {
            errorCorreo.current.style.display = 'none';
            setTextCorreo('');
          }

        setDatos(datos => ({ ...datos, [name]: value }));
    }

    // realizar la peticion
    const peticion = function({ nombre, nacimiento, correo }){

        fetch('http://localhost:4000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre: nombre, nacimiento: nacimiento, correo: correo })
        })
        .then(response => response.json())
        .then(data => {
            const { status, mensaje } = data
            if(status == 200){
                setTimeout(() => {
                    setTextSuccess(mensaje)
                }, 4000)
                dataExitosamente.current.style.display = 'block'
                console.log(data)
                return
            }else {
                setTextSuccess('')
                dataExitosamente.current.style.display = 'none'
            }
        })
        .catch(error => console.error(error));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { nombre, nacimiento, correo } = datos

        switch(true){
            case nombre === '':
                setTextValidacion('Debes de ingresar un nombre');
                contenError.current.style.display = 'block'
                break;
            case nacimiento === '':
                setTextFecha('Debes de ingresar tu fecha de nacimiento');
                errorFecha.current.style.display = 'block'
                break;
            case correo === '':
                setTextCorreo('Debes de ingresar tu correo electronico');
                errorCorreo.current.style.display = 'block'
                break
            default:
                peticion({ nombre, nacimiento, correo })
                // resetForm();
                setTimeout(() => {
                    formulario.current.reset();
                    setTextSuccess('')
                    dataExitosamente.current.style.display = 'none'
                }, 7000)
                // console.log(datos)
                break;
        }

    }

  return (
    <main>
      <div className='contenedor'>
        <h2>Formulario</h2>
        <form ref={formulario} onSubmit={handleSubmit}>
            <div className="contenedor_input">
                <label>Nombre</label>
                <input type="text" onChange={handleChangeValue} name='nombre' placeholder='Ingresa tu nombre' />
                <div ref={contenError} className="text_error">
                    <span>{textValidacion}</span>
                </div>
            </div>
            <div className="contenedor_input">
                <label>Fecha de nacimiento</label>
                <input type="date" onChange={handleChangeValue} name='nacimiento' />
                <div ref={errorFecha} className="text_error">
                    <span>{textFecha}</span>
                </div>
            </div>
            <div className="contenedor_input">
                <label>Correo</label>
                <input type="email" onChange={handleChangeValue} name='correo' placeholder='Ingresa tu correo' pattern="^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$" title="Ingresa un email válido" />
                <div ref={errorCorreo} className="text_error">
                    <span>{textCorreo}</span>
                </div>
            </div>
            <button type='submit'>Enviar</button>
            
            <div ref={dataExitosamente} className="exito_data">
                {
                    !textSuccess ?
                    <div className="loader"></div>:
                    <span>{textSuccess}</span>
                }
            </div>
        </form>
      </div>
    </main>
  )
}

export default Form
