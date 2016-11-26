contract testtx {
    address caller;

    function testtx(){
        caller = msg.sender;
    }

    function() returns (address previousCaller) {
        previousCaller = caller;
        caller = msg.sender;
    }

}