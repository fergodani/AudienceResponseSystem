# Audience Response System
Sistema de cuestionarios en línea que permitirá la creación y gestión, tanto de usuarios, preguntas y cuestionarios. Tendrá una fuerte inspiración en otros sitemas de este tipo (kahoot, por ejemplo) pero resolviendo algunos de los problemas que estos presentan:
- Rigidez de formato: Las preguntas y las respuestas tienen que tener un númro limitado de caracteres, que hace difícil enunciar correctamente la pregunta en muchos casos.
- Limitación en el número simultaneo de usuarios.
- Necesidad de autenticarse cada vez que se entra a un cuestionario, lo que ralentiza mucho la puesta en marcha en clase de un cuestionario de este estilo.
# Características
- Aplicación web para crear los tests y gestionar su realización. Las opciones que tendrá esta aplicación serán las siguientes:
    - Gestión de usuarios y cursos.
        - 3 tipos de usuarios: administrador, profesor, y estudiante.
            - Alta/baja/modificación de cursos.
            - Alta/baja/modificación de usuarios.
            - Asignación de roles a usuarios.
            - Opciones de importación de usuarios y cursos.
    - Opciones de creación de preguntas:
        - Crear preguntas de distintos tipos (multiopción, verdadero/falso, respuesta corta, encuestas...).
            - Las preguntas estarán asociadas a un curso, y tendrán también información sobre el tema al que pertenecen.
        - Importar/exportar preguntas.
        - Incorporar imágenes u otros recursos en el enunciado/respuestas.
    - Opciones de creación de cuestionarios:
        - Asignar preguntas a un cuestionario, eliminarlas,cambiarlas de orden.
    - Opciones de juego:
        - Lanzar juego en directo.
        - Lanzar un juego para responder offline (opcional)
        - Visualizar o no las preguntas en el dispositivo de usuario.
        - Determinar tipo de puntuación.
    - Otras posibilidades:
        - Redacción de exámenes de tipo test a partir de las preguntas. Podría crear modelos distintos (incluso por estudiante). Se descargarían los pdfs, se imprimen, se deja tiempo para hacerlos y al final del examen se usa el sistema para "mecanizar" las preguntas. Al final de la introducción del exámen se podría dar la nota a cada estudiante.

- Para responder se utiliza una aplicación web usable desde el móvil. También habrá disponible una aplicación móvil específica. Dicha aplicación móvil deberá tener las siguientes características:
    - Opciones de configuración:
        - Introducir nombre de usuario.
        - Introducir constraseña de acceso.
        - Modificación de contraseña.
        - ...
    - Opciones principales:
        - Cuando se entre a la aplicación, se mostrarán los test que tiene disponibles para contestar. Seleccionará uno de ellos y pasará a participar inmediatamente.
    - Opciones de consulta:
        - Test realizados.
        - Notas obtenidas.
        - ...
