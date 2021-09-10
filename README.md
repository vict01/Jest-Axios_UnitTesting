# This is a unit test based on Jest, focused on validating the JS ApiClient class.

## Test Framework Requirements:
```
1. Jest: JavaScript unit testing framework
2. axios: The webClient to API management
```

## Test Framework Structure (The most important parts)
* getReplicationResult.js: Target class to be tested
* getReplicationResult.test.js: Test file created to carry out the unit test
* coverage\lcov-report\index.html: HTML report about test results in details

## Instructions to run and check the test
1. Open terminal console and make sure you are in the root path of the project, and run the command below to install any possible dependencies.
   - npm i
2. Run the tests by executing "npm test" command.
3. Pay attention console output while test runs. 
4. Once test finishes to run, in the console terminal you can see the testing summary report, with enough information in detail about steps, scope, validations, results, time and more.
5. Go to the index.html file mentioned in the "Framework Structure" section above, and open it in web browser in order to see in a more readable manner the same details mentioned in step 3 before. 
   - 4.1. Click on getReplicationResult.js in order to see coverage level (line by line) that was reached during test.

## Findings during building and running the test
```
1. In the JS class it was necessary to comment the line below, one condition in the loop, since otherwise a successful return would never be met.
    - replicationResponse.status === REPLICATION_STATUSES.initialized
    
2. In the JS class it was necessary to change the first line below by the second one, since otherwise the condition in the loop and the last If, would never be met, because the expected response format don't match this structure.
    - replicationResponse.data.status
    - replicationResponse.status
```