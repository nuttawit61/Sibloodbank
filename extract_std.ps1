$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$workbook = $excel.Workbooks.Open("d:\Antigavity\Statistic\สถิติ 69.xlsx")

function Get-SheetData ($sheetName, $startRow, $endRow) {
    $sheet = $workbook.Sheets.Item($sheetName)
    $data = @()
    for ($row = $startRow; $row -le $endRow; $row++) {
        $rowData = @()
        for ($col = 1; $col -le 14; $col++) {
            $val = $sheet.Cells.Item($row, $col).Text
            $rowData += $val
        }
        $data += ,$rowData
    }
    return $data
}

$result = @{
    StandardLab = Get-SheetData "Standard Lab" 1 40
    StandardTest = Get-SheetData "Standard Test" 1 20
}

$result | ConvertTo-Json -Depth 5 | Out-File -FilePath "d:\Antigavity\Statistic\standard_data.json" -Encoding UTF8

$workbook.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
