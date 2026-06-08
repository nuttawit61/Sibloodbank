$json = Get-Content 'd:\Antigavity\Statistic\standard_raw.json' -Raw | ConvertFrom-Json
$years = $json.psobject.properties.Name | Sort-Object

$outputFile = "d:\Antigavity\Statistic\mapped_standard.js"
$jsContent = "// Mapped Standard Lab & Test Data for Dashboard
"

foreach ($y in $years) {
    $yData = $json.psobject.properties[$y].value
    
    function Get-LabRow($rowNum) {
        $row = $yData.StandardLab | Where-Object { $_.rowNum -eq $rowNum } | Select-Object -First 1
        if ($null -eq $row) { return "[null,null,null,null,null,null,null,null,null,null,null,null]" }
        $arr = @()
        for ($i = 0; $i -lt 12; $i++) {
            if ($null -eq $row.months[$i]) { $arr += "null" } else { $arr += $row.months[$i].ToString() }
        }
        return "[" + ($arr -join ",") + "]"
    }
    
    function Get-TestCol($colIdx) {
        $arr = @()
        for ($r = 3; $r -le 14; $r++) {
            $row = $yData.StandardTest | Where-Object { $_.rowNum -eq $r } | Select-Object -First 1
            if ($null -eq $row -or $null -eq $row.cols[$colIdx]) { $arr += "null" } else { $arr += $row.cols[$colIdx].ToString() }
        }
        return "[" + ($arr -join ",") + "]"
    }
    
    $jsContent += "const STD$y = {
"
    $jsContent += "  // --- Standard Lab ---
"
    $jsContent += "  lab_abo_rh_hdfn: " + (Get-LabRow 6) + ",
"
    $jsContent += "  lab_dat: " + (Get-LabRow 7) + ",
"
    $jsContent += "  lab_iat_abo: " + (Get-LabRow 8) + ",
"
    $jsContent += "  lab_iat_ab_screen: " + (Get-LabRow 9) + ",
"
    $jsContent += "  lab_xmatch_hdfn: " + (Get-LabRow 10) + ",
"
    $jsContent += "  lab_ab_iden_hdfn: " + (Get-LabRow 11) + ",
"
    $jsContent += "  lab_exchange: " + (Get-LabRow 12) + ",
"
    $jsContent += "  lab_total_case_hdfn: " + (Get-LabRow 14) + ",
"
    $jsContent += "  lab_intra_uterine: " + (Get-LabRow 15) + ",
"
    
    $jsContent += "  lab_anc_abo_rh: " + (Get-LabRow 18) + ",
"
    $jsContent += "  lab_anc_rh_ve: " + (Get-LabRow 19) + ",
"
    $jsContent += "  lab_anc_rh_del: " + (Get-LabRow 20) + ",
"
    $jsContent += "  lab_anc_ab_iden: " + (Get-LabRow 21) + ",
"
    
    $jsContent += "  lab_bg_abo: " + (Get-LabRow 25) + ",
"
    $jsContent += "  lab_bg_rh: " + (Get-LabRow 26) + ",
"
    $jsContent += "  lab_bg_rh_del: " + (Get-LabRow 27) + ",
"
    $jsContent += "  lab_bg_ab_screen: " + (Get-LabRow 28) + ",
"
    $jsContent += "  lab_bg_ab_iden: " + (Get-LabRow 29) + ",
"
    
    $jsContent += "  lab_cell_alsever: " + (Get-LabRow 33) + ",
"
    $jsContent += "  lab_cell_5_glycerol: " + (Get-LabRow 34) + ",
"
    $jsContent += "  lab_cell_12_glycerol: " + (Get-LabRow 35) + ",
"
    $jsContent += "  lab_cell_40_glycerol: " + (Get-LabRow 36) + ",
"
    $jsContent += "  lab_cell_ph_6_0: " + (Get-LabRow 37) + ",
"
    $jsContent += "  lab_cell_ph_5_4: " + (Get-LabRow 38) + ",
"
    $jsContent += "  lab_cell_1_papain: " + (Get-LabRow 39) + ",
"
    $jsContent += "  lab_cell_abo: " + (Get-LabRow 40) + ",
"
    
    $jsContent += "  // --- Standard Test ---
"
    $jsContent += "  test_abo: " + (Get-TestCol 0) + ",
"
    $jsContent += "  test_rh: " + (Get-TestCol 1) + ",
"
    $jsContent += "  test_dat: " + (Get-TestCol 2) + ",
"
    $jsContent += "  test_iat: " + (Get-TestCol 3) + ",
"
    $jsContent += "  test_iat_ab_cells: " + (Get-TestCol 4) + ",
"
    $jsContent += "  test_xmatch: " + (Get-TestCol 5) + ",
"
    $jsContent += "  test_iden: " + (Get-TestCol 6) + "
"
    $jsContent += "};

"
}

$jsContent | Out-File -FilePath $outputFile -Encoding utf8
Write-Host "JavaScript data saved to $outputFile"
