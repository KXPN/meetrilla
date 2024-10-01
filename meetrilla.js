class Meetrilla {

  participantesListaIconoSelector = '[data-panel-id][data-promo-anchor-id] i';
  participanteConCamaraNombreSelector = '[data-self-name] [role=tooltip]';
  participanteSelector = (
    '[data-panel-container-id=sidePanel1] [data-participant-id]'
  );
  participanteNombreSelector = '[data-self-name]';
  participantesGrupoUsuarioSelector = (
    '[draggable=false]:not([data-emoji],[title])'
  );

  participantes = [];
  participantesPorNombre = {};
  participantesConCamaraPorNombre = {};

  constructor() {
    const dParticipantesListaIcono = (
      document.querySelector(this.participantesListaIconoSelector)
    );
    dParticipantesListaIcono.click();
    dParticipantesListaIcono.click();
    this.intervalo = setInterval(this.grillarParticipantes.bind(this));
  }

  grillarParticipantes = () => {
    this.participantesConCamaraPorNombre = {};
    const dParticipantesConCamaraNombres = (
      document.querySelectorAll(this.participanteConCamaraNombreSelector)
    );
    dParticipantesConCamaraNombres.forEach(this.agregarParticipanteConCamara);
    this.participantes = [];
    this.participantesPorNombre = {};
    const dParticipantes = document.querySelectorAll(this.participanteSelector);
    dParticipantes.forEach(this.agregarParticipante);
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
    const dParticipantesCuadros = (
      document.querySelectorAll(this.participanteNombreSelector)
    );
    const dParticipantesGrupo = (
      dParticipantesCuadros
      [dParticipantesCuadros.length - 1]
      .parentElement
      .parentElement
      .parentElement
      .parentElement
      .parentElement
      .parentElement
      .parentElement
      .parentElement
      .previousElementSibling
    );
    const participantesGrupoAnchura = dParticipantesGrupo.offsetWidth;
    const participantesGrupoAltura = dParticipantesGrupo.offsetHeight;
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
      const dParticipanteImagen = participante.dImagen.cloneNode(true);
      dParticipanteImagen.classList.add('jsParticipanteLamparaImagen');
      dParticipanteImagen.style.float = 'right';
      dParticipanteImagen.style.width = ((anchura / 2) + 'px');
      dParticipanteImagen.style.height = 'initial';
      dParticipante.appendChild(dParticipanteImagen);
      const dParticipanteNombre = document.createElement('span');
      dParticipanteNombre.classList.add('jsParticipanteLamparaNombre');
      dParticipanteNombre.textContent = participante.nombre;
      dParticipante.appendChild(dParticipanteNombre);
      const dParticipanteAudio = participante.dAudio.cloneNode(true);
      dParticipanteAudio.classList.add('jsParticipanteLamparaAudio');
      dParticipante.appendChild(dParticipanteAudio);
      dParticipante.style.width = (anchura + 'px');
      dParticipante.style.height = (altura + 'px');
      dGrilla.appendChild(dParticipante);
    }
    dParticipantesGrupo.appendChild(dGrilla);
  }

  agregarParticipanteConCamara = (dParticipanteConCamaraNombre) => {
    this.participantesConCamaraPorNombre[dParticipanteConCamaraNombre] = true;
  }

  agregarParticipante = (dParticipante) => {
    const nombre = dParticipante.querySelector('span').textContent.trim();
    if (this.participantesConCamaraPorNombre[nombre]) {
      return;
    }
    if (this.participantesPorNombre[nombre]) {
      return;
    }
    this.participantesPorNombre[nombre] = true;
    const participante = {
      nombre,
      dImagen: dParticipante.querySelector('img'),
      dAudio: dParticipante.querySelector('[data-tooltip-enabled]'),
    };
    this.participantes.push(participante);
  }

}

window.meetrilla = new Meetrilla();
