// Script to run Postman tests programmatically
const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const COLLECTION_PATH = path.join(__dirname, 'ag-handloom-api-tests.postman_collection.json');
const ENVIRONMENT_PATH = path.join(__dirname, 'postman_environment.json');
const REPORT_OUTPUT_PATH = path.join(__dirname, 'postman-test-results');
const SERVER_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

// Create environment file for Postman
const createEnvironmentFile = () => {
    console.log('Creating Postman environment file...');
    
    const environment = {
        "id": "ag-handloom-env",
        "name": "AG Handloom Environment",
        "values": [
            {
                "key": "baseUrl",
                "value": SERVER_BASE_URL,
                "type": "default",
                "enabled": true
            },
            {
                "key": "orderId",
                "value": "",
                "type": "default",
                "enabled": true
            }
        ],
        "_postman_variable_scope": "environment"
    };
    
    fs.writeFileSync(ENVIRONMENT_PATH, JSON.stringify(environment, null, 2));
    console.log(`Environment file created at: ${ENVIRONMENT_PATH}`);
};

// Ensure Newman (Postman CLI) is installed
const ensureNewmanInstalled = () => {
    try {
        console.log('Checking if Newman is installed...');
        execSync('newman --version', { stdio: 'ignore' });
        console.log('Newman is already installed.');
    } catch (error) {
        console.log('Newman not found. Installing...');
        execSync('npm install -g newman newman-reporter-htmlextra', { stdio: 'inherit' });
        console.log('Newman installed successfully.');
    }
};

// Run Postman tests using Newman
const runPostmanTests = () => {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(REPORT_OUTPUT_PATH)) {
        fs.mkdirSync(REPORT_OUTPUT_PATH, { recursive: true });
    }
    
    console.log('Running Postman tests with Newman...');
    
    const command = [
        'newman run',
        `"${COLLECTION_PATH}"`,
        `--environment "${ENVIRONMENT_PATH}"`,
        '--reporters cli,htmlextra',
        `--reporter-htmlextra-export "${path.join(REPORT_OUTPUT_PATH, 'report.html')}"`,
        '--reporter-htmlextra-darkTheme',
        '--reporter-htmlextra-title "AG Handloom API Test Report"',
        '--timeout-request 10000'
    ].join(' ');
    
    try {
        execSync(command, { stdio: 'inherit' });
        console.log('Postman tests completed successfully.');
        return true;
    } catch (error) {
        console.error('Postman tests failed:', error.message);
        return false;
    }
};

// Generate performance thresholds report
const generatePerformanceReport = () => {
    console.log('Generating performance thresholds report...');
    try {
        require('./threshold-report.cjs');
        console.log('Performance threshold report generated successfully.');
        return true;
    } catch (error) {
        console.error('Failed to generate performance report:', error.message);
        return false;
    }
};

// Main function
const main = async () => {
    console.log('========================================');
    console.log('AG HANDLOOM TEST SUITE');
    console.log('========================================');
    
    // Check if server is running
    console.log(`Checking if server is running at ${SERVER_BASE_URL}...`);
    
    try {
        // Try to access the server before running tests
        const http = require('http');
        const https = require('https');
        
        const client = SERVER_BASE_URL.startsWith('https') ? https : http;
        
        await new Promise((resolve, reject) => {
            const req = client.get(SERVER_BASE_URL, res => {
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    console.log(`Server is running at ${SERVER_BASE_URL}`);
                    resolve();
                } else {
                    reject(new Error(`Server returned status code: ${res.statusCode}`));
                }
            });
            
            req.on('error', error => {
                reject(new Error(`Server not accessible: ${error.message}`));
            });
            
            req.end();
        });
    } catch (error) {
        console.error(`Error connecting to server: ${error.message}`);
        console.error('Please ensure the server is running before running tests.');
        process.exit(1);
    }
    
    // Ensure Newman is installed
    ensureNewmanInstalled();
    
    // Create environment file
    createEnvironmentFile();
    
    // Run API tests
    const apiTestsSuccess = runPostmanTests();
    
    // Generate performance report
    const performanceReportSuccess = generatePerformanceReport();
    
    console.log('========================================');
    console.log('TEST SUMMARY');
    console.log('========================================');
    console.log(`API Tests: ${apiTestsSuccess ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Performance Report: ${performanceReportSuccess ? '✅ GENERATED' : '❌ FAILED'}`);
    
    if (!apiTestsSuccess || !performanceReportSuccess) {
        console.error('Some tests failed. Please review the test reports.');
        process.exit(1);
    }
    
    console.log('All tests passed successfully!');
};

// Run the main function
main().catch(error => {
    console.error('An error occurred:', error);
    process.exit(1);
});
