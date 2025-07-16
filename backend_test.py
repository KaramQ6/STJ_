#!/usr/bin/env python3
"""
SmartTour.JO Backend API Test Suite
Tests all backend API endpoints for functionality, database connectivity, and error handling.
"""

import requests
import json
import time
from datetime import datetime
import sys

# Backend URL - using the public endpoint from frontend .env
BACKEND_URL = "http://localhost:8001/api"

class BackendTester:
    def __init__(self):
        self.test_results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        
    def log_test(self, test_name, passed, message="", response_data=None):
        """Log test results"""
        self.total_tests += 1
        if passed:
            self.passed_tests += 1
            status = "✅ PASS"
        else:
            self.failed_tests += 1
            status = "❌ FAIL"
            
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "response_data": response_data
        }
        self.test_results.append(result)
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if response_data and not passed:
            print(f"   Response: {response_data}")
        print()

    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Hello World":
                    self.log_test("Basic API Connectivity", True, 
                                f"Successfully connected to {BACKEND_URL}")
                    return True
                else:
                    self.log_test("Basic API Connectivity", False, 
                                f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Basic API Connectivity", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Basic API Connectivity", False, f"Connection error: {str(e)}")
            return False

    def test_cors_headers(self):
        """Test CORS configuration"""
        try:
            # Test with Origin header to trigger CORS response
            headers = {'Origin': 'http://localhost:3000'}
            response = requests.get(f"{BACKEND_URL}/", headers=headers, timeout=10)
            
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
            }
            
            if cors_headers['Access-Control-Allow-Origin']:
                self.log_test("CORS Configuration", True, 
                            f"CORS properly configured: {cors_headers}")
                return True
            else:
                self.log_test("CORS Configuration", False, 
                            f"CORS headers missing: {cors_headers}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Configuration", False, f"Error testing CORS: {str(e)}")
            return False

    def test_create_status_check(self):
        """Test POST /api/status endpoint"""
        try:
            test_data = {
                "client_name": "SmartTour Test Client"
            }
            
            response = requests.post(f"{BACKEND_URL}/status", 
                                   json=test_data, 
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'client_name', 'timestamp']
                
                if all(field in data for field in required_fields):
                    if data['client_name'] == test_data['client_name']:
                        self.log_test("Create Status Check", True, 
                                    f"Successfully created status check with ID: {data['id']}")
                        return data['id']
                    else:
                        self.log_test("Create Status Check", False, 
                                    f"Client name mismatch: expected {test_data['client_name']}, got {data['client_name']}")
                        return None
                else:
                    missing_fields = [f for f in required_fields if f not in data]
                    self.log_test("Create Status Check", False, 
                                f"Missing required fields: {missing_fields}")
                    return None
            else:
                self.log_test("Create Status Check", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return None
        except requests.exceptions.RequestException as e:
            self.log_test("Create Status Check", False, f"Request error: {str(e)}")
            return None

    def test_get_status_checks(self):
        """Test GET /api/status endpoint"""
        try:
            response = requests.get(f"{BACKEND_URL}/status", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check if the first item has required fields
                        first_item = data[0]
                        required_fields = ['id', 'client_name', 'timestamp']
                        
                        if all(field in first_item for field in required_fields):
                            self.log_test("Get Status Checks", True, 
                                        f"Successfully retrieved {len(data)} status checks")
                            return True
                        else:
                            missing_fields = [f for f in required_fields if f not in first_item]
                            self.log_test("Get Status Checks", False, 
                                        f"Status check items missing fields: {missing_fields}")
                            return False
                    else:
                        self.log_test("Get Status Checks", True, 
                                    "Successfully retrieved empty status checks list")
                        return True
                else:
                    self.log_test("Get Status Checks", False, 
                                f"Expected list, got {type(data)}: {data}")
                    return False
            else:
                self.log_test("Get Status Checks", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Get Status Checks", False, f"Request error: {str(e)}")
            return False

    def test_database_persistence(self):
        """Test database persistence by creating and retrieving data"""
        try:
            # Create a unique status check
            unique_name = f"DB Test Client {int(time.time())}"
            test_data = {"client_name": unique_name}
            
            # Create the status check
            create_response = requests.post(f"{BACKEND_URL}/status", 
                                          json=test_data, 
                                          timeout=10)
            
            if create_response.status_code != 200:
                self.log_test("Database Persistence", False, 
                            f"Failed to create test data: HTTP {create_response.status_code}")
                return False
            
            created_data = create_response.json()
            created_id = created_data['id']
            
            # Wait a moment for database write
            time.sleep(1)
            
            # Retrieve all status checks
            get_response = requests.get(f"{BACKEND_URL}/status", timeout=10)
            
            if get_response.status_code != 200:
                self.log_test("Database Persistence", False, 
                            f"Failed to retrieve data: HTTP {get_response.status_code}")
                return False
            
            all_checks = get_response.json()
            
            # Look for our created item
            found_item = None
            for item in all_checks:
                if item.get('id') == created_id and item.get('client_name') == unique_name:
                    found_item = item
                    break
            
            if found_item:
                self.log_test("Database Persistence", True, 
                            f"Successfully persisted and retrieved data with ID: {created_id}")
                return True
            else:
                self.log_test("Database Persistence", False, 
                            f"Created item with ID {created_id} not found in database")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Database Persistence", False, f"Request error: {str(e)}")
            return False

    def test_error_handling(self):
        """Test API error handling"""
        try:
            # Test invalid JSON
            response = requests.post(f"{BACKEND_URL}/status", 
                                   data="invalid json", 
                                   headers={'Content-Type': 'application/json'},
                                   timeout=10)
            
            if response.status_code in [400, 422]:  # Bad Request or Unprocessable Entity
                self.log_test("Error Handling - Invalid JSON", True, 
                            f"Properly handled invalid JSON with HTTP {response.status_code}")
            else:
                self.log_test("Error Handling - Invalid JSON", False, 
                            f"Unexpected response to invalid JSON: HTTP {response.status_code}")
            
            # Test missing required field
            response = requests.post(f"{BACKEND_URL}/status", 
                                   json={}, 
                                   timeout=10)
            
            if response.status_code in [400, 422]:  # Bad Request or Unprocessable Entity
                self.log_test("Error Handling - Missing Field", True, 
                            f"Properly handled missing required field with HTTP {response.status_code}")
                return True
            else:
                self.log_test("Error Handling - Missing Field", False, 
                            f"Unexpected response to missing field: HTTP {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Error Handling", False, f"Request error: {str(e)}")
            return False

    def test_response_format(self):
        """Test API response format consistency"""
        try:
            # Test root endpoint response format
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and 'message' in data:
                    self.log_test("Response Format - Root", True, 
                                "Root endpoint returns proper JSON format")
                else:
                    self.log_test("Response Format - Root", False, 
                                f"Root endpoint format invalid: {data}")
                    return False
            
            # Test status endpoint response format
            response = requests.get(f"{BACKEND_URL}/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Response Format - Status List", True, 
                                "Status list endpoint returns proper JSON array")
                    return True
                else:
                    self.log_test("Response Format - Status List", False, 
                                f"Status list format invalid: {type(data)}")
                    return False
            else:
                self.log_test("Response Format", False, 
                            f"Failed to test response format: HTTP {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Response Format", False, f"Request error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("SmartTour.JO Backend API Test Suite")
        print("=" * 60)
        print(f"Testing backend at: {BACKEND_URL}")
        print()
        
        # Run tests in logical order
        self.test_basic_connectivity()
        self.test_cors_headers()
        self.test_response_format()
        self.test_create_status_check()
        self.test_get_status_checks()
        self.test_database_persistence()
        self.test_error_handling()
        
        # Print summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests)*100:.1f}%")
        print()
        
        if self.failed_tests > 0:
            print("FAILED TESTS:")
            for result in self.test_results:
                if "❌" in result["status"]:
                    print(f"  - {result['test']}: {result['message']}")
            print()
        
        return self.failed_tests == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("🎉 All backend tests passed!")
        sys.exit(0)
    else:
        print("⚠️  Some backend tests failed!")
        sys.exit(1)