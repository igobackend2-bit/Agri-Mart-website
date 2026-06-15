$ErrorActionPreference = 'Stop'
$files = git ls-files --others --exclude-standard public/catalog/
$batch = @()
$counter = 0

Write-Host "Found $($files.Count) uncommitted images in public/catalog/..."

foreach ($file in $files) {
    $batch += $file
    if ($batch.Count -ge 20) {
        $counter++
        Write-Host "Pushing batch $counter..."
        foreach ($f in $batch) { git add "`"$f`"" }
        git commit -m "Add catalog images batch $counter"
        git push origin main
        $batch = @()
    }
}

if ($batch.Count -gt 0) {
    $counter++
    Write-Host "Pushing final batch $counter..."
    foreach ($f in $batch) { git add "`"$f`"" }
    git commit -m "Add catalog images batch $counter"
    git push origin main
}

Write-Host "Pushing any remaining files..."
git add public/
git add src/
git add package.json package-lock.json vite.config.ts fix_images.cjs .gitignore
git commit -m "Fix image paths to be relative and update config"
git push origin main

Write-Host "All done! Your images have been successfully pushed."
