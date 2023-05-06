'use strict';

import { expect } from 'chai';
import { TNL } from '../dist/index';
import { TNLTypes } from '../dist/index';
export function sleep(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const TNL_API_KEY = '';
const tnl = new TNL(TNL_API_KEY);
describe('A REALLY QUICK TNL TEST', () => {
  it('should create an imagine command and have a response ', async () => {
    const imagineRes = await tnl.imagine('A cat playing piano');
    console.log(imagineRes);

    await sleep(60000);

    const messageProgresss = await tnl.getMessageAndProgress(
      imagineRes.messageId,
    );

    console.log(`Progress: ${messageProgresss.progress}`);

    const buttonRes = await tnl.button(
      messageProgresss.response.buttons[0] as TNLTypes.ButtonTypes,
      '3VVNxa96OIBhpiLVxQFs',
    );
    console.log(buttonRes);

    //Expect buttonRes.messageId
    expect(buttonRes.messageId).to.be.a('string');
  }).timeout(80000);
  it('should get info ', async () => {
    const infoRes = await tnl.getInfo();
    console.log(infoRes);

    await sleep(2000);

    const r2 = await tnl.getMessageAndProgress(infoRes.messageId);

    // Expect 'Visibility Mode' to be in the response
    expect(
      (r2.response as TNLTypes.WebhookResponses.Info).content[
        'Visibility Mode'
      ],
    ).to.be.equal('Public');
  }).timeout(10000);
  it('should set the first setting ', async () => {
    const getSettingsRes = await tnl.getSettings();
    console.log(getSettingsRes);

    await sleep(3000);

    const r2 = await tnl.getMessageAndProgress(getSettingsRes.messageId);

    console.log(r2);

    console.log(
      (r2.response as TNLTypes.WebhookResponses.GetSettings).buttons[2],
    );
    const setSettingsRes = await tnl.setSettings(
      (r2.response as TNLTypes.WebhookResponses.GetSettings).buttons[2],
    );
    await sleep(2000);

    const r3 = await tnl.getMessageAndProgress(setSettingsRes.messageId);

    console.log(r3);

    expect(true);
  }).timeout(10000);
  it('should do an img-2-img request', async () => {
    const img2imgres = await tnl.img2img(
      'A funny monkey holding a lollipo',
      'https://images.pexels.com/photos/321552/pexels-photo-321552.jpeg?cs=srgb&dl=pexels-oleksandr-pidvalnyi-321552.jpg&fm=jpg',
    );
    console.log(img2imgres);

    await sleep(60000);

    const r2 = await tnl.getMessageAndProgress(img2imgres.messageId);

    console.log(r2);

    expect(r2.progress).to.be.equal(100);
  }).timeout(60000);
  it('should do a describe', async () => {
    const describeRes = await tnl.describe(
      'https://images.pexels.com/photos/321552/pexels-photo-321552.jpeg?cs=srgb&dl=pexels-oleksandr-pidvalnyi-321552.jpg&fm=jpg',
    );
    console.log(describeRes);

    await sleep(60000);

    const r2 = await tnl.getMessageAndProgress(describeRes.messageId);

    console.log(describeRes);

    expect(r2.progress).to.be.equal(100);
    expect(r2.response).to.be.an('object');
  }).timeout(80000);
});
