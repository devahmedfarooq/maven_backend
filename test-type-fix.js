const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Adjust if your server runs on different port

async function testTypeFieldFix() {
    console.log('Testing Type Field Fix...\n');

    try {
        // Test 1: Validate current state
        console.log('1. Validating current type field state...');
        const validationResponse = await axios.get(`${BASE_URL}/items/validate/type-field`);
        console.log('Validation result:', validationResponse.data);

        // Test 2: Run migration
        console.log('\n2. Running type field migration...');
        const migrationResponse = await axios.post(`${BASE_URL}/items/migrate/type-field`);
        console.log('Migration result:', migrationResponse.data);

        // Test 3: Validate after migration
        console.log('\n3. Validating after migration...');
        const postValidationResponse = await axios.get(`${BASE_URL}/items/validate/type-field`);
        console.log('Post-migration validation:', postValidationResponse.data);

        // Test 4: Test getting items
        console.log('\n4. Testing item retrieval...');
        const itemsResponse = await axios.get(`${BASE_URL}/items`);
        console.log('Items retrieved:', itemsResponse.data.items?.length || 0, 'items');

        // Test 5: Test getting feed
        console.log('\n5. Testing feed retrieval...');
        const feedResponse = await axios.get(`${BASE_URL}/items/feed`);
        console.log('Feed retrieved successfully:', !!feedResponse.data);

        console.log('\n✅ All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testTypeFieldFix(); 