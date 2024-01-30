import 'package:flutter/material.dart';
import 'package:app/task_card.dart';

class Dashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Mock data
    final String shiftStatus = "shift_status";
    final List<String> taskTags = ["task_tag", "task_tag"];
    final int numOfComments = 3;
    final String taskDueDate = "task_due_date";
    final String taskTitle = "task_title";
    final String taskStatus = "task_status";
    final String taskId = "1004";

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            // user shift status
            Center(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 15, 20, 10),
                child: Text(
                  'You are currently $shiftStatus',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ),
            ),

            // On Going tasks
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 15, 20, 10),
              child: Text(
                'Tasks you are working on',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            TaskCard(
              taskId: taskId,
              title: taskTitle,
              dueDate: '2024-01-30',
              tags: ['task_tag', 'task_tag'],
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0,  20, 15),
              child: Row(
                children: <Widget>[
                  const Icon(Icons.image),
                  const Icon(Icons.image),
                  const Spacer(),
                  Text('$numOfComments comments'),
                ],
              ),
            ),
            TaskCard(
              taskId: '1038',
              title: taskTitle,
              dueDate: '2024-02-3',
              tags: ['task_tag', 'task_tag'],
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0,  20, 15),
              child: Row(
                children: <Widget>[
                  const Icon(Icons.image),
                  const Icon(Icons.image),
                  const Spacer(),
                  Text('$numOfComments comments'),
                ],
              ),
            ),
            const Divider(height: 20, thickness: 1, indent: 20, endIndent: 20),

            // New Tasks related to the user's position
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 15, 20, 10),
              child: Text(
                'Tasks related to your position',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            TaskCard(
              taskId: taskId,
              title: taskTitle,
              dueDate: '2024-01-30',
              tags: ['task_tag', 'task_tag'],
            ),
          ],
        ),
      ),
    );
  }
}
