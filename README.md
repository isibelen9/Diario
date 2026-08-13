# Mi Diario Personal

Página web estática para llevar un diario personal.

## Incluye
- crear, editar y eliminar entradas;
- fecha y estado de ánimo;
- título, texto libre y etiquetas;
- contador de palabras y caracteres;
- búsqueda;
- filtros por estado de ánimo;
- orden por fecha o edición;
- modo claro y oscuro;
- exportación e importación JSON;
- guardado mediante localStorage.

## Privacidad
Las entradas se guardan en el navegador. No se envían a un servidor.

Si se borran los datos del navegador o se usa otro dispositivo, las entradas no aparecerán allí. Conviene usar **Exportar diario** como respaldo.

## GitHub Pages
Sube `index.html`, `style.css`, `app.js` y `README.md`.
Luego activa `Settings → Pages → Deploy from a branch → main → /(root)`.

## Contraseñas
Una contraseña implementada solo con JavaScript en una web estática no ofrece protección real. Por eso esta versión no simula seguridad con una clave falsa.
