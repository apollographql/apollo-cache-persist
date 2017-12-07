## questions about testing

* how should i mock the apollo cache to test extract / restore? since the apollo
  cache is just an abstract class, i can't really implement it myself. do i just
  use inmemory here?
  * install inmemory & hermes as dev dependencies
  * write the test and run them against inmemory & hermes
  * only test the public api (only import from the root index file)

- what are the important files to be testing?
