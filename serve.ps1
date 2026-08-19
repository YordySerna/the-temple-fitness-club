param(
  # por defecto sirve la carpeta donde está este mismo script
  [string]$Root = $PSScriptRoot,
  [int]$Port = 8767
)

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".js"="application/javascript; charset=utf-8"; ".json"="application/json; charset=utf-8";
  ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".png"="image/png"; ".webp"="image/webp";
  ".svg"="image/svg+xml"; ".ico"="image/x-icon"; ".mp4"="video/mp4"; ".woff2"="font/woff2";
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "serving $Root on http://localhost:$Port/"

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }
    $path = Join-Path $Root ($rel -replace '/', '\')

    # --- POST /guardar --------------------------------------------------
    # Solo para desarrollo. Esta maquina no tiene ffmpeg ni encoder WebP,
    # pero el navegador si: canvas.toBlob('image/webp') comprime y ademas
    # respeta el canal alfa, que WIC no sabe leer de un WebP.
    # Recibe ?destino=imagenes/algo.webp y escribe el cuerpo crudo.
    #
    # Acotado a proposito: solo POST, solo dentro de $Root, y solo
    # extensiones de imagen. No sirve para nada mas.
    if ($req.HttpMethod -eq 'POST' -and $rel -eq 'guardar') {
      $destino = $req.QueryString['destino']
      $lleno = $null
      if ($destino) {
        $tentativa = Join-Path $Root ($destino -replace '/', '\')
        $completo  = [System.IO.Path]::GetFullPath($tentativa)
        $raizFull  = [System.IO.Path]::GetFullPath($Root)
        $ext2      = [System.IO.Path]::GetExtension($completo).ToLower()
        if ($completo.StartsWith($raizFull) -and $ext2 -in @('.webp','.png','.jpg','.jpeg')) {
          $lleno = $completo
        }
      }
      if ($lleno) {
        $ms = New-Object System.IO.MemoryStream
        $req.InputStream.CopyTo($ms)
        [System.IO.File]::WriteAllBytes($lleno, $ms.ToArray())
        $txt = "OK $($ms.Length)"
        Write-Host "guardado $destino ($([math]::Round($ms.Length/1KB,1)) KB)"
      } else {
        $res.StatusCode = 400
        $txt = "destino invalido"
      }
      $b = [System.Text.Encoding]::UTF8.GetBytes($txt)
      $res.ContentType = "text/plain; charset=utf-8"
      $res.AddHeader("Access-Control-Allow-Origin", "*")
      $res.ContentLength64 = $b.Length
      $res.OutputStream.Write($b, 0, $b.Length)
      $res.OutputStream.Close()
      continue
    }

    if ((Test-Path $path -PathType Container)) { $path = Join-Path $path "index.html" }

    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
      $res.AddHeader("Cache-Control", "no-store")
      $res.AddHeader("Accept-Ranges", "bytes")
      $bytes = [System.IO.File]::ReadAllBytes($path)

      $range = $req.Headers["Range"]
      if ($range -and $range -match 'bytes=(\d+)-(\d*)') {
        $start = [int]$Matches[1]
        $end = if ($Matches[2]) { [int]$Matches[2] } else { $bytes.Length - 1 }
        if ($end -ge $bytes.Length) { $end = $bytes.Length - 1 }
        $len = $end - $start + 1
        $res.StatusCode = 206
        $res.AddHeader("Content-Range", "bytes $start-$end/$($bytes.Length)")
        $res.ContentLength64 = $len
        $res.OutputStream.Write($bytes, $start, $len)
      } else {
        $res.StatusCode = 200
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      }
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 $rel")
      $res.ContentType = "text/plain; charset=utf-8"
      $res.ContentLength64 = $msg.Length
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
    $res.OutputStream.Close()
  } catch {
    Write-Host "ERR $($_.Exception.Message)"
  }
}
