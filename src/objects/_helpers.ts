import * as abaplint from "@abaplint/core";

export function outputDefinition(def: abaplint.IInterfaceDefinition | undefined): string {
  let ret = "";
  if (def === undefined) {
    return ret;
  }

  for (const i of def.getImplementing()) {
    ret += `Interface ${i.name}<br>\n`;
  }

  for (const a of def.getAttributes().getAll()) {
    ret += `Attribute ${a.getName()}<br>\n`;
  }

  for (const a of def.getAttributes().getConstants()) {
    ret += `Constant ${a.getName()}<br>\n`;
  }

  for (const m of def.getMethodDefinitions().getAll()) {
    ret += `Method ${m.getName()}<br>\n`;
  }

  return ret;
}

export function objectLink(type: string, name: string): string {
  const filename = buildFilename(type, name);
  return `<a href="${encodeURIComponent(filename)}">` + name + "</a>";
}

export function buildFilename(type: string, name: string) {
  let filename = name + "." + type + ".html";
  filename = filename.toLowerCase();
  filename = filename.replace(/\//g, "#");
  return filename;
}

export function objectFilename(o: abaplint.IObject) {
  return buildFilename(o.getType(), o.getName());
}