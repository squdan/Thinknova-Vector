/* Export Code */
module.exports = {
  getContract: function() {
    /*
     *     return 'contract greeter {
     *                string greeting;
     *                  function greeter(string _greeting) public { greeting = _greeting; }
     *                  function greet() constant returns (string) { return greeting; }
     *                }'
     */
     //return 'contract greeter { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } }';
     return 'contract Ticket {struct TicketInfo{uint identifier; uint date; uint ticketType; address providerAddress; address clientAdress; address clientCompanyAddress; uint price; uint ticketStatus; } uint incrementalId; address ownerAddress; mapping(uint => TicketInfo) ticketMap; function Ticket() {ownerAddress = msg.sender; incrementalId = 0; } function allowTicket(uint _date, uint _ticketType, address _clientAdress, uint _maxPrice) returns (uint identifier){ticketMap[incrementalId].date = _date; ticketMap[incrementalId].ticketType = _ticketType; ticketMap[incrementalId].clientAdress = _clientAdress; ticketMap[incrementalId].clientCompanyAddress = msg.sender; ticketMap[incrementalId].ticketStatus = 0; ticketMap[incrementalId].price = _maxPrice; incrementalId++; return incrementalId-1; } function generateTicket(uint _date, uint _identifier, uint _ticketType, uint _price) returns (uint isValid){TicketInfo currentTicket = ticketMap[_identifier]; if(currentTicket.date >= _date && currentTicket.ticketStatus == 0 && currentTicket.ticketType == _ticketType && currentTicket.price >= _price){currentTicket.ticketStatus = 1; currentTicket.providerAddress = msg.sender; currentTicket.price = _price; return 1; } return 0; } function acceptTicket(uint _identifier, uint _price) returns (uint isValid){TicketInfo currentTicket = ticketMap[_identifier]; if(currentTicket.ticketStatus == 1 && currentTicket.price == _price){currentTicket.ticketStatus = 2; return 1; } return 0; } }';
    }
}
