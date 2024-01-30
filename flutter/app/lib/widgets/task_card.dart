import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class TaskCard extends StatelessWidget {
  final String taskId;
  final String title;
  final DateTime dueDate;
  final List<String>? tags;

  const TaskCard({
    Key? key,
    required this.taskId,
    required this.title,
    required this.dueDate,
    required this.tags,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final String formattedDueDate = DateFormat.yMd().format(dueDate);

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
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
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        subtitle: Text('Due by $formattedDueDate'),
        trailing: Wrap(
          spacing: 4,
          children: tags?.map((tag) => Chip(
                label: Text(tag),
                backgroundColor: Colors.lightBlue,
              )).toList() ?? [],
        ),
        onTap: () {},
      ),
    );
  }
}
