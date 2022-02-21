export interface IProject {
  name: string;
  url: string;
  skip?: string;
}

export interface IConfig {
  projects: IProject[];
}

export const config: IConfig = {
  projects: [
    /*
    {
      name: "abap2xlsx",
      url: "https://github.com/sapmentors/abap2xlsx",
      skip: "demos/",
    },
    */
    {
      name: "steampunk-2111-api",
      url: "https://github.com/abapedia/steampunk-2111-api",
      skip: "",
    },
    {
      name: "steampunk-2202-api",
      url: "https://github.com/abapedia/steampunk-2202-api",
      skip: "",
    }
  ]
}