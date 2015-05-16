var root = new Firebase(...);


root.child("players/").on("child_added",
  function(newMessageSnapshot) {
    notifyUser(newMessageSnapshot);
    newMessageSnapshot.ref().remove();
  });

root.child(otherUserId).child("inbound-messages").push("Hi other user!");
