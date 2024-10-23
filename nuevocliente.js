(function() {

    let DB;
    const formulario = document.querySelector('#formulario'); 

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    })

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = () => {
            console.log('No se pudo crear la DB');
        }

        abrirConexion.onsuccess = () => {
            DB = abrirConexion.result;
        }

        abrirConexion.onupgradeneeded = (e) => {

            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', {
                keyPath: 'id',
                autoIncrement: true
            })

            //Definir columnas
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

           console.log('DB creada y lista');

        }
    }

    function validarCliente(e) {
        e.preventDefault();

        console.log('Llega aqui');

        //Leer inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if( nombre === '' || email === '' || telefono === '' || empresa === '' ) {
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        const cliente = {nombre: nombre, email: email, telefono: telefono, empresa: empresa, id: Date.now()}

        crearNuevoCliente(cliente);
            
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = () => {
            imprimirAlerta('Ya existe un cliente con ese email', 'error');
        }

        transaction.oncomplete = () => {
              imprimirAlerta('El cliente fue agregado satisfactoriamente');
              formulario.reset();

              setTimeout(() => {
                window.location.href = 'index.html';
              }, 5000);
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
})();