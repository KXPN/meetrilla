class Meetrilla {

  selectoresPorNombre = {
    notificacion: '[data-key^="notification-"]',
    listaParticipante: (
      '[data-panel-container-id=sidePanel1] [data-participant-id]'
    ),
    participante: '[data-participant-id][data-tile-media-id]',
    participantesListaIcono: '[data-avatar-count]',
    participantesSinCamaraGrupoPrimerIntegrante: (
      '[jsname][draggable=false]:not([data-emoji],[title])'
    ),
  };

  participantes = [];
  participantesPorNombre = {};
  participantesConCamaraPorNombre = {};
  participantesSinCamaraGrupoTexto = '';
  participantesSinCamaraGrupoAnchura = '';

  constructor() {
    this.inicializar();
  }

  inicializar = () => {
    const dParticipantesListaIcono = (
      document.querySelector(this.selectoresPorNombre.participantesListaIcono)
    );
    if (!dParticipantesListaIcono) {
      setTimeout(this.inicializar.bind(this));
      return;
    }
    dParticipantesListaIcono.click();
    const dListaParticipante = (
      document.querySelector(this.selectoresPorNombre.listaParticipante)
    );
    if (!dListaParticipante) {
      setTimeout(this.inicializar.bind(this));
      return;
    }
    dParticipantesListaIcono.click();
    this.intervalo = setInterval(this.revisarCambios.bind(this));
  }

  revisarCambios = () => {
    const dParticipantesSinCamaraGrupoPrimerIntegrante = (
      document
      .querySelector(
        this.selectoresPorNombre.participantesSinCamaraGrupoPrimerIntegrante
      )
    );
    if (
      !dParticipantesSinCamaraGrupoPrimerIntegrante ||
      (
        dParticipantesSinCamaraGrupoPrimerIntegrante
        .closest('[data-participant-id]')
      ) ||
      (
        dParticipantesSinCamaraGrupoPrimerIntegrante
        .closest('[data-priority]')
      )
    ) {
      return;
    }
    const dParticipantesSinCamaraGrupo = (
      dParticipantesSinCamaraGrupoPrimerIntegrante.closest('[style]')
    );
    if (!dParticipantesSinCamaraGrupo) {
      return;
    }
    const participantesSinCamaraGrupoTexto = (
      dParticipantesSinCamaraGrupo.firstChild.innerText.trim()
    );
    const participantesSinCamaraGrupoDimension = (
      dParticipantesSinCamaraGrupo.offsetWidth +
      'x' +
      dParticipantesSinCamaraGrupo.offsetHeight
    );
    let ejecucionEsPrimera = !document.querySelector('.jsGrilla');
    if (!this.participantesSinCamaraGrupoTexto) {
      ejecucionEsPrimera = true;
      this.participantesSinCamaraGrupoTexto = participantesSinCamaraGrupoTexto;
      this.participantesSinCamaraGrupoDimension = (
        participantesSinCamaraGrupoDimension
      );
    }
    let participantesSinCamaraCantidadCambio = (
      this.participantesSinCamaraGrupoTexto !==
      participantesSinCamaraGrupoTexto
    );
    let participantesSinCamaraGrupoDimensionCambio = (
      this.participantesSinCamaraGrupoDimension !==
      participantesSinCamaraGrupoDimension
    );
    const dNotificacion = (
      document.querySelector(this.selectoresPorNombre.notificacion)
    );
    let hayNotificacion = (dNotificacion && !dNotificacion.dataset.fueVista);
    if (hayNotificacion) {
      dNotificacion.dataset.fueVista = true;
    }
    if (
      !ejecucionEsPrimera &&
      !participantesSinCamaraCantidadCambio &&
      !participantesSinCamaraGrupoDimensionCambio &&
      !hayNotificacion
    ) {
      return;
    }
    this.participantesSinCamaraGrupoTexto = participantesSinCamaraGrupoTexto;
    this.participantesSinCamaraGrupoDimension = (
      participantesSinCamaraGrupoDimension
    );
    this.grillarParticipantes(dParticipantesSinCamaraGrupo);
  }

  grillarParticipantes = (dParticipantesSinCamaraGrupo) => {
    this.participantesConCamaraPorNombre = {};
    const dParticipantes = (
      document.querySelectorAll(this.selectoresPorNombre.participante)
    );
    dParticipantes.forEach(this.agregarParticipanteConCamara);
    this.participantes = [];
    this.participantesPorNombre = {};
    const dListaParticipantes = (
      document.querySelectorAll(this.selectoresPorNombre.listaParticipante)
    );
    dListaParticipantes.forEach(this.agregarParticipante);
    if (!this.participantes.length) {
      return;
    }
    let dGrilla = document.querySelector('.jsGrilla');
    if (dGrilla) {
      dGrilla.remove();
    }
    dGrilla = document.createElement('div');
    dGrilla.classList.add('jsGrilla');
    dGrilla.style.position = 'absolute';
    dGrilla.style.width = '100%';
    dGrilla.style.height = '100%';
    dGrilla.style.backgroundColor = '#3c4043';
    dGrilla.style.top = 0;
    dGrilla.style.left = 0;
    const participantesGrupoAnchura = dParticipantesSinCamaraGrupo.offsetWidth;
    const participantesGrupoAltura = dParticipantesSinCamaraGrupo.offsetHeight;
    let anchura = participantesGrupoAnchura;
    let altura = participantesGrupoAltura;
    let anchuraDivisor = 2;
    let alturaDivisor = 1;
    while (
      (participantesGrupoAnchura / anchura) *
      (participantesGrupoAltura / altura) <
      this.participantes.length
    ) {
      anchura = participantesGrupoAnchura / anchuraDivisor;
      altura = participantesGrupoAltura / alturaDivisor;
      if (anchuraDivisor === alturaDivisor) {
        anchuraDivisor++;
      } else {
        alturaDivisor++;
      }
    }
    for (const participante of this.participantes) {
      const dParticipante = document.createElement('div');
      dParticipante.classList.add('jsParticipanteLampara');
      dParticipante.style.display = 'inline-block';
      dParticipante.style.height = (altura + 'px');
      dParticipante.style.position = 'relative';
      dParticipante.style.width = (anchura + 'px');

      const dParticipanteImagen = participante.dImagen.cloneNode(true);
      dParticipanteImagen.className = '';
      dParticipanteImagen.classList.add('jsParticipanteLamparaImagen');
      dParticipanteImagen.style.float = 'left';
      dParticipanteImagen.style.height = 'initial';
      dParticipanteImagen.style.width = ((anchura / 2) + 'px');
      dParticipante.appendChild(dParticipanteImagen);

      const dParticipanteAudio = participante.dAudio.cloneNode(true);
      dParticipanteAudio.className = '';
      dParticipanteAudio.classList.add('jsParticipanteLamparaAudio');
      dParticipanteAudio.style.transform = 'scale(0.5)';
      dParticipante.appendChild(dParticipanteAudio);

      const dParticipanteNombre = document.createElement('span');
      dParticipanteNombre.classList.add('jsParticipanteLamparaNombre');
      dParticipanteNombre.textContent = participante.nombre;
      dParticipanteNombre.style.background = 'rgba(0, 0, 0, .8)';
      dParticipanteNombre.style.color = 'white';
      dParticipanteNombre.style.left = '0';
      dParticipanteNombre.style.position = 'absolute';
      dParticipanteNombre.style.top = '0';
      dParticipante.appendChild(dParticipanteNombre);

      dGrilla.appendChild(dParticipante);
    }
    dParticipantesSinCamaraGrupo.appendChild(dGrilla);
  }

  agregarParticipanteConCamara = (dParticipante) => {
    const dParticipanteNombre = (
      dParticipante.innerText.split('\n').pop().trim()
    );
    if (!dParticipanteNombre) {
      return;
    }
    const dParticipanteVideo = dParticipante.querySelector('video');
    if (!dParticipanteVideo) {
      return;
    }
    this.participantesConCamaraPorNombre[dParticipanteNombre] = true;
  }

  agregarParticipante = (dListaParticipante) => {
    const nombre = dListaParticipante.querySelector('span').textContent.trim();
    if (this.participantesConCamaraPorNombre[nombre]) {
      return;
    }
    if (this.participantesPorNombre[nombre]) {
      return;
    }
    this.participantesPorNombre[nombre] = true;
    const participante = {
      nombre,
      dImagen: dListaParticipante.querySelector('img'),
      dAudio: dListaParticipante.querySelector('[data-tooltip-enabled]'),
    };
    this.participantes.push(participante);
  }

}

window.meetrilla = new Meetrilla();
