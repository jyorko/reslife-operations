import 'package:flutter/material.dart';
import 'package:app/widgets/task_detail.dart';

class TaskCard extends StatelessWidget {
  final String taskId;
  final String title;
  final String dueDate;
  final String? tag;
  final List<String>? comments;

  const TaskCard({
    Key? key,
    required this.taskId,
    required this.title,
    required this.dueDate,
    this.tag,
    this.comments,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // final String formattedDueDate = DateFormat.yMd().format(dueDate);
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => TaskDetail(taskId: taskId)),
        );
      },
      child: Card(
        margin: const EdgeInsets.fromLTRB(20, 10, 20, 10),
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Left side: Task id, title, due date, etc.
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Task ID: $taskId',
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2.0),
                      child: Text(
                        title,
                        style: const TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      'Due by $dueDate',
                      style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.black54),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 5.0),
                      child: Row(
                        children: <Widget>[
                          const Icon(
                              Icons.image), // Placeholder for member images
                          const Icon(Icons.image), // Another placeholder
                          const Spacer(),
                          Text('${comments?.length ?? 0} comments'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              // TODO: show tags on cards
              // Right side: Tags
              // Column(
              //   crossAxisAlignment: CrossAxisAlignment.end,
              //   children: tags != null
              //       ? tags.map((tag) => Chip(
              //             label: Text(tag),
              //             backgroundColor: Colors.lightBlue,
              //           )).toList()
              //       : [const Text('No tags')],
              // ),
            ],
          ),
        ),
      ),
    );
  }
}
