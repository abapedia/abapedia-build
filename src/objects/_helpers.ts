import * as abaplint from "@abaplint/core";

function typeText(id: abaplint.TypedIdentifier): string {
  const type = id.getType();
  let typeText = "";
  if (type instanceof abaplint.BasicTypes.CSequenceType) {
    typeText = "csequence";
  } else if (type instanceof abaplint.BasicTypes.CLikeType) {
    typeText = "clike";
  } else if (type instanceof abaplint.BasicTypes.XSequenceType) {
    typeText = "xsequence";
  } else if (type instanceof abaplint.BasicTypes.NumericGenericType) {
    typeText = "numeric";
  } else {
    typeText = type.getQualifiedName() !== undefined ? type.getQualifiedName()! : type.toABAP();
  }
  return typeText;
}

function methodParameters(m: abaplint.IMethodDefinition): string {
  let ret = "";

  const optional = m.getParameters().getOptional();

  if (m.getParameters().getImporting().length > 0) {
    ret += `&nbsp;&nbsp;IMPORTING<br>\n`;
  }
  for (const p of m.getParameters().getImporting()) {
    const opt: string = optional.some(a => a.toUpperCase() === p.getName().toUpperCase()) ? " Optional" : "";
    ret += "&nbsp;&nbsp;&nbsp;&nbsp<tt>" + p.getName() + `</tt> TYPE <tt>${typeText(p)}</tt>${opt}<br>\n`;
  }

  if (m.getParameters().getChanging().length > 0) {
    ret += `&nbsp;&nbsp;CHANGING<br>\n`;
  }
  for (const p of m.getParameters().getChanging()) {
    const opt: string = optional.some(a => a.toUpperCase() === p.getName().toUpperCase()) ? " Optional" : "";
    ret += "&nbsp;&nbsp;&nbsp;&nbsp<tt>" + p.getName() + `</tt> TYPE <tt>${typeText(p)}</tt>${opt}<br>\n`;
  }

  if (m.getParameters().getExporting().length > 0) {
    ret += `&nbsp;&nbsp;EXPORTING<br>\n`;
  }
  for (const p of m.getParameters().getExporting()) {
    ret += "&nbsp;&nbsp;&nbsp;&nbsp<tt>" + p.getName() + `</tt> TYPE <tt>${typeText(p)}</tt><br>\n`;
  }

  const returning = m.getParameters().getReturning();
  if (returning) {
    ret += "&nbsp;&nbsp;RETURNING <tt>" + returning.getName() + "</tt> TYPE <tt>" + typeText(returning) + "</tt><br>\n";
  }

  for (const r of m.getRaising()) {
    ret += `&nbsp;&nbsp;RAISING <tt>${objectLink("CLAS", r)}</tt><br>\n`;
  }
  for (const e of m.getExceptions()) {
    ret += "&nbsp;&nbsp;EXCEPTIONS <tt>" + e + "</tt><br>\n";
  }
  return ret;
}

function outputSection(def: abaplint.IInterfaceDefinition, visibility: abaplint.Visibility): string {
  let ret = "";

  for (const t of def.getTypeDefinitions().getAll()) {
    if (t.visibility !== visibility) {
      continue;
    }
    ret += `Type <tt>${t.type.getName()}</tt> TYPE <tt>${typeText(t.type)}</tt><br>\n`;
  }
  for (const a of def.getAttributes().getInstancesByVisibility(visibility)) {
    ret += `Attribute <tt>${a.getName()}</tt> TYPE <tt>${typeText(a)}</tt><br>\n`;
  }
  for (const a of def.getAttributes().getStaticsByVisibility(visibility)) {
    ret += `Static Attribute <tt>${a.getName()}</tt> TYPE <tt>${typeText(a)}</tt><br>\n`;
  }
  for (const a of def.getAttributes().getConstantsByVisibility(visibility)) {
    ret += `Constant <tt>${a.getName()}</tt> TYPE <tt>${typeText(a)}</tt><br>\n`;
  }
  for (const m of def.getMethodDefinitions().getAll()) {
    if (m.getVisibility() !== visibility) {
      continue;
    }
    if (m.isStatic() === true) {
      ret += `Static Method <tt>${m.getName()}</tt><br>\n`;
    } else {
      ret += `Method <tt>${m.getName()}</tt><br>\n`;
    }
    ret += methodParameters(m);
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