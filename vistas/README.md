# SIGA · Mockups del circuito de ingreso

Mockups navegables (HTML + CSS + JS, sin build) de los módulos **M1** y **M2** del primer entregable.
Abrí `index.html` en el navegador. Los datos son ficticios y las acciones funcionan sólo en memoria; al recargar se pierde todo.

| Archivo | Vista | Módulo |
|---|---|---|
| `formulario.html` | Formulario público de preinscripción, con validación, carga de archivos y pantalla de confirmación (`formulario.html#enviado`) | M1 |
| `aspirantes.html` | Bandeja de aspirantes: KPIs por estado, cupos por carrera, búsqueda, filtros, acciones rápidas y por lote, paginación | M2 |
| `aspirante.html` | Ficha del aspirante: datos declarados, verificación de cada documento, cambio de estado con observaciones, historial de auditoría. Se abre una solicitud puntual con `aspirante.html#PRE-2027-00012` | M2 |

```
vistas/
├── assets/
│   ├── siga.css        tokens, botones, formularios, pills, modal
│   ├── admin.css       layout del panel (sidebar + topbar)
│   ├── data.js         datos de ejemplo con los nombres de campo del modelo
│   ├── ui.js           toast, modal, pill de estado
│   └── lucide.min.js   íconos (Lucide 0.454, local para que funcione offline)
└── *.html
```

La estética sigue `mockups/mockup1.jpeg` (bandeja) y `mockups/mockup2.jpeg` (formulario). Los HTML están pensados para pasar a plantillas de Django: el sidebar y la topbar van a un `base_admin.html`, y cada tarjeta se convierte en un bloque del template.

## Decisiones tomadas

- **Campos del formulario.** Sólo los que existen en el modelo: `usuarios` (nombre, apellido, dni, fecha_nacimiento, email, telefono), la carrera vía `periodo_carrera_planes` y los cuatro tipos de `documentos_estudiantes` (DNI, Título secundario, Analítico, Foto carnet). El plan de estudios no se elige: se asigna el vigente para inscripción.
- **Estados.** Los del enum `preinscripciones.estado`. Transiciones que usan los mockups:
  - preinscripto → en revisión, rechazado
  - en revisión → confirmado, lista de espera, rechazado
  - lista de espera → confirmado, rechazado
  - confirmado → cancelado
  - rechazado → en revisión (reabrir)
- **Confirmar** exige los 4 documentos aprobados. **Rechazar, cancelar y lista de espera** exigen observación. Cada cambio queda en el historial con usuario y fecha (`id_usuario_revisor`, `fecha_revision`).
- **Documento observado.** Usa `estado_verificacion = rechazado` + `observaciones`; en pantalla se muestra como "Observado" porque el aspirante puede reenviarlo.
- **Cupos.** Ocupan lugar los estados preinscripto, en revisión y confirmado. Si la carrera está llena, el formulario avisa que la solicitud entra a lista de espera.
- **Anti-spam.** Honeypot oculto + un recuadro de desafío genérico. El captcha concreto queda a definir.

## Cosas del modelo para revisar

Lo que apareció al armar las vistas:

1. **`documentos_estudiantes.id_estudiante` es NOT NULL**, pero el aspirante todavía no es estudiante (el PDF dice que en esta etapa no se crea legajo). Los documentos de la preinscripción no tendrían a quién colgarse. Opciones: hacer nullable `id_estudiante` y usar `id_preinscripcion`, o una tabla `documentos_preinscripcion`.
2. **`usuarios.password` NOT NULL e `id_rol` NOT NULL**, pero el aspirante no tiene cuenta. O se crea un usuario "sin acceso" con rol aspirante, o los datos personales del aspirante van en la propia preinscripción (o en una tabla `personas`).
3. **Estados distintos entre el PDF y el modelo.** El PDF (sección 3.2) habla de *recibida, en revisión, observada, aprobada, rechazada*; el enum tiene *preinscripto, lista_espera, en_revision, confirmado, rechazado, cancelado*. Falta "observada" como estado de la solicitud (hoy sólo se puede marcar a nivel documento). Los mockups usan el enum del modelo.
4. **Historial/auditoría de la preinscripción.** El M3 pide registro de auditoría de las decisiones, pero sólo `actas` tiene tabla de historial. La ficha muestra un historial que necesitaría algo como `preinscripcion_historial` (estado anterior, estado nuevo, usuario, fecha, observación).
5. **Antecedentes académicos** (escuela, año de egreso, promedio) aparecen en el mockup de referencia pero no en el modelo. No los incluí en el formulario.
6. **`tipo_documento` de identidad**: el modelo asume DNI (`dni int`). Si se aceptan pasaportes o documentos extranjeros, conviene `tipo_doc` + `nro_doc varchar`.
7. **Lista de documentos requeridos** por carrera/período: el PDF dice que se carga desde el admin, pero no hay tabla que la represente (hoy el enum es fijo).

## Datos de ejemplo

Las carreras, salvo la Tecnicatura en Análisis y Desarrollo de Sistemas Informáticos, son inventadas, igual que los números de resolución, los cupos, las personas y los teléfonos. Se generan con una semilla fija en `assets/data.js`, así que siempre salen iguales.
