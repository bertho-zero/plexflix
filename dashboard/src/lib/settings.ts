import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { merge } from 'lodash';

export interface MainSettings {
  password: string;
  jwtSecret: string;
}

interface PublicSettings {
  initialized: boolean;
}

interface AllSettings {
  main: MainSettings;
  public: PublicSettings;
}

const SETTINGS_PATH = process.env.NEXT_CONFIG_DIRECTORY
  ? `${process.env.NEXT_CONFIG_DIRECTORY}/settings.json`
  : path.join(__dirname, '../../config/settings.json');

class Settings {
  private data: AllSettings;

  constructor(initialSettings?: AllSettings) {
    this.data = {
      main: {
        password: '',
        jwtSecret: '',
      },
      public: {
        initialized: false,
      },
    };
    if (initialSettings) {
      this.data = merge(this.data, initialSettings);
    }
  }

  get main(): MainSettings {
    if (!this.data.main.jwtSecret) {
      this.data.main.jwtSecret = this.generatejwtSecret();
      this.save();
    }
    return this.data.main;
  }

  set main(data: MainSettings) {
    this.data.main = data;
  }

  get public(): PublicSettings {
    return this.data.public;
  }

  set public(data: PublicSettings) {
    this.data.public = data;
  }

  private generatejwtSecret(): string {
    return Buffer.from(`${Date.now()}${randomUUID()}`).toString('base64');
  }

  /**
   * Settings Load
   *
   * This will load settings from file unless an optional argument of the object structure
   * is passed in.
   * @param overrideSettings If passed in, will override all existing settings with these
   * values
   */
  public load(overrideSettings?: AllSettings): Settings {
    if (overrideSettings) {
      this.data = overrideSettings;
      return this;
    }

    if (!fs.existsSync(SETTINGS_PATH)) {
      this.save();
    }
    const data = fs.readFileSync(SETTINGS_PATH, 'utf-8');

    if (data) {
      this.data = merge(this.data, JSON.parse(data));
      this.save();
    }
    return this;
  }

  public save(): void {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(this.data, undefined, ' '));
  }
}

let settings: Settings | undefined;

export const getSettings = (initialSettings?: AllSettings): Settings => {
  if (!settings) {
    settings = new Settings(initialSettings).load();
  }

  return settings;
};

export default Settings;
