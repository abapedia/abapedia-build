export class HTML {

  public static preAmble(extraTitle = ""): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>abapedia${extraTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        font-family: sans-serif;
      }
      a, a:visited, a:hover, a:active {
        color: blue;
      }
    </style>
  </head>
  <body>\n`;
  }

  public static postAmble(): string {
    return `  </body>
</html>`;
  }

}