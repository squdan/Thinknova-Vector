/* Export Code */
module.exports = {
  getContract: function() {
    return 'contract greeter { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } }';
  }
}
