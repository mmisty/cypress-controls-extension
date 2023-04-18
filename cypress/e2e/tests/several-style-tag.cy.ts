import { cypressAppSelect, setupControlsExtension } from 'cy-ext';
import { mockButton } from '../../controls/mock-button';

describe('no style tag', () => {
  it('should not add other tag when already several', () => {
    cypressAppSelect('html head style').remove();
    cypressAppSelect('html head').append(
      `<style type="text/css"> body { color: #fff; }</style>`,
    );

    cypressAppSelect('html head').append(
      `<style type="text/css">body { color: #abc; }</style>`,
    );

    expect(cypressAppSelect('html head style').length, 'Style tags').eq(2);

    setupControlsExtension(mockButton(true));

    expect(cypressAppSelect('html head style').length, 'Style tags').eq(3);
  });
});
