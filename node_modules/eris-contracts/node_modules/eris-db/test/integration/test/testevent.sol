contract testevent {
    event TestEvent(int indexed anIndexedInt, bytes32 indexed anIndexedBytes32, bool anUnIndexedBool);

    function(){
        TestEvent(-1, "haha", true);
    }
}