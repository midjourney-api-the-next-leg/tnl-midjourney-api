'use strict';

import axios from 'axios';

const BASE_URL = 'https://api.thenextleg.io/v2';
const BASE_URL_GET_UPSCALE = 'https://api.thenextleg.io';
const BASE_URL_LOAD_BALANCER = 'https://api.thenextleg.io/loadBalancer';

export declare namespace TNLTypes {
  type ButtonTypes =
    | 'U1'
    | 'U2'
    | 'U3'
    | 'U4'
    | 'V1'
    | 'V2'
    | 'V3'
    | 'V4'
    | '🔄'
    | '🪄 Make Variations'
    | '❤️ Favorite';

  type SlashCommands = 'relax' | 'fast' | 'private' | 'stealth';

  type Settings =
    | 'MJ version 1'
    | 'MJ version 2'
    | 'MJ version 3'
    | 'MJ version 4'
    | 'MJ version 5'
    | 'Niji version 4'
    | 'Niji version 5'
    | 'MJ Test'
    | 'MJ Test Photo'
    | 'Half quality'
    | 'Base quality'
    | 'Base quality'
    | 'High quality (2x cost)'
    | 'Style low'
    | 'Style med'
    | 'Style high'
    | 'Style very high'
    | 'Reset Settings'
    | 'Public mode'
    | 'Stealth mode'
    | 'Remix mode'
    | 'Fast mode'
    | 'Relax mode';

  namespace Request {
    interface BaseRequest {
      ref: string;
      webhookOverride: string;
    }

    interface Imagine extends BaseRequest {
      msg: string;
    }

    interface SlashCommand extends BaseRequest {
      cmd: SlashCommands;
    }

    interface SetSettings extends BaseRequest {
      settingsToggle: Settings;
    }
    type Info = BaseRequest;

    interface Buttons extends BaseRequest {
      button: ButtonTypes;
      buttonMessageId: string;
    }

    interface ButtonsLB extends Buttons {
      loadBalanceId: string;
    }

    interface Describe extends BaseRequest {
      url: string;
    }
  }

  namespace Response {
    type Message = {
      createdAt: string;
      messageId: string;
      success: boolean;
    };
    interface MessageLB extends Message {
      loadBalanceId: string;
      accountId: string;
    }
    interface MessageAndProgress extends Request.BaseRequest {
      progress: number | 'incomplete';
      response:
        | WebhookResponses.BaseResponse
        | WebhookResponses.Imagine
        | WebhookResponses.Describe
        | WebhookResponses.Info
        | WebhookResponses.Settings
        | WebhookResponses.SlashCommand;
    }
    type Seed = {
      seed: string;
    };
    type Upscale = {
      url: string;
    }
  }

  namespace WebhookResponses {
    interface BaseResponse {
      ref: string;
      createdAt: string;
      responseAt: string;
      originatingMessageId: string;
      buttonMessageId: string;
      imageUrl: string;
      buttons: string[];
    }
    interface Imagine extends BaseResponse {
      content: string;
    }
    type Button = Imagine;
    interface Describe extends BaseResponse {
      content: string[] | string;
      type: 'describe';
    }
    interface SlashCommand extends BaseResponse {
      content: string;
    }
    interface Settings extends BaseResponse {
      content: string;
    }
    interface Info extends BaseResponse {
      content: {
        'Fast Time Remaining': string;
        'Job Mode': string;
        'Lifetime Usage': string;
        'Queued Jobs (fast)': string;
        'Queued Jobs (relax)': string;
        'Relaxed Usage': string;
        Subscription: string;
        'Visibility Mode': string;
      };
      type: 'info';
    }
  }
}

export class TNL {
  /* Private Instance Fields */
  private token: string;

  /* Constructor */
  constructor(token: string) {
    this.token = token;
  }

  private createHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
  }

  /**
   * Create a new image from a prompt
   * @param prompt - The prompt you want to use to generate the image
   * @param ref - A reference string that will be returned in the webhook response
   * @param webhookOverride - A webhook URL that will be used instead of the one set in the dashboard
   */
  public async imagine(
    prompt: string,
    ref = '',
    webhookOverride = '',
  ): Promise<TNLTypes.Response.Message> {
    const request: TNLTypes.Request.Imagine = {
      msg: prompt,
      ref,
      webhookOverride,
    };

    const res = await axios.post(`${BASE_URL}/imagine`, request, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.Message;
  }

  /**
   * Create an image from a prompt and an image
   * @param prompt - The prompt you want to use to generate the image
   * @param imgUrl - The URL of the image you want to use as the base image
   * @param ref - A reference string that will be returned in the webhook response
   * @param webhookOverride - A webhook URL that will be used instead of the one set in the dashboard
   */
  public async img2img(
    prompt: string,
    imgUrl: string,
    ref = '',
    webhookOverride = '',
  ): Promise<TNLTypes.Response.Message> {
    const request: TNLTypes.Request.Imagine = {
      msg: `${imgUrl} ${prompt}`,
      ref,
      webhookOverride,
    };

    const res = await axios.post(`${BASE_URL}/imagine`, request, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.Message;
  }

  /**
   * Describe an image
   * @param imgUrl - The URL of the image you want to describe
   * @param ref - A reference string that will be returned in the webhook response
   * @param webhookOverride - A webhook URL that will be used instead of the one set in the dashboard
   */
  public async describe(
    imgUrl: string,
    ref = '',
    webhookOverride = '',
  ): Promise<TNLTypes.Response.Message> {
    const request: TNLTypes.Request.Describe = {
      url: imgUrl,
      ref,
      webhookOverride,
    };
    const res = await axios.post(`${BASE_URL}/describe`, request, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.Message;
  }

  /**
   * Use a button on an image. This can include upscale, variation, re-roll and more.
   * @param button - A button type
   * @param buttonMessageId - The buttonMessageId of the message that contains the button
   * @param ref - A reference string that will be returned in the webhook response
   * @param webhookOverride - A webhook URL that will be used instead of the one set in the dashboard
   */
  public async button(
    button: TNLTypes.ButtonTypes,
    buttonMessageId: string,
    ref = '',
    webhookOverride = '',
  ): Promise<TNLTypes.Response.Message> {
    const request: TNLTypes.Request.Buttons = {
      button,
      buttonMessageId,
      ref,
      webhookOverride,
    };
    const res = await axios.post(`${BASE_URL}/button`, request, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.Message;
  }

  /**
   * Get a seed of a message
   * @param messageId - The message ID of the message you want to get the seed for
   */
  public async getSeed(messageId: string): Promise<TNLTypes.Response.Seed> {
    const request = {
      messageId,
    };
    const res = await axios.post(`${BASE_URL}/seed`, request, {
      headers: this.createHeaders(),
    });

    return res.data as TNLTypes.Response.Seed;
  }

  /**
   * Use a slash command such as relax, fast, private, or stealth
   * @param slashCommand - A slash command type
   * @param ref - A reference string that will be returned in the webhook response
   * @param webhookOverride - A webhook URL that will be used instead of the one set in the dashboard
   */
  public async slashCommand(
    slashCommand: TNLTypes.SlashCommands,
    ref = '',
    webhookOverride = '',
  ): Promise<TNLTypes.Response.Message> {
    const request: TNLTypes.Request.SlashCommand = {
      cmd: slashCommand,
      ref,
      webhookOverride,
    };

    const res = await axios.post(`${BASE_URL}/slash-commands`, request, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.Message;
  }

  /**
   * Get the settings available on your account
   */
  public async getSettings(): Promise<TNLTypes.Response.Message> {
    const res = await axios.get(`${BASE_URL}/settings`, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.Message;
  }

  /**
   * Set a setting on your account. You should use `getSettings()` in order to retrieve the settings available in your account.
   * @param setting - The setting you want to change
   * @param ref - A reference string that will be returned in the webhook response
   * @param webhookOverride - A webhook URL that will be used instead of the one set in the dashboard
   */
  public async setSettings(
    setting: TNLTypes.Settings,
    ref = '',
    webhookOverride = '',
  ): Promise<TNLTypes.Response.Message> {
    const request: TNLTypes.Request.SetSettings = {
      settingsToggle: setting,
      ref,
      webhookOverride,
    };

    const res = await axios.post(`${BASE_URL}/settings`, request, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.Message;
  }

  /**
   * Get Information about your account including Fast Time Remaining, Job Mode, Queued Jobs and more.
   */
  public async getInfo(): Promise<TNLTypes.Response.Message> {
    const res = await axios.get(`${BASE_URL}/info`, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.Message;
  }

  /**
   * Get the progress and status of any message that you have sent
   * @param messageId - The message ID of the message you want to get the progress of
   * @param expireMins - A timeout for the request in minutes. If the request takes longer than this, it will return as 'incomplete'
   */
  public async getMessageAndProgress(messageId: string, expireMins?: number): Promise<TNLTypes.Response.MessageAndProgress> {
    let url = `${BASE_URL}/message/${messageId}`;

    if (expireMins) {
      url += `?expireMins=${expireMins}`;
    }
    const res = await axios.get(url, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.MessageAndProgress;
  }

  /**
   * Upscale an image
   * @param button - A button type
   * @param buttonMessageId - The buttonMessageId of the message that contains the button
   */
  public async upscaleImgUrl(
    button: TNLTypes.ButtonTypes,
    buttonMessageId: string
  ): Promise<TNLTypes.Response.Upscale> {
    const url = `${BASE_URL_GET_UPSCALE}/upscale-img-url?buttonMessageId=${buttonMessageId}&button=${button}`;

    const res = await axios.get(url, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.Upscale;
  }
}

export class TNLBalanced {
  /* Private Instance Fields */
  private token: string;

  /* Constructor */
  constructor(token: string) {
    this.token = token;
  }

  private createHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
  }

  /**
   * Create a new image from a prompt using load balance feature
   * @param prompt - The prompt you want to use to generate the image
   * @param ref - A reference string that will be returned in the webhook response
   * @param webhookOverride - A webhook URL that will be used instead of the one set in the dashboard
   */
  public async imagine(
    prompt: string,
    ref = '',
    webhookOverride = '',
  ): Promise<TNLTypes.Response.MessageLB> {
    const request: TNLTypes.Request.Imagine = {
      msg: prompt,
      ref,
      webhookOverride,
    };

    const res = await axios.post(`${BASE_URL_LOAD_BALANCER}/imagine`, request, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.MessageLB;
  }

  /**
   * Describe an image
   * @param imgUrl - The URL of the image you want to describe
   * @param ref - A reference string that will be returned in the webhook response
   * @param webhookOverride - A webhook URL that will be used instead of the one set in the dashboard
   */
  public async describe(
    imgUrl: string,
    ref = '',
    webhookOverride = '',
  ): Promise<TNLTypes.Response.MessageLB> {
    const request: TNLTypes.Request.Describe = {
      url: imgUrl,
      ref,
      webhookOverride,
    };
    const res = await axios.post(`${BASE_URL_LOAD_BALANCER}/describe`, request, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.MessageLB;
  }

  /**
   * Use a button on an image. This can include upscale, variation, re-roll and more.
   * @param button - A button type
   * @param buttonMessageId - The buttonMessageId of the message that contains the button
   * @param loadBalanceId - The loadBalanceId received in the response to the imagine call
   * @param ref - A reference string that will be returned in the webhook response
   * @param webhookOverride - A webhook URL that will be used instead of the one set in the dashboard
   */
  public async button(
    button: TNLTypes.ButtonTypes,
    buttonMessageId: string,
    loadBalanceId: string,
    ref = '',
    webhookOverride = '',    
  ): Promise<TNLTypes.Response.MessageLB> {
    const request: TNLTypes.Request.ButtonsLB = {
      button,
      buttonMessageId,
      ref,
      webhookOverride,
      loadBalanceId,
    };

    const res = await axios.post(`${BASE_URL_LOAD_BALANCER}/button`, request, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.MessageLB;
  }

  /**
   * Get the progress and status of any message that you have sent
   * @param messageId - The message ID of the message you want to get the progress of
   * @param loadBalanceId - The loadBalanceId received in the response to the imagine call
   * @param expireMins - A timeout for the request in minutes. If the request takes longer than this, it will return as 'incomplete'
   */
  public async getMessageAndProgress(
    messageId: string,
    loadBalanceId: string,
    expireMins?: number
  ): Promise<TNLTypes.Response.MessageAndProgress> {
    let url = `${BASE_URL_LOAD_BALANCER}/message/${messageId}?loadBalanceId=${loadBalanceId}`;

    if (expireMins) {
      url += `&expireMins=${expireMins}`;
    }

    const res = await axios.get(url, {
      headers: this.createHeaders(),
    });
    return res.data as TNLTypes.Response.MessageAndProgress;
  }
}
