export class HTML {

  public static preAmble(extraTitle = ""): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>abapedia${extraTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.9/lunr.min.js" integrity="sha512-4xUl/d6D6THrAnXAwGajXkoWaeMNwEKK4iNfq5DotEbLPAfk6FSxSP3ydNxqDgCw1c/0Z1Jg6L8h2j+++9BZmg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
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
    return `<br>
    <center><small>Bug reports and ideas <a href="https://github.com/abapedia/abapedia.org/issues">welcome</a></small></center>
    <center><small>Made using <a href="https://abaplint.app">abaplint.app</a></small></center>
  </body>
</html>`;
  }

}