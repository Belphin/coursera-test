(function () {
  var names = ["Yaakov", "John", "Jen", "Jason", "Paul", "Frank", "Larry", "Paula", "Laura", "Jim"];

  for (var name in names) {

    var firstLetter = names[name].charAt(0)

    if (firstLetter.toLowerCase() != "j") {
      helloSpeaker.speak(names[name]);
    } else {
      byeSpeaker.speak(names[name]);
    }
  }
})();