import * as abaplint from "@abaplint/core";

function outputSection(def: abaplint.IInterfaceDefinition, visibility: abaplint.Visibility): string {
  let ret = "";

  for (const t of def.getTypeDefinitions().getAll()) {
    if (t.visibility !== visibility) {
      continue;
    }
    ret += `Type <tt>${t.type.getName()}</tt><br>\n`;
  }
  for (const a of def.getAttributes().getInstancesByVisibility(visibility)) {
    ret += `Attribute <tt>${a.getName()}</tt><br>\n`;
  }
  for (const a of def.getAttributes().getStaticsByVisibility(visibility)) {
    ret += `Static Attribute <tt>${a.getName()}</tt><br>\n`;
  }
  for (const a of def.getAttributes().getConstantsByVisibility(visibility)) {
    ret += `Constant <tt>${a.getName()}</tt><br>\n`;
  }
  for (const m of def.getMethodDefinitions().getAll()) {
    if (m.getVisibility() !== visibility) {
      continue;
    }
    ret += `Method <tt>${m.getName()}</tt><br>\n`;
  }
  return ret;
}

export function outputDefinition(def: abaplint.IInterfaceDefinition | undefined): string {
  let ret = "";
  if (def === undefined) {
    return ret;
  }

  ret += "<u>Public</u><br>";
  for (const i of def.getImplementing()) {
    ret += `Interface <tt>${objectLink("INTF", i.name)}</tt><br>\n`;
  }
  ret += outputSection(def, abaplint.Visibility.Public);

  const protectedSection = outputSection(def, abaplint.Visibility.Protected);
  if (protectedSection !== "") {
    ret += "<u>Protected</u><br>";
    ret += protectedSection;
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