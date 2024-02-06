import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:app/widgets/task_detail.dart';

class TaskCard extends StatelessWidget {
  final String taskId;
  final String title;
  final DateTime dueDate;
  final List<String>? tags;
  final List<String>? comments;

  const TaskCard({
    Key? key,
    required this.taskId,
    required this.title,
    required this.dueDate,
    required this.tags,
    required this.comments,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final String formattedDueDate = DateFormat.yMd().format(dueDate);

    return Card(
      margin: const EdgeInsets.fromLTRB(20, 10, 20, 10),
      child: ListTile(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Text(
              'Task ID: $taskId',
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
            Text(
              title,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),

            // due date
            Text(
              'Due by $formattedDueDate',
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.black54,
              ),
            ),
            // Circle images of the member assigned to the task and the num of comments
            // for now, we are not going to use image
            Padding(
              padding: const EdgeInsets.fromLTRB(0, 5, 0, 0),
              child: Row(
                children: <Widget>[
                  const Icon(Icons.image),
                  const Icon(Icons.image),
                  const Spacer(),
                  Text('${comments?.length ?? 0} comments'),
                ],
              ),
            ),
          ],
        ),
        trailing: Wrap(
          spacing: 4,
          children: tags
                  ?.map((tag) => Chip(
                        label: Text(tag),
                        backgroundColor: Colors.lightBlue,
                      ))
                  .toList() ??
              [],
        ),
        // onTap card to see task detail
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => TaskDetail(taskId: taskId)),
          );
        },
      ),
    );
  }
}
