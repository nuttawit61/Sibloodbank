$dir = "d:\Antigavity\Statistic"
$files = Get-ChildItem -Path $dir -Filter "*.xlsx" | Where-Object { $_.Name -match "^[^\d]+\s\d{2}\.xlsx$" } | Sort-Object Name

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false

$allData = @{}

foreach ($f in $files) {
    if ($f.Name -match "(\d{2})") {
        $year = $Matches[1]
    } else {
        continue
    }
    
    $file = $f.FullName
    Write-Host "Extracting $file (Year $year)..."
    
    $yearData = @{ StandardLab = @(); StandardTest = @() }
    
    try {
        $wb = $excel.Workbooks.Open($file)
        
        # --- Standard Lab ---
        try {
            $wsLab = $wb.Worksheets.Item("Standard Lab")
            for ($r = 1; $r -le 40; $r++) {
                $col1 = $wsLab.Cells.Item($r, 1).Text
                $col2 = $wsLab.Cells.Item($r, 2).Text
                $months = @()
                for ($c = 2; $c -le 14; $c++) {
                    $val = $wsLab.Cells.Item($r, $c).Value2
                    if ($val -eq $null -or $val.ToString().StartsWith("-21468262")) {
                        $months += $null
                    } else {
                        $months += $val
                    }
                }
                
                $rowObj = [PSCustomObject]@{
                    rowNum = $r
                    label = $col1.Trim()
                    months = $months
                }
                $yearData.StandardLab += $rowObj
            }
        } catch { Write-Host "No Standard Lab in $year" }

        # --- Standard Test ---
        try {
            $wsTest = $wb.Worksheets.Item("Standard Test")
            for ($r = 1; $r -le 30; $r++) {
                $col1 = $wsTest.Cells.Item($r, 1).Text
                $months = @()
                for ($c = 2; $c -le 9; $c++) {
                    $val = $wsTest.Cells.Item($r, $c).Value2
                    if ($val -eq $null -or $val.ToString().StartsWith("-21468262")) {
                        $months += $null
                    } else {
                        $months += $val
                    }
                }
                
                $rowObj = [PSCustomObject]@{
                    rowNum = $r
                    label = $col1.Trim()
                    cols = $months
                }
                $yearData.StandardTest += $rowObj
            }
        } catch { Write-Host "No Standard Test in $year" }
        
        $allData[$year] = $yearData
        $wb.Close($false)
    } catch {
        Write-Host "Error processing $file - $_"
    }
}

$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

$jsonPath = "d:\Antigavity\Statistic\standard_raw.json"
$allData | ConvertTo-Json -Depth 5 | Out-File -FilePath $jsonPath -Encoding utf8
Write-Host "Data saved to $jsonPath"
