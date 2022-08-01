# Time Doctor 2 Extractor config

There are two json files for this extractor. One is for initial load and the second one is for increments.
These two files differ in only one parameter and that is "from" in endpoints which support date range when called.
It is recommended by TimeDoctor 2 API Docs to not use time window of more than 7 days, but test showed that a whole month can be downloaded at once.


# Configuration

User has to define an account to login with. This is a combination of email and password.
This account is used to retrieve token which is used as a parameter in all API calls.

- `email` (string):
parameters.api.authentication.loginRequest.params.email
- `password` (string - secured):
parameters.config.#password
- `datetime-from` (string - ISO datetime format):
parameters.config.datetime-from - example: `2022-07-01T00:00:00.000Z`
- `outputBucket` (string):
parameters.config.outputBucket - name of the bucket that the output tables should go to
- `incrementalOutput` (bool):
parameters.config.incrementalOutput - if set to false, truncates tables before new run
- `debug` (bool):
parameters.config.debug - set to true for debug messages to show up in Keboola


## Table output



![picture](imgs/output_scheme.png)
 