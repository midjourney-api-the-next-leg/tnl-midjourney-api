# The Next Leg

The Next Leg is a module that provides functionality for creating AI-generated images with Midjourney. It provides a simple interface for interacting with Midjourney's API and performing various actions such as creating images from prompts or URLs, describing images, using buttons or slash commands, and getting account settings.

## Installation

To use this module, you need to have Node.js installed on your machine. To install this module, run the following command:

```sh
npm install tnl-midjourney-api
```

## Usage

Here is an example of how to use the module to create an image from a prompt:

```javascript
import { TNL } from 'tnl-midjourney-api';

const TNL_API_KEY = 'your_api_key_here';
const tnl = new TNL(TNL_API_KEY);

const prompt = 'a cat playing the piano';
const response = await tnl.imagine(prompt);

console.log(response);
```

## API

### `new TNL(apiKey: string)`

Creates a new instance of `TNL` with the provided `apiKey`.

### Imagine

`tnl.imagine(prompt: string, ref?: string, webhookOverride?: string): Promise<TNLTypes.Response.Message>`

Creates a new image from a prompt.

- `prompt` - The prompt you want to use to generate the image.
- `ref` (optional) - A reference string that will be returned in the webhook response.
- `webhookOverride` (optional) - A webhook URL that will be used instead of the one set in the dashboard.

### Get Progress and Message Result

`tnl.getMessageAndProgress(messageId: string, expireMins?: number): Promise<TNLTypes.Response.MessageAndProgress>`

Gets the progress and response of a message.

- `messageId` - The message ID of the message you want to get the progress and response for.
- `expireMins` (optional) - A timeout for the request in minutes. If the request takes longer than this, it will return as 'incomplete'

### Img 2 Img

`tnl.img2img(prompt: string, imgUrl: string, ref?: string, webhookOverride?: string): Promise<TNLTypes.Response.Message>`

Creates an image from a prompt and an image.

- `prompt` - The prompt you want to use to generate the image.
- `imgUrl` - The URL of the image you want to use as the base image.
- `ref` (optional) - A reference string that will be returned in the webhook response.
- `webhookOverride` (optional) - A webhook URL that will be used instead of the one set in the dashboard.

### Describe

`tnl.describe(imgUrl: string, ref?: string, webhookOverride?: string): Promise<TNLTypes.Response.Message>`

Describes an image.

- `imgUrl` - The URL of the image you want to describe.
- `ref` (optional) - A reference string that will be returned in the webhook response.
- `webhookOverride` (optional) - A webhook URL that will be used instead of the one set in the dashboard.

### Button

`tnl.button(button: TNLTypes.ButtonTypes, buttonMessageId: string, ref?: string, webhookOverride?: string): Promise<TNLTypes.Response.Message>`

Uses a button on an image.

- `button` - A button type.
- `buttonMessageId` - The buttonMessageId of the message that contains the button.
- `ref` (optional) - A reference string that will be returned in the webhook response.
- `webhookOverride` (optional) - A webhook URL that will be used instead of the one set in the dashboard.

### Get Seed

`tnl.getSeed(messageId: string): Promise<TNLTypes.Response.Seed>`

Gets a seed of a message.

- `messageId` - The message ID of the message you want to get the seed for.

### Slash Command

`tnl.slashCommand(slashCommand: TNLTypes.SlashCommands, ref?: string, webhookOverride?: string): Promise<TNLTypes.Response.Message>`

Uses a slash command such as relax, fast, private, or stealth.

- `slashCommand` - A slash command type.
- `ref` (optional) - A reference string that will be returned in the webhook response.
- `webhookOverride` (optional) - A webhook URL that will be used instead of the one set in the dashboard.

### Get Settings

`tnl.getSettings(): Promise<TNLTypes.Response.Message>`

Gets the settings available for your account.

### Set Settings

`tnl.setSettings(settings: TNLTypes.Settings, ref?: string, webhookOverride?: string): Promise<TNLTypes.Response.Message>`

Sets the settings for your account.

- `settings` - The settings you want to set.
- `ref` (optional) - A reference string that will be returned in the webhook response.
- `webhookOverride` (optional) - A webhook URL that will be used instead of the one set in the dashboard.

### Get Info

`tnl.getInfo(ref?: string, webhookOverride?: string): Promise<TNLTypes.Response.Message>`

Gets information about your account including Fast Time Remaining, Job Mode, Queued Jobs and more.

- `ref` (optional) - A reference string that will be returned in the webhook response.
- `webhookOverride` (optional) - A webhook URL that will be used instead of the one set in the dashboard.
