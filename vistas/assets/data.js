/*
 * SIGA · Datos de ejemplo para los mockups.
 *
 * Todo lo que hay acá es ficticio. Los nombres de campos siguen el modelo
 * de datos (modelo_base_de_datos.txt) para que el pasaje a Django sea directo:
 *   usuarios            -> nombre, apellido, dni, fecha_nacimiento, email, telefono
 *   preinscripciones    -> id, fecha_preinscripcion, estado, observaciones, revisor, fecha_revision
 *   periodo_carrera_planes -> cupo_preinscriptos, cupo_lista_espera
 *   documentos_estudiantes -> tipo_documento, nombre_archivo, estado_verificacion
 */
window.SIGA = (function () {
  'use strict';

  // ---------- Referencias (se cargarían desde el admin de Django) ----------

  var PERIODO = {
    codigo: 'ING-2027',
    nombre: 'Ingreso 2027',
    ciclo_lectivo: 2027,
    fecha_inicio: '2026-09-01T08:00',
    fecha_fin: '2026-12-18T23:59',
    estado: 'abierto'
  };

  // Carreras de ejemplo: sólo la primera figura en el documento del proyecto.
  var CARRERAS = [
    { id: 1, codigo: 'TSADSI', nombre: 'Tecnicatura Superior en Análisis y Desarrollo de Sistemas Informáticos', corto: 'Análisis y Desarrollo de Sistemas', plan: 'Plan 2019', resolucion: 'Res. 3010/19', cupo: 16, espera: 8, peso: 0.36 },
    { id: 2, codigo: 'TSAP', nombre: 'Tecnicatura Superior en Administración Pública', corto: 'Administración Pública', plan: 'Plan 2021', resolucion: 'Res. 845/21', cupo: 25, espera: 8, peso: 0.2 },
    { id: 3, codigo: 'TSHST', nombre: 'Tecnicatura Superior en Higiene y Seguridad en el Trabajo', corto: 'Higiene y Seguridad', plan: 'Plan 2018', resolucion: 'Res. 2210/18', cupo: 20, espera: 6, peso: 0.16 },
    { id: 4, codigo: 'TSER', nombre: 'Tecnicatura Superior en Energías Renovables', corto: 'Energías Renovables', plan: 'Plan 2022', resolucion: 'Res. 1187/22', cupo: 20, espera: 6, peso: 0.16 },
    { id: 5, codigo: 'TSGT', nombre: 'Tecnicatura Superior en Guía de Turismo', corto: 'Guía de Turismo', plan: 'Plan 2020', resolucion: 'Res. 517/20', cupo: 15, espera: 5, peso: 0.12 }
  ];

  // Documentación requerida (tipo_documento del modelo).
  var DOCUMENTOS = [
    { tipo: 'DNI', label: 'Documento de identidad', hint: 'Frente y dorso en un solo archivo', formatos: 'PDF, JPG o PNG' },
    { tipo: 'Titulo Secundario', label: 'Título secundario', hint: 'O constancia de título en trámite', formatos: 'PDF, JPG o PNG' },
    { tipo: 'Analitico', label: 'Certificado analítico', hint: 'Analítico completo del nivel secundario', formatos: 'PDF, JPG o PNG' },
    { tipo: 'Foto Carnet', label: 'Foto tipo carnet', hint: 'Fondo claro y rostro visible', formatos: 'JPG o PNG' }
  ];

  // Estados de preinscripciones.estado
  var ESTADOS = {
    preinscripto: { label: 'Preinscripto', tone: 'slate', icon: 'inbox' },
    en_revision: { label: 'En revisión', tone: 'blue', icon: 'search-check' },
    lista_espera: { label: 'Lista de espera', tone: 'violet', icon: 'hourglass' },
    confirmado: { label: 'Confirmado', tone: 'green', icon: 'circle-check' },
    rechazado: { label: 'Rechazado', tone: 'red', icon: 'circle-x' },
    cancelado: { label: 'Cancelado', tone: 'gray', icon: 'ban' }
  };

  // Transiciones válidas del ciclo de vida de la solicitud.
  var TRANSICIONES = {
    preinscripto: ['en_revision', 'rechazado'],
    en_revision: ['confirmado', 'lista_espera', 'rechazado'],
    lista_espera: ['confirmado', 'rechazado'],
    confirmado: ['cancelado'],
    rechazado: ['en_revision'],
    cancelado: []
  };

  var REVISORES = [
    { nombre: 'Marta Quiroga', cargo: 'Secretaría académica' },
    { nombre: 'Diego Ñancucheo', cargo: 'Preceptoría' }
  ];

  // ---------- Generador determinístico ----------

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var r = rng(2027);
  function pick(a) { return a[Math.floor(r() * a.length)]; }
  function pad(n, l) { return String(n).padStart(l, '0'); }
  function sinTildes(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ñ/gi, 'n'); }

  var NOMBRES = ['Sofía', 'Mateo', 'Valentina', 'Joaquín', 'Camila', 'Nicolás', 'Lucía', 'Thiago', 'Martina', 'Benjamín', 'Agustina', 'Tomás', 'Florencia', 'Santiago', 'Milagros', 'Facundo', 'Julieta', 'Lautaro', 'Abril', 'Ignacio', 'Rocío', 'Franco', 'Micaela', 'Gonzalo', 'Ailén', 'Ramiro', 'Antonella', 'Ezequiel', 'Brenda', 'Maximiliano', 'Daiana', 'Leandro', 'Ayelén', 'Matías', 'Celeste', 'Bruno', 'Natalia', 'Emiliano', 'Carla', 'Walter'];
  var APELLIDOS = ['Martínez', 'López', 'Ríos', 'Fernández', 'Acosta', 'Benítez', 'González', 'Rodríguez', 'Sosa', 'Pérez', 'Gómez', 'Díaz', 'Álvarez', 'Romero', 'Torres', 'Herrera', 'Castro', 'Medina', 'Suárez', 'Molina', 'Catriel', 'Huenchul', 'Painemal', 'Morales', 'Ortiz', 'Silva', 'Navarro', 'Ruiz', 'Quiroga', 'Ledesma', 'Vera', 'Cayupán', 'Aguilar', 'Peralta', 'Godoy'];
  var DOMINIOS = ['gmail.com', 'gmail.com', 'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.ar'];

  var HOY = new Date('2026-10-01T10:42:00');
  var INICIO = new Date('2026-09-01T08:00:00');
  var TOTAL = 74;

  function carreraPonderada() {
    var x = r(), acc = 0;
    for (var i = 0; i < CARRERAS.length; i++) { acc += CARRERAS[i].peso; if (x <= acc) return CARRERAS[i]; }
    return CARRERAS[0];
  }

  function estadoPorAntiguedad(dias) {
    var x = r();
    if (dias < 4) return x < 0.7 ? 'preinscripto' : 'en_revision';
    if (dias < 10) return x < 0.35 ? 'preinscripto' : x < 0.75 ? 'en_revision' : x < 0.9 ? 'confirmado' : 'rechazado';
    return x < 0.08 ? 'preinscripto' : x < 0.3 ? 'en_revision' : x < 0.8 ? 'confirmado' : x < 0.9 ? 'rechazado' : 'cancelado';
  }

  function nombreArchivo(tipo, ap, no) {
    var base = sinTildes(ap + '_' + no).replace(/\s/g, '');
    var ext = tipo === 'Foto Carnet' ? (r() < 0.6 ? 'jpg' : 'png') : (r() < 0.75 ? 'pdf' : 'jpg');
    var pref = { 'DNI': 'DNI', 'Titulo Secundario': 'Titulo', 'Analitico': 'Analitico', 'Foto Carnet': 'Foto' }[tipo];
    return pref + '_' + base + '.' + ext;
  }

  function addMin(d, m) { return new Date(d.getTime() + m * 60000); }

  var usados = {};
  var lista = [];
  var fechas = [];
  for (var i = 0; i < TOTAL; i++) {
    // más preinscripciones al principio del período y en los últimos días
    var u = r();
    var f = Math.pow(u, 0.85);
    var t = INICIO.getTime() + f * (HOY.getTime() - INICIO.getTime() - 3600000);
    var d = new Date(t);
    d.setHours(8 + Math.floor(r() * 15), Math.floor(r() * 60));
    if (d > HOY) d = addMin(HOY, -40 - i * 13);
    fechas.push(d);
  }
  fechas.sort(function (a, b) { return a - b; });

  for (var k = 0; k < TOTAL; k++) {
    var no, ap, key;
    do { no = pick(NOMBRES); ap = pick(APELLIDOS); key = no + ap; } while (usados[key]);
    usados[key] = 1;

    var adulto = r() < 0.18;
    var dni = adulto ? 26000000 + Math.floor(r() * 10000000) : 44000000 + Math.floor(r() * 3800000);
    var anio = adulto ? 1977 + Math.floor((dni - 26000000) / 600000) : 2002 + Math.floor((dni - 44000000) / 1000000);
    var nac = anio + '-' + pad(1 + Math.floor(r() * 12), 2) + '-' + pad(1 + Math.floor(r() * 28), 2);
    var email = sinTildes((no + '.' + ap).toLowerCase()).replace(/\s/g, '') + (r() < 0.4 ? Math.floor(r() * 90 + 10) : '') + '@' + pick(DOMINIOS);
    var tel = '+54 9 2920 ' + pick(['4', '5', '6']) + pad(Math.floor(r() * 100000), 5).replace(/(\d)(\d{4})$/, '$1-$2');
    var fecha = fechas[k];
    var dias = (HOY - fecha) / 86400000;
    var car = carreraPonderada();
    var estado = estadoPorAntiguedad(dias);
    var revisor = estado === 'preinscripto' ? null : pick(REVISORES);

    var docs = DOCUMENTOS.map(function (doc) {
      var ev = 'pendiente', obs = '';
      if (estado === 'confirmado' || estado === 'lista_espera' || estado === 'cancelado') ev = 'aprobado';
      else if (estado === 'en_revision') { var x = r(); ev = x < 0.55 ? 'aprobado' : x < 0.85 ? 'pendiente' : 'rechazado'; }
      else if (estado === 'rechazado') ev = r() < 0.5 ? 'aprobado' : 'rechazado';
      if (ev === 'rechazado') obs = pick(['La imagen no es legible.', 'Falta el dorso del documento.', 'El analítico está incompleto.', 'La foto no cumple el formato solicitado.']);
      var kb = doc.tipo === 'Foto Carnet' ? 180 + Math.floor(r() * 900) : 600 + Math.floor(r() * 3800);
      return {
        tipo: doc.tipo, label: doc.label,
        nombre_archivo: nombreArchivo(doc.tipo, ap, no),
        tamanio: kb >= 1024 ? (kb / 1024).toFixed(1).replace('.', ',') + ' MB' : kb + ' KB',
        estado_verificacion: ev,
        observaciones: obs
      };
    });

    var fRev = revisor ? addMin(fecha, 60 * 18 + Math.floor(r() * 60 * 48)) : null;
    if (fRev && fRev > HOY) fRev = addMin(HOY, -25);

    var obsSol = {
      preinscripto: '',
      en_revision: docs.some(function (d) { return d.estado_verificacion === 'rechazado'; }) ? 'Se solicitó reenviar documentación observada.' : '',
      confirmado: 'Documentación completa y verificada.',
      lista_espera: 'Cupo de la carrera cubierto. Queda en lista de espera.',
      rechazado: 'No presentó la documentación corregida dentro del plazo.',
      cancelado: 'Cancelada a pedido del aspirante por correo.'
    }[estado];

    var historial = [{ fecha: fecha, accion: 'Solicitud recibida', detalle: 'Formulario público · IP 181.94.' + Math.floor(r() * 255) + '.' + Math.floor(r() * 255), actor: 'Aspirante' }];
    if (revisor) {
      historial.push({ fecha: addMin(fecha, 60 * 6), accion: 'Pasó a En revisión', detalle: '', actor: revisor.nombre });
      docs.forEach(function (d, j) {
        if (d.estado_verificacion !== 'pendiente') historial.push({ fecha: addMin(fecha, 60 * 6 + 5 + j * 3), accion: (d.estado_verificacion === 'aprobado' ? 'Documento aprobado: ' : 'Documento observado: ') + d.label, detalle: d.observaciones, actor: revisor.nombre });
      });
      if (estado !== 'en_revision') historial.push({ fecha: fRev, accion: 'Pasó a ' + ESTADOS[estado].label, detalle: obsSol, actor: revisor.nombre });
    }

    lista.push({
      id: 'PRE-2027-' + pad(k + 1, 5),
      nombre: no, apellido: ap, dni: dni, fecha_nacimiento: nac, email: email, telefono: tel,
      carrera_id: car.id,
      fecha_preinscripcion: fecha,
      estado: estado,
      observaciones: obsSol,
      revisor: revisor,
      fecha_revision: estado === 'preinscripto' || estado === 'en_revision' ? null : fRev,
      documentos: docs,
      historial: historial
    });
  }

  // El primer registro del mockup visual de referencia
  var sofia = lista[lista.length - 6];
  sofia.nombre = 'Sofía'; sofia.apellido = 'Martínez'; sofia.email = 'sofia.martinez@gmail.com';
  sofia.dni = 46318765; sofia.fecha_nacimiento = '2006-08-18'; sofia.carrera_id = 1;
  sofia.documentos.forEach(function (d) { d.nombre_archivo = d.nombre_archivo.replace(/_[^.]+\./, '_MartinezSofia.'); });

  // Ajuste: la carrera con más demanda supera el cupo -> algunos confirmados quedan en lista de espera
  CARRERAS.forEach(function (c) {
    var ocupados = lista.filter(function (a) { return a.carrera_id === c.id && ['preinscripto', 'en_revision', 'confirmado'].indexOf(a.estado) >= 0; });
    var exceso = ocupados.length - c.cupo;
    ocupados.slice().reverse().forEach(function (a) {
      if (exceso > 0 && a !== sofia && (a.estado === 'en_revision' || a.estado === 'preinscripto')) {
        if (!a.revisor) a.revisor = REVISORES[0];
        a.estado = 'lista_espera'; a.observaciones = 'Cupo de la carrera cubierto. Queda en lista de espera.';
        a.documentos.forEach(function (d) { d.estado_verificacion = 'aprobado'; d.observaciones = ''; });
        a.fecha_revision = addMin(a.fecha_preinscripcion, 60 * 30);
        if (a.fecha_revision > HOY) a.fecha_revision = addMin(HOY, -90);
        a.historial.push({ fecha: a.fecha_revision, accion: 'Pasó a Lista de espera', detalle: a.observaciones, actor: a.revisor ? a.revisor.nombre : REVISORES[0].nombre });
        exceso--;
      }
    });
  });

  lista.reverse(); // más recientes primero

  // ---------- Helpers compartidos ----------

  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fFecha(d) { d = new Date(d); return d.getDate() + ' ' + MESES[d.getMonth()] + ' ' + d.getFullYear(); }
  function fHora(d) { d = new Date(d); return pad(d.getHours(), 2) + ':' + pad(d.getMinutes(), 2); }
  function fFechaHora(d) { return fFecha(d) + ', ' + fHora(d); }
  function fNac(s) { var p = s.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
  function edad(s) { var n = new Date(s + 'T00:00'); var e = HOY.getFullYear() - n.getFullYear(); if (HOY < new Date(HOY.getFullYear(), n.getMonth(), n.getDate())) e--; return e; }
  function fDni(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function iniciales(a) { return (a.nombre[0] + a.apellido[0]).toUpperCase(); }
  function carrera(id) { return CARRERAS.filter(function (c) { return c.id === id; })[0]; }
  function docsResumen(a) {
    var ap = 0, rec = 0;
    a.documentos.forEach(function (d) { if (d.estado_verificacion === 'aprobado') ap++; if (d.estado_verificacion === 'rechazado') rec++; });
    return { aprobados: ap, rechazados: rec, total: a.documentos.length, tone: rec ? 'red' : ap === a.documentos.length ? 'green' : 'amber' };
  }
  function cupos() {
    return CARRERAS.map(function (c) {
      var mias = lista.filter(function (a) { return a.carrera_id === c.id; });
      return {
        carrera: c,
        ocupados: mias.filter(function (a) { return ['preinscripto', 'en_revision', 'confirmado'].indexOf(a.estado) >= 0; }).length,
        espera: mias.filter(function (a) { return a.estado === 'lista_espera'; }).length
      };
    });
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  return {
    PERIODO: PERIODO, CARRERAS: CARRERAS, DOCUMENTOS: DOCUMENTOS, ESTADOS: ESTADOS,
    TRANSICIONES: TRANSICIONES, REVISORES: REVISORES, USUARIO_ACTUAL: REVISORES[0], HOY: HOY,
    aspirantes: lista,
    fFecha: fFecha, fHora: fHora, fFechaHora: fFechaHora, fNac: fNac, edad: edad, fDni: fDni,
    iniciales: iniciales, carrera: carrera, docsResumen: docsResumen, cupos: cupos, esc: esc
  };
})();
