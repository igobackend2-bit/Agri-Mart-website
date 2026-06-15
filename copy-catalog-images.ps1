# Copy all product images from sibling Igo- projects into AgriMart public/catalog
$base = "D:\Igo-websites"
$catalog = "$base\Igo-AgriMart\public\catalog"

function CopyImages($src, $dest) {
    if (Test-Path $src) {
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
        $files = Get-ChildItem -Path $src -File -Recurse -Include "*.jpg","*.jpeg","*.png","*.webp","*.jfif","*.avif","*.gif","*.svg"
        $copied = 0
        foreach ($f in $files) {
            $target = Join-Path $dest $f.Name
            if (-not (Test-Path $target)) {
                Copy-Item $f.FullName $target -Force
                $copied++
            }
        }
        Write-Host "  $src -> $dest  ($copied new files copied, $($files.Count) total)"
    } else {
        Write-Host "  SKIP (not found): $src"
    }
}

Write-Host "`n=== Copying Crop Care images ==="
CopyImages "$base\Igo- Crop Care\public\products\Products" "$catalog\crop-care-products"
# Also copy subfolders from crop care
$cropCareRoot = "$base\Igo- Crop Care\public\products\Products"
if (Test-Path $cropCareRoot) {
    Get-ChildItem $cropCareRoot -Directory | ForEach-Object {
        CopyImages $_.FullName "$catalog\crop-care\$($_.Name)"
    }
}

Write-Host "`n=== Copying Farmer Factory images ==="
CopyImages "$base\Igo-Farmer Factory\public\Fruits"     "$catalog\farmer-factory-fruits"
CopyImages "$base\Igo-Farmer Factory\public\Valluvam"   "$catalog\farmer-factory-valluvam"
CopyImages "$base\Igo-Farmer Factory\public\Vegetables" "$catalog\farmer-factory-vegetables"

Write-Host "`n=== Copying Nursery images ==="
CopyImages "$base\Igo-Nursery\public\images\indoor"           "$catalog\nursery-indoor"
CopyImages "$base\Igo-Nursery\public\images\outdoor"          "$catalog\nursery-outdoor"
CopyImages "$base\Igo-Nursery\public\images\product nursery"  "$catalog\nursery-essentials"

Write-Host "`n=== Done! Catalog image count ==="
$total = (Get-ChildItem $catalog -Recurse -File).Count
Write-Host "Total images in catalog: $total"

Write-Host "`n=== Listing all catalog subfolders ==="
Get-ChildItem $catalog -Directory | ForEach-Object {
    $count = (Get-ChildItem $_.FullName -File -Recurse).Count
    Write-Host "  $($_.Name): $count images"
}
