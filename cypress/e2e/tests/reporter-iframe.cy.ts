import {
  cypressAppSelect,
  removeControls,
  setupControlsExtension,
  SetupControlSettings,
} from 'cy-ext';

describe('reporter document injection', () => {
  const control: SetupControlSettings = {
    id: 'reporter-iframe-control',
    mode: { run: true, open: true },
    control: () => `<button id="reporterIframeBtn">Reporter</button>`,
    addEventListener: () => {
      // no-op: this spec only asserts the control is mounted
    },
  };

  after(() => {
    removeControls(control);
  });

  it('injects into the Cypress reporter (including #reporter-frame on 15.19+)', () => {
    setupControlsExtension(control);

    expect(
      cypressAppSelect('#controlWrapper-reporter-iframe-control').length,
      'control wrapper',
    ).eq(1);
    expect(cypressAppSelect('#reporterIframeBtn').length, 'control button').eq(
      1,
    );

    const reporterFrame = top?.document.getElementById(
      'reporter-frame',
    ) as HTMLIFrameElement | null;

    if (reporterFrame?.contentDocument) {
      expect(
        reporterFrame.contentDocument.querySelector(
          '#controlWrapper-reporter-iframe-control',
        ),
        'control is inside #reporter-frame',
      ).to.exist;

      expect(
        top?.document.querySelector('#controlWrapper-reporter-iframe-control'),
        'control is not on the parent document',
      ).to.not.exist;
    } else {
      expect(
        top?.document.querySelector('#controlWrapper-reporter-iframe-control'),
        'control is on the parent document (pre-15.19)',
      ).to.exist;
    }
  });
});
