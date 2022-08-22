import { cypressAppSelect, setupControlsExtension } from 'cy-ext';
import { mockButton } from '../../controls/mock-button';

describe('no style tag', () => {
  it('should have style tag after setup controls', () => {
    cypressAppSelect('html head style').remove();
    expect(cypressAppSelect('html head style').length, 'Style tags').eq(0);

    setupControlsExtension(mockButton(true));

    expect(cypressAppSelect('html head style').length, 'Style tags').eq(1);
  });
});
