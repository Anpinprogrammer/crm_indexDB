(function() {

    let DB;
    let idCliente;
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');


    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();


        formulario.addEventListener('submit', actualizarCliente);

        //Verificar el ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search);//Lo usamos para buscar informacion dentro de la URL, busca la informacion despues del query string "?", el query string se usa para pasarle parametros a una URL

        idCliente = parametrosURL.get('id');//Aqui le decimos exactamente que obtener despues del query string

        if(idCliente){
            setTimeout(() => {

                obtenerCliente(idCliente);
            }, 100);
            
        }
    });

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = (e) => {
            const cursor = e.target.result;

            if(cursor) {
                console.log(cursor.value);
                if(cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);

                }
                cursor.continue();
            }
        }

    }

    function llenarFormulario(datosCliente) {

        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;

        
    }

    function actualizarCliente(e) {

        e.preventDefault();

        if( nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
             imprimirAlerta('Uno o mas campos estan vacios', 'error');
             return;
        }

        //Actualizamos el cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = () => {
            imprimirAlerta('Editado correctamente');

            setTimeout(() => {

                window.location.href = 'index.html';
            }, 3000);
        }

        transaction.onerror = () => {
            console.log('Hubo un error');
        }
    }

    function imprimirAlerta(mensaje, tipo) {
        console.log('intenta mostrar el alerta');

        const alerta = document.querySelector('.alerta');

        if(!alerta) {

              //Crear alerta
        const divAlerta = document.createElement('DIV');
        divAlerta.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'alerta');

        if(tipo === 'error') {
            divAlerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else {
            divAlerta.classList.add('bg-green.100', 'border-green-400', 'text-green-700');
        }

        divAlerta.textContent = mensaje;

        formulario.appendChild(divAlerta);

        setTimeout(() => {
            divAlerta.remove();
        }, 5000);

        }
    }

    function conectarDB() {

        //Acceder a la base de datos 
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = () => {
            console.log('Hubo un error accediendo a la base de datos');
        }
        
        abrirConexion.onsuccess = () => {
            DB = abrirConexion.result;
        }
    }
})();