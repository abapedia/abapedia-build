export interface IProject {
  name: string;
  url: string;
}

export interface IConfig {
  projects: IProject[];
}

export const config: IConfig = {
  projects: [
    {
      name: "abap2xlsx",
      url: "https://github.com/sapmentors/abap2xlsx",
    }
  ]
}