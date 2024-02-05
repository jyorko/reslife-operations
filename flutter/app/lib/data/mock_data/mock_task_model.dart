class Task {
  final String id;
  final String title;
  final String description;
  final String location;
  final String dueDate;
  final List<String> assignedTo;
  final String createdBy;
  final String tag;
  final String status;
  final List<String>? tools;
  final List<String>? comments;

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.location,
    required this.dueDate,
    required this.assignedTo,
    required this.createdBy,
    required this.tag,
    required this.status,
    required this.tools,
    required this.comments,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      location: json['location'],
      dueDate: json['dueDate'],
      assignedTo: List<String>.from(json['assignedTo']),
      createdBy: json['createdBy'],
      tag: json['tag'],
      status: json['status'],
      tools: List<String>.from(json['tools']),
      comments: List<String>.from(json['comments']),
    );
  }
}
