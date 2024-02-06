import 'dart:math';

class Task {
  String taskId;
  String title;
  String description;
  String location;
  String status;
  List<String> assignedTo;
  String createdBy;
  List<String>? toolsRequired;
  List<String>? comments;
  DateTime dueDate;
  List<String>? tags;

  Task({
    required this.taskId,
    required this.title,
    required this.description,
    required this.location,
    required this.status,
    required this.assignedTo,
    required this.createdBy,
    this.toolsRequired,
    this.comments,
    required this.dueDate,
    required this.tags,
  });
}

// Generate a random hex string to simulate an ObjectId.
String generateObjectId() {
  var random = Random();
  var values = List<int>.generate(4, (i) => random.nextInt(256));
  return values.map((v) => v.toRadixString(16).padLeft(2, '0')).join();
}

DateTime generateDueDate() {
  var random = Random();
  DateTime now = DateTime.now();
  DateTime today = DateTime(now.year, now.month, now.day);
  return today.subtract(Duration(days: random.nextInt(7)));
}

List<Task> generateMockTasks(int count) {
  List<Task> tasks = [];
  var random = Random();

  // Sample data to randomly pick from.
  const titles = ['Fix Light', 'Repair Door', 'Paint Wall', 'Check Pipes', 'Replace Window', 'Room Check'];
  const descriptions = ['The light in room 205 is flickering.', 'The door hinge is broken.', 'Wall needs a new coat of paint.', 'Pipes are leaking.', 'Window is cracked.'];
  const locations = ['COR240', 'MST213', 'RTH212', 'HUG109', 'WIL248', 'UCC249'];
  const statuses = ['Open', 'In Progress', 'Completed', 'Closed'];
  const tag = ['SMA', 'BM', 'TA'];

  for (int i = 0; i < count; i++) {
    List<String> selectedTags = List<String>.generate(1, (_) => tag[random.nextInt(tag.length)]);

    tasks.add(Task(
      taskId: generateObjectId(),
      title: titles[random.nextInt(titles.length)],
      description: descriptions[random.nextInt(descriptions.length)],
      location: locations[random.nextInt(locations.length)],
      status: statuses[random.nextInt(statuses.length)],
      assignedTo: List<String>.generate(3, (_) => generateObjectId()),
      createdBy: generateObjectId(),
      toolsRequired: ['Hammer', 'Screwdriver', 'Ladder'],
      comments: List<String>.generate(2, (_) => generateObjectId()),
      dueDate: generateDueDate(),
      tags: selectedTags,
    ));
  }
  return tasks;
}
