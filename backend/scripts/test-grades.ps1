# Grade Management API Test Script
$baseUrl = "http://localhost:3000/api/grades"
$results = @()

Write-Host ""
Write-Host "Testing Grade Management API..." -ForegroundColor Cyan
Write-Host ""

# Test 1
Write-Host "Test 1: Create Grade - Khoi 10" -ForegroundColor Yellow
try {
    $body = '{"name":"Khối 10","level":10}'
    $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $body -ContentType "application/json"
    $grade1Id = $response.id
    Write-Host "PASS - Created with ID: $grade1Id" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "FAIL"
}

Start-Sleep -Milliseconds 500

# Test 2
Write-Host "Test 2: Create Grade - Khoi 11" -ForegroundColor Yellow
try {
    $body = '{"name":"Khối 11","level":11}'
    $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $body -ContentType "application/json"
    Write-Host "PASS - Created with ID: $($response.id)" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "FAIL" -ForegroundColor Red
    $results += "FAIL"
}

Start-Sleep -Milliseconds 500

# Test 3
Write-Host "Test 3: Create Grade - Khoi 12" -ForegroundColor Yellow
try {
    $body = '{"name":"Khối 12","level":12}'
    $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $body -ContentType "application/json"
    $grade3Id = $response.id
    Write-Host "PASS - Created with ID: $($response.id)" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "FAIL" -ForegroundColor Red
    $results += "FAIL"
}

Start-Sleep -Milliseconds 500

# Test 4
Write-Host "Test 4: Get All Grades" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method Get
    if ($response.Count -eq 3) {
        Write-Host "PASS - Found 3 grades" -ForegroundColor Green
        $results += "PASS"
    } else {
        Write-Host "FAIL - Expected 3, got $($response.Count)" -ForegroundColor Red
        $results += "FAIL"
    }
} catch {
    Write-Host "FAIL" -ForegroundColor Red
    $results += "FAIL"
}

Start-Sleep -Milliseconds 500

# Test 5
Write-Host "Test 5: Get Grade by ID" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/$grade1Id" -Method Get
    Write-Host "PASS - Retrieved grade" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "FAIL" -ForegroundColor Red
    $results += "FAIL"
}

Start-Sleep -Milliseconds 500

# Test 6
Write-Host "Test 6: Update Grade" -ForegroundColor Yellow
try {
    $body = '{"name":"Khối 10 (Updated)","level":10}'
    $response = Invoke-RestMethod -Uri "$baseUrl/$grade1Id" -Method Put -Body $body -ContentType "application/json"
    Write-Host "PASS - Updated successfully" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "FAIL" -ForegroundColor Red
    $results += "FAIL"
}

Start-Sleep -Milliseconds 500

# Test 7
Write-Host "Test 7: Delete Grade" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/$grade3Id" -Method Delete
    Write-Host "PASS - Deleted successfully" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "FAIL" -ForegroundColor Red
    $results += "FAIL"
}

# Summary
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

$passed = ($results | Where-Object { $_ -eq "PASS" }).Count
$total = $results.Count
$percentage = [math]::Round(($passed / $total) * 100, 2)

Write-Host "Total Tests: $total"
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $($total - $passed)" -ForegroundColor Red
Write-Host "Pass Rate: $percentage%"
Write-Host ""

if ($percentage -eq 100) {
    Write-Host "All tests passed!" -ForegroundColor Green
} else {
    Write-Host "Some tests failed." -ForegroundColor Yellow
}
Write-Host ""
