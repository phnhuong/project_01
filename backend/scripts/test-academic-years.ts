/**
 * Academic Year API Testing Script
 * Run: npx ts-node scripts/test-academic-years.ts
 */

const BASE_URL = 'http://localhost:3000/api/academic-years';

interface TestResult {
    name: string;
    status: 'PASS' | 'FAIL';
    details: string;
}

const results: TestResult[] = [];

async function testAPI() {
    console.log('🧪 Starting Academic Year API Tests...\n');

    // Test 1: Create first academic year (active)
    try {
        const res1 = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Năm học 2023-2024',
                startDate: '2023-09-01',
                endDate: '2024-06-30',
                isCurrent: true
            })
        });
        const data1 = await res1.json();

        if (res1.status === 201 && data1.isCurrent === true) {
            results.push({ name: 'Create Active Academic Year', status: 'PASS', details: `Created ID: ${data1.id}` });
        } else {
            results.push({ name: 'Create Active Academic Year', status: 'FAIL', details: `Status: ${res1.status}` });
        }
    } catch (error: any) {
        results.push({ name: 'Create Active Academic Year', status: 'FAIL', details: error.message });
    }

    // Test 2: Create second academic year (inactive)
    try {
        const res2 = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Năm học 2024-2025',
                startDate: '2024-09-01',
                endDate: '2025-06-30',
                isCurrent: false
            })
        });
        const data2 = await res2.json();

        if (res2.status === 201) {
            results.push({ name: 'Create Inactive Academic Year', status: 'PASS', details: `Created ID: ${data2.id}` });
        } else {
            results.push({ name: 'Create Inactive Academic Year', status: 'FAIL', details: `Status: ${res2.status}` });
        }
    } catch (error: any) {
        results.push({ name: 'Create Inactive Academic Year', status: 'FAIL', details: error.message });
    }

    // Test 3: Get all academic years
    try {
        const res3 = await fetch(BASE_URL);
        const data3 = await res3.json();

        if (res3.status === 200 && Array.isArray(data3) && data3.length === 2) {
            results.push({ name: 'Get All Academic Years', status: 'PASS', details: `Found ${data3.length} years` });
        } else {
            results.push({ name: 'Get All Academic Years', status: 'FAIL', details: `Expected 2, got ${data3.length}` });
        }
    } catch (error: any) {
        results.push({ name: 'Get All Academic Years', status: 'FAIL', details: error.message });
    }

    // Test 4: Get active academic year
    try {
        const res4 = await fetch(`${BASE_URL}/active`);
        const data4 = await res4.json();

        if (res4.status === 200 && data4.name === 'Năm học 2023-2024' && data4.isCurrent === true) {
            results.push({ name: 'Get Active Academic Year', status: 'PASS', details: `Active: ${data4.name}` });
        } else {
            results.push({ name: 'Get Active Academic Year', status: 'FAIL', details: `Wrong active year` });
        }
    } catch (error: any) {
        results.push({ name: 'Get Active Academic Year', status: 'FAIL', details: error.message });
    }

    // Test 5: Update second year to active (should deactivate first)
    try {
        const res5 = await fetch(`${BASE_URL}/2`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isCurrent: true })
        });
        const data5 = await res5.json();

        if (res5.status === 200 && data5.isCurrent === true) {
            // Verify first year is now inactive
            const checkRes = await fetch(`${BASE_URL}/active`);
            const checkData = await checkRes.json();

            if (checkData.name === 'Năm học 2024-2025') {
                results.push({ name: 'Auto-deactivate Logic', status: 'PASS', details: 'Old year deactivated, new year activated' });
            } else {
                results.push({ name: 'Auto-deactivate Logic', status: 'FAIL', details: 'Active year not switched' });
            }
        } else {
            results.push({ name: 'Auto-deactivate Logic', status: 'FAIL', details: `Status: ${res5.status}` });
        }
    } catch (error: any) {
        results.push({ name: 'Auto-deactivate Logic', status: 'FAIL', details: error.message });
    }

    // Test 6: Validation - Invalid dates
    try {
        const res6 = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Năm học lỗi',
                startDate: '2025-09-01',
                endDate: '2024-06-30',
                isCurrent: false
            })
        });
        const data6 = await res6.json();

        if (res6.status === 400 && data6.message.includes('Start date must be before end date')) {
            results.push({ name: 'Date Validation', status: 'PASS', details: 'Correctly rejected invalid dates' });
        } else {
            results.push({ name: 'Date Validation', status: 'FAIL', details: 'Should reject invalid dates' });
        }
    } catch (error: any) {
        results.push({ name: 'Date Validation', status: 'FAIL', details: error.message });
    }

    // Test 7: Delete academic year
    try {
        const res7 = await fetch(`${BASE_URL}/1`, { method: 'DELETE' });

        if (res7.status === 200) {
            results.push({ name: 'Delete Academic Year', status: 'PASS', details: 'Deleted successfully' });
        } else {
            results.push({ name: 'Delete Academic Year', status: 'FAIL', details: `Status: ${res7.status}` });
        }
    } catch (error: any) {
        results.push({ name: 'Delete Academic Year', status: 'FAIL', details: error.message });
    }

    // Print results
    console.log('\n📊 Test Results:\n');
    console.log('═'.repeat(80));

    results.forEach((result, index) => {
        const icon = result.status === 'PASS' ? '✅' : '❌';
        console.log(`${icon} Test ${index + 1}: ${result.name}`);
        console.log(`   ${result.details}`);
        console.log('─'.repeat(80));
    });

    const passed = results.filter(r => r.status === 'PASS').length;
    const total = results.length;

    console.log(`\n🎯 Summary: ${passed}/${total} tests passed (${Math.round(passed / total * 100)}%)\n`);
}

testAPI().catch(console.error);
