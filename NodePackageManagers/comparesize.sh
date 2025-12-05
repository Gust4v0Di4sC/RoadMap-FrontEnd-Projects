function Get-FolderSizeReadable {
    param ($Path)

    if (-Not (Test-Path $Path)) {
        return "Pasta não encontrada"
    }

    $size = (Get-ChildItem -Recurse $Path -ErrorAction SilentlyContinue |
             Measure-Object -Property Length -Sum).Sum

    if ($size -ge 1GB) {
        return "{0:N2} GB" -f ($size / 1GB)
    } elseif ($size -ge 1MB) {
        return "{0:N2} MB" -f ($size / 1MB)
    } elseif ($size -ge 1KB) {
        return "{0:N2} KB" -f ($size / 1KB)
    } else {
        return "$size bytes"
    }
}

$projects = @{
    "Yarn" = ".\teste-yarn\node_modules"
    "pnpm" = ".\teste-pnpm\node_modules"
    "Bun"  = ".\teste-bun\node_modules"
}

Write-Host "=============================="
Write-Host "   COMPARAÇÃO NODE_MODULES"
Write-Host "==============================`n"

foreach ($proj in $projects.Keys) {
    $path = $projects[$proj]
    $size = Get-FolderSizeReadable -Path $path
    Write-Host "$proj → $size"
}

Write-Host "`n=============================="
Write-Host "Fim da análise."
Write-Host "=============================="
