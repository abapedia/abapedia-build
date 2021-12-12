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