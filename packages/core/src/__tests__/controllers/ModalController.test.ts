import { ModalController } from '../../index';

// -- Tests --------------------------------------------------------------------
describe('ModalController', () => {
  it('should have valid default state', () => {
    expect(ModalController.state.open).toEqual(false);
  });

  it('should update state correctly on open()', async () => {
    await ModalController.open();
    expect(ModalController.state.open).toEqual(true);
  });

  it('should update state correctly on close()', () => {
    ModalController.close();
    expect(ModalController.state.open).toEqual(false);
  });
});
